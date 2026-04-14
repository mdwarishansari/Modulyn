/**
 * server/src/modules/event/event.validation.ts
 * Validation boundaries for Event resources.
 */

import { z } from "zod";
import { EventVisibility, LocationType } from "@prisma/client";

export const createEventSchema = z.object({
  body: z.object({
    organizationId: z.string().uuid(),
    title: z.string().min(3).max(100),
    slug: z.string().min(3).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly (lowercase, numbers, hyphens)"),
    description: z.string().min(10),
    visibility: z.nativeEnum(EventVisibility).optional(),
    locationType: z.nativeEnum(LocationType).optional(),
    locationText: z.string().optional(),
    timezone: z.string().optional(),
  }),
});
