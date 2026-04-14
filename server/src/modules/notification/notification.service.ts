/**
 * server/src/modules/notification/notification.service.ts
 * Creates, reads, and marks notifications; emits socket events on creation.
 */

import prisma from "@lib/prisma";
import { NotificationType } from "@prisma/client";
import { io } from "@/sockets/server";

export class NotificationService {
  async create(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    metadata: Record<string, unknown> = {}
  ) {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        metadata: metadata as object,
      },
    });

    // Emit to the user's personal socket room
    if (io) {
      io.to(`user:${userId}`).emit("notification:new", {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        body: notification.body,
        createdAt: notification.createdAt,
      });
    }

    return notification;
  }

  async getUserNotifications(userId: string, limit = 30) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async markRead(notificationId: string, userId: string) {
    const notif = await prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notif) throw new Error("Notification not found");
    if (notif.userId !== userId) throw new Error("UNAUTHORIZED_ACCESS");

    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  /**
   * Notify all confirmed registrants for a module.
   */
  async notifyModuleParticipants(
    moduleId: string,
    type: NotificationType,
    title: string,
    body: string,
    metadata: Record<string, unknown> = {}
  ) {
    const registrations = await prisma.registration.findMany({
      where: { moduleId, status: "CONFIRMED" },
      select: { userId: true },
    });

    const userIds = registrations
      .map((r) => r.userId)
      .filter((id): id is string => id !== null);

    await Promise.allSettled(
      userIds.map((uid) => this.create(uid, type, title, body, metadata))
    );
  }
}

export const notificationService = new NotificationService();
