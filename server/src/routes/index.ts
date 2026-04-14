/**
 * server/src/routes/index.ts
 * Root API router.
 * All module-level routes are mounted here under /api/v1.
 *
 * Pattern: /api/v1/{resource}
 * Add new module routes below as the platform grows.
 */

import { Router, Request, Response } from "express";

const router = Router();

// ─── Health Check ─────────────────────────────────────────────────────────────
router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Modulyn API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// ─── Future Module Routes ──────────────────────────────────────────────────────
// import authRoutes from "@modules/auth/auth.routes";
// import userRoutes from "@modules/user/user.routes";
// import orgRoutes from "@modules/organization/organization.routes";
// import eventRoutes from "@modules/event/event.routes";
// import moduleRoutes from "@modules/module/module.routes";
// import registrationRoutes from "@modules/registration/registration.routes";

// router.use("/auth", authRoutes);
// router.use("/users", userRoutes);
// router.use("/organizations", orgRoutes);
// router.use("/events", eventRoutes);
// router.use("/modules", moduleRoutes);
// router.use("/registrations", registrationRoutes);

export default router;
