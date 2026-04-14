/**
 * server/src/routes/index.ts
 * Root API router — all module routes mounted here under /api/v1.
 *
 * Auth is now handled by Clerk middleware (requireAuth / optionalAuth).
 * There is no longer a separate auth module — Clerk handles registration/login.
 */

import { Router, Request, Response } from "express";

import userRoutes         from "@modules/user/user.routes";
import orgRoutes          from "@modules/organization/organization.routes";
import eventRoutes        from "@modules/event/event.routes";
import moduleRoutes       from "@modules/module/core/module.routes";
import registrationRoutes from "@modules/registration/registration.routes";
import teamRoutes         from "@modules/team/team.routes";
import submissionRoutes   from "@modules/submission/submission.routes";
import leaderboardRoutes  from "@modules/leaderboard/leaderboard.routes";
import notificationRoutes from "@modules/notification/notification.routes";

const router = Router();

// ─── Health Check ─────────────────────────────────────────────────────────────
router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Modulyn API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// ─── Domain Routes ─────────────────────────────────────────────────────────────
router.use("/users",         userRoutes);
router.use("/organizations", orgRoutes);
router.use("/events",        eventRoutes);
router.use("/modules",       moduleRoutes);
router.use("/registrations", registrationRoutes);
router.use("/teams",         teamRoutes);
router.use("/submissions",   submissionRoutes);
router.use("/leaderboard",   leaderboardRoutes);
router.use("/notifications", notificationRoutes);

export default router;
