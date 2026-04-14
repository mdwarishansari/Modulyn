/**
 * server/src/modules/event/event.routes.ts
 * Standard routing resolving endpoints natively back to the controller.
 */

import { Router } from "express";
import { requireAuth } from "@middlewares/auth/requireAuth";
import { optionalAuth } from "@middlewares/auth/optionalAuth";
import * as eventController from "./event.controller";

const router = Router();

// ─── Public ─────────────────────────────────────────────────────────────
// (optionalAuth checks if logged in for potential UI tracking, but doesn't block)
router.get("/", optionalAuth, eventController.listPublicEvents);
router.get("/:orgId/:slug", optionalAuth, eventController.getEventBySlug);

// ─── Protected ──────────────────────────────────────────────────────────
router.post("/", requireAuth, eventController.createEvent);
router.patch("/:eventId/state", requireAuth, eventController.transitionEventState);

export default router;
