/**
 * server/src/modules/submission/submission.routes.ts
 */
import { Router } from "express";
const router = Router();

// POST   /api/v1/submissions             → submit for a module
// GET    /api/v1/submissions?moduleId=.. → list submissions (admin/judge)
// GET    /api/v1/submissions/:id         → single submission detail
// PATCH  /api/v1/submissions/:id         → update submission (before deadline)

export default router;
