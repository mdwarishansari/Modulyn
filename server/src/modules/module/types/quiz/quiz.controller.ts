/**
 * server/src/modules/module/types/quiz/quiz.controller.ts
 */

import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler";
import { quizService } from "./quiz.service";

export const getQuizQuestions = asyncHandler(async (req: Request, res: Response) => {
  const { moduleId } = req.params;
  const questions = await quizService.getQuizForParticipant(moduleId as string);
  res.json({ success: true, data: questions });
});
