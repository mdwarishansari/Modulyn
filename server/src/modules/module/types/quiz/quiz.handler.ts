/**
 * server/src/modules/module/types/quiz/quiz.handler.ts
 * Quiz ModuleHandler — validates config, auto-evaluates answers.
 */

import { ModuleType, Prisma } from "@prisma/client";
import { ModuleHandler, SubmissionResult } from "@lib/module-engine/types";
import { moduleRegistry } from "@lib/module-engine/registry";
import prisma from "@lib/prisma";

export const QuizHandler: ModuleHandler = {
  type: ModuleType.QUIZ,

  validateConfig: async (configJson: Prisma.JsonValue) => {
    if (typeof configJson !== "object" || Array.isArray(configJson) || configJson === null) {
      throw new Error("Quiz config must be a JSON object");
    }
    const cfg = configJson as Record<string, unknown>;
    if (!Array.isArray(cfg.questions)) {
      throw new Error("Quiz config requires a 'questions' array");
    }
  },

  init: async (moduleId: string) => {
    console.log(`[QuizHandler] Initialized quiz module: ${moduleId}`);
  },

  submit: async (
    moduleId: string,
    _userId: string,
    payload: Record<string, unknown>
  ): Promise<SubmissionResult> => {
    if (!Array.isArray(payload.answers)) {
      throw new Error("Quiz submission requires an 'answers' array");
    }

    const mod = await prisma.module.findUnique({ where: { id: moduleId } });
    if (!mod) throw new Error("Module not found");

    const config = mod.configJsonb as Record<string, unknown>;
    const questions = (config.questions ?? []) as Array<{
      id: string;
      correctAnswer: string;
      points?: number;
    }>;

    const answers = payload.answers as Array<{ questionId: string; answer: string }>;

    let totalScore = 0;
    let maxScore = 0;

    for (const q of questions) {
      const pts = q.points ?? 1;
      maxScore += pts;
      const submitted = answers.find((a) => a.questionId === q.id);
      if (submitted && submitted.answer === q.correctAnswer) {
        totalScore += pts;
      }
    }

    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    return {
      contentJsonb: {
        answers,
        rawScore: totalScore,
        maxScore,
        percentage: Math.round(percentage * 100) / 100,
      },
      score: percentage,
      status: "auto-evaluated",
    };
  },

  evaluate: async (submissionId: string) => {
    // For quiz, evaluation is automatic at submission time.
    // This hook can be used to re-evaluate or apply partial-credit logic.
    const submission = await prisma.submission.findUnique({ where: { id: submissionId } });
    if (!submission) throw new Error("Submission not found");
    return { score: submission.score ?? 0, feedback: "Auto-evaluated" };
  },

  onStateChange: async (moduleId, oldState, newState) => {
    console.log(`[QuizHandler] ${moduleId}: ${oldState} → ${newState}`);
  },
};

moduleRegistry.register(QuizHandler);
