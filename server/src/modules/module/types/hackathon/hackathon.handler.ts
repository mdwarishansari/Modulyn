/**
 * server/src/modules/module/types/hackathon/hackathon.handler.ts
 * Base abstraction mapping explicit Hackathon flows.
 */

import { ModuleType, Prisma } from "@prisma/client";
import { ModuleHandler } from "@lib/module-engine/types";
import { moduleRegistry } from "@lib/module-engine/registry";

export const HackathonHandler: ModuleHandler = {
  type: ModuleType.HACKATHON,
  
  validateConfig: async (configJson: Prisma.JsonValue) => {
    // E.g., Ensuring problem statements array or domains exists
    if (typeof configJson !== 'object') throw new Error("Hackathon config must be a JSON object");
    return;
  },
};

// Force registration
moduleRegistry.register(HackathonHandler);
