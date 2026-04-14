/**
 * server/src/lib/module-engine/types.ts
 * Type definitions outlining the expected signature for all Modulyn Plugins.
 */

import { ModuleType, ModuleState, Prisma } from "@prisma/client";

export interface ModuleHandler {
  /**
   * The explicit type this handler maps to (e.g. QUIZ, HACKATHON)
   */
  type: ModuleType;

  /**
   * Optional runtime validation of the JSON payload during creation or updates.
   * Throws an error internally if the configuration shape is structurally unsound.
   */
  validateConfig?: (configJson: Prisma.JsonValue) => Promise<void>;

  /**
   * Hook invoked directly after the module lifecycle shifts.
   * e.g. DRAFT -> REGISTRATION_OPEN
   */
  onStateChange?: (
    moduleId: string, 
    oldState: ModuleState, 
    newState: ModuleState
  ) => Promise<void>;
}
