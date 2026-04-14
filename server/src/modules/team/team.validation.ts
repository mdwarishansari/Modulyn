/**
 * server/src/modules/team/team.validation.ts
 * Schema explicitly testing inputs natively for Team aggregations safely bounded.
 */

import { z } from "zod";

export const createTeamSchema = z.object({
  body: z.object({
    moduleId: z.string().uuid(),
    name: z.string().min(3).max(50).regex(/^[a-zA-Z0-9 -_]+$/, "Team Name must be alphanumeric strictly bounded natively."),
  }),
});

export const joinTeamSchema = z.object({
  body: z.object({
    code: z.string().length(8), // Force explicitly rigid code footprints
  }),
});
