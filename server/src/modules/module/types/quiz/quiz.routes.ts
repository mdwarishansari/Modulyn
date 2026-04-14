/**
 * server/src/modules/module/types/quiz/quiz.routes.ts
 * Isolated routes for quiz-specific module logic.
 * Base URL from main router: /api/v1/modules/:moduleId/quiz
 */

import { Router } from "express";

const router = Router({ mergeParams: true });

// POST   /questions            → add question to quiz
// GET    /questions            → list questions (admin/live)
// POST   /answers              → submit answer
// POST   /start-timer          → broadcast live start

export default router;
