/**
 * server/src/modules/module/types/quiz/quiz.service.ts
 * Quiz-specific logic: question management, attempt tracking.
 */

import prisma from "@lib/prisma";

export class QuizService {
  /**
   * Returns the quiz config (questions) for a module, excluding correct answers for participants.
   */
  async getQuizForParticipant(moduleId: string) {
    const mod = await prisma.module.findUnique({ where: { id: moduleId } });
    if (!mod) throw new Error("Module not found");

    const config = mod.configJsonb as Record<string, unknown>;
    const questions = (config.questions ?? []) as Array<Record<string, unknown>>;

    // Strip correct answers before sending to participants
    return questions.map(({ correctAnswer: _stripped, ...rest }) => rest);
  }

  /**
   * Returns the full quiz config including answers — for admin/judges only.
   */
  async getQuizForAdmin(moduleId: string) {
    const mod = await prisma.module.findUnique({ where: { id: moduleId } });
    if (!mod) throw new Error("Module not found");
    return mod.configJsonb;
  }
}

export const quizService = new QuizService();
