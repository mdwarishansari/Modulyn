/**
 * server/src/lib/module-engine/types.ts
 * Type definitions outlining the expected signature for all Modulyn Plugins.
 */

import { ModuleType, ModuleState, Prisma } from "@prisma/client";

export interface SubmissionResult {
  contentJsonb: Record<string, unknown>;
  score?: number;
  status?: string; // e.g. 'auto-evaluated', 'pending-review'
}

export interface ModuleHandler {
  /**
   * The explicit type this handler maps to (e.g. QUIZ, HACKATHON)
   */
  type: ModuleType;

  /**
   * Optional runtime validation of the JSON payload during creation or updates.
   */
  validateConfig?: (configJson: Prisma.JsonValue) => Promise<void>;

  /**
   * Hook invoked when this Module is first created (e.g. seed quiz attempts table).
   */
  init?: (moduleId: string) => Promise<void>;

  /**
   * Hook invoked when a user/team registers for this module.
   */
  register?: (moduleId: string, registrationId: string) => Promise<void>;

  /**
   * Validates and processes a raw submission payload for this module type.
   * Must throw a descriptive error if the payload is invalid.
   * Returns normalized data to be stored as `contentJsonb`.
   */
  submit?: (
    moduleId: string,
    userId: string,
    payload: Record<string, unknown>
  ) => Promise<SubmissionResult>;

  /**
   * Evaluates a stored submission — called after module LIVE phase ends.
   * Returns a score and optional feedback string.
   */
  evaluate?: (submissionId: string) => Promise<{ score: number; feedback?: string }>;

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
