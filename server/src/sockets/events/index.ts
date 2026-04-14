/**
 * server/src/sockets/events/index.ts
 * EventBus → Socket.IO bridge + notification + email fan-out.
 */

import { Server } from "socket.io";
import { eventBus, DomainEvent } from "@lib/event-bus/eventBus";
import { notificationService } from "@modules/notification/notification.service";
import { sendEmail } from "@lib/email/index";
import { resultPublishedEmail, moduleGoesLiveEmail } from "@lib/email/templates";
import prisma from "@lib/prisma";

export function bindSocketEvents(io: Server) {
  // ─── Leaderboard Updated ────────────────────────────────────────────────────
  eventBus.on(DomainEvent.LEADERBOARD_UPDATED, (payload) => {
    io.to(`module:${payload.moduleId}`).emit("leaderboard:update", payload);
  });

  // ─── Module State Changed ───────────────────────────────────────────────────
  eventBus.on(DomainEvent.MODULE_STATE_CHANGED, async (payload) => {
    io.to(`event:${payload.eventId}`).emit("module:state-change", payload);
    io.to(`module:${payload.moduleId}`).emit("module:state-change", payload);

    if (payload.newState === "LIVE") {
      const mod = await prisma.module.findUnique({
        where: { id: payload.moduleId as string },
        include: { event: true },
      });
      if (!mod) return;

      // Notify all registered participants
      await notificationService.notifyModuleParticipants(
        payload.moduleId as string,
        "MODULE_LIVE",
        `${mod.title} is now LIVE!`,
        `The module "${mod.title}" in ${mod.event.title} has started. Submit your work now.`,
        { moduleId: mod.id, eventId: mod.eventId }
      );

      // Email participants
      const registrations = await prisma.registration.findMany({
        where: { moduleId: mod.id, status: "CONFIRMED" },
        include: { user: true },
      });

      await Promise.allSettled(
        registrations
          .filter((r) => r.user)
          .map((r) => {
            const template = moduleGoesLiveEmail({
              userName: r.user!.name,
              moduleName: mod.title,
              eventName: mod.event.title,
              moduleUrl: `${process.env.CLIENT_URL}/events/${mod.event.slug}/modules/${mod.slug}`,
            });
            return sendEmail({ to: r.user!.email, ...template }).catch(() => {});
          })
      );
    }
  });

  // ─── Result Published ────────────────────────────────────────────────────────
  eventBus.on(DomainEvent.RESULT_PUBLISHED, async (payload) => {
    io.to(`module:${payload.moduleId}`).emit("results:published", payload);

    const mod = await prisma.module.findUnique({
      where: { id: payload.moduleId as string },
      include: { event: true },
    });
    if (!mod) return;

    // Notify all participants
    await notificationService.notifyModuleParticipants(
      payload.moduleId as string,
      "RESULT_PUBLISHED",
      `Results published for ${mod.title}`,
      `The results for "${mod.title}" are now available. Check the leaderboard!`,
      { moduleId: mod.id }
    );

    // Email participants with their individual score
    const submissions = await prisma.submission.findMany({
      where: { moduleId: mod.id, status: "EVALUATED" },
      include: { user: true },
    });

    await Promise.allSettled(
      submissions
        .filter((s) => s.user)
        .map((s) => {
          const template = resultPublishedEmail({
            userName: s.user!.name,
            moduleName: mod.title,
            eventName: mod.event.title,
            score: s.score,
            leaderboardUrl: `${process.env.CLIENT_URL}/events/${mod.event.slug}/modules/${mod.slug}/leaderboard`,
          });
          return sendEmail({ to: s.user!.email, ...template }).catch(() => {});
        })
    );
  });
}
