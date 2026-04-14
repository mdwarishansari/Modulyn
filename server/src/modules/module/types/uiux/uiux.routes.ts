/**
 * server/src/modules/module/types/uiux/uiux.routes.ts
 * Isolated routes for UI/UX specific logic.
 * Base URL: /api/v1/modules/:moduleId/uiux
 */

import { Router } from "express";

const router = Router({ mergeParams: true });

// POST   /submissions          → submit figma link/images
// PATCH  /submissions/:id/score → grading

export default router;
