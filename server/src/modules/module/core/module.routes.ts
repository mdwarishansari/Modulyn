/**
 * server/src/modules/module/core/module.routes.ts
 * Exposes core module generic CRUD paths actively filtering logic mappings globally.
 */

import { Router } from "express";
import { requireAuth } from "@middlewares/auth/requireAuth";
import { optionalAuth } from "@middlewares/auth/optionalAuth";
import * as moduleCoreController from "./module.controller";

const router = Router({ mergeParams: true });

// ─── Public ─────────────────────────────────────────────────────────────
router.get("/event/:eventId", optionalAuth, moduleCoreController.getEventModules);

// ─── Protected ──────────────────────────────────────────────────────────
router.post("/", requireAuth, moduleCoreController.createModule);
router.patch("/:moduleId/state", requireAuth, moduleCoreController.transitionModuleState);

export default router;
