/**
 * server/src/modules/module/core/module.validation.ts
 * Core logic bindings explicitly asserting module payload shapes.
 */

import { z } from "zod";
import { ModuleType, ModuleMode, EventVisibility } from "@prisma/client";

export const createModuleSchema = z.object({
  body: z.object({
    eventId: z.string().uuid(),
    title: z.string().min(3).max(100),
    slug: z.string().min(3).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    type: z.nativeEnum(ModuleType),
    description: z.string().min(10),
    moduleMode: z.nativeEnum(ModuleMode).optional(),
    visibility: z.nativeEnum(EventVisibility).optional(),
    registrationRequired: z.boolean().optional(),
    
    // Abstract objects allowing generic data shapes dictated strictly by Plugins logic natively.
    configJsonb: z.record(z.any()).optional(),
  }),
});
