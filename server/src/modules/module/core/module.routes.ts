/**
 * server/src/modules/module/core/module.routes.ts
 * Core module routes — shared CRUD operations for all module types.
 * Module-type-specific routes are mounted separately under /types/.
 */

import { Router } from "express";
// import { validate }          from "@middlewares/validate";
// import * as ModuleController from "./module.controller";
// import { createModuleSchema } from "./module.schema";

const router = Router();

// ─── Core Module CRUD ─────────────────────────────────────────────────────────

// GET    /api/v1/modules?eventId=...   → list all modules for an event
// router.get("/", ModuleController.listModules);

// POST   /api/v1/modules               → create a new module
// router.post("/", validate(createModuleSchema), ModuleController.createModule);

// GET    /api/v1/modules/:id           → get single module detail
// router.get("/:id", ModuleController.getModule);

// PATCH  /api/v1/modules/:id           → update module config/meta
// router.patch("/:id", ModuleController.updateModule);

// DELETE /api/v1/modules/:id           → delete a module
// router.delete("/:id", ModuleController.deleteModule);

// ─── Lifecycle State Transitions (explicit action endpoints) ─────────────────
// These are intentionally separate from PATCH to make state changes auditable.

// POST   /api/v1/modules/:id/open-registration
// router.post("/:id/open-registration",   ModuleController.openRegistration);

// POST   /api/v1/modules/:id/close-registration
// router.post("/:id/close-registration",  ModuleController.closeRegistration);

// POST   /api/v1/modules/:id/go-live
// router.post("/:id/go-live",             ModuleController.goLive);

// POST   /api/v1/modules/:id/finish
// router.post("/:id/finish",              ModuleController.finish);

export default router;
