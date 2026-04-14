/**
 * server/src/modules/submission/submission.validation.ts
 * Zod schema validating incoming submission payloads.
 */

import { z } from "zod";

export const createSubmissionSchema = z.object({
  body: z.object({
    moduleId: z.string().uuid(),
    // The actual submission data — module-type-specific, validated by each handler's submit()
    payload: z.record(z.any()),
    // Optional: team submission
    teamId: z.string().uuid().optional(),
  }),
});
