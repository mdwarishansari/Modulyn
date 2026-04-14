/**
 * server/src/modules/module/types/quiz/quiz.handler.ts
 * Base abstraction mapping explicit Quiz flows.
 */

import { ModuleType, Prisma } from "@prisma/client";
import { ModuleHandler } from "@lib/module-engine/types";
import { moduleRegistry } from "@lib/module-engine/registry";

export const QuizHandler: ModuleHandler = {
  type: ModuleType.QUIZ,
  
  validateConfig: async (configJson: Prisma.JsonValue) => {
    // Scaffold logic. Future specific parsing applies here (e.g., checking strict time_limits object)
    if (typeof configJson !== 'object') throw new Error("Quiz config must be a JSON object");
    return;
  },

  onStateChange: async (moduleId, oldState, newState) => {
    // E.g., Starting the Quiz broadcasts WebSocket events locally.
    console.log(`[QuizHandler] State transition triggered for Mod [${moduleId}]: ${oldState} -> ${newState}`);
  }
};

// Force registration
moduleRegistry.register(QuizHandler);
