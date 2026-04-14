/**
 * server/src/modules/submission/submission.routes.ts
 *
 * POST   /api/v1/submissions             → create submission (auth required)
 * GET    /api/v1/submissions/:moduleId   → list all for module (auth required — admin)
 * GET    /api/v1/submissions/:moduleId/me → get own submission
 * POST   /api/v1/submissions/evaluate/:submissionId → trigger evaluation (auth required)
 */

import { Router } from "express";
import { requireAuth } from "@middlewares/auth/requireAuth";
import * as submissionController from "./submission.controller";

const router = Router();

router.post("/", requireAuth, submissionController.createSubmission);
router.get("/:moduleId", requireAuth, submissionController.getModuleSubmissions);
router.get("/:moduleId/me", requireAuth, submissionController.getMySubmission);
router.post("/evaluate/:submissionId", requireAuth, submissionController.evaluateSubmission);

export default router;
