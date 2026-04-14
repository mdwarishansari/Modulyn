/**
 * server/src/modules/registration/registration.validation.ts
 * Payloads binding Registration inputs securely explicitly globally.
 */

import { z } from "zod";

export const createRegistrationSchema = z.object({
  body: z.object({
    moduleId: z.string().uuid(),
    teamId: z.string().uuid().optional(), // Provided explicitly if joining via Team context natively
  }),
});
