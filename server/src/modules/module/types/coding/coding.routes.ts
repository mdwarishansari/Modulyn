/**
 * server/src/modules/module/types/coding/coding.routes.ts
 * Isolated routes for fast coding specific logic.
 * Base URL: /api/v1/modules/:moduleId/coding
 */

import { Router } from "express";

const router = Router({ mergeParams: true });

// POST   /problems             → add coding problem
// POST   /submissions          → run/submit code

export default router;
