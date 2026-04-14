/**
 * server/src/modules/module/types/hackathon/hackathon.routes.ts
 * Isolated routes for hackathon-specific module logic.
 * Base URL from main router: /api/v1/modules/:moduleId/hackathon
 */

import { Router } from "express";

const router = Router({ mergeParams: true });

// POST   /teams                → create team for this hackathon
// GET    /teams                → list teams
// POST   /submissions          → submit project url/repo
// PATCH  /submissions/:id/score → rank/score submission

export default router;
