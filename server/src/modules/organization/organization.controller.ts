/**
 * server/src/modules/organization/organization.controller.ts
 */

import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler";
import { organizationService } from "./organization.service";
import { z } from "zod";

const createOrgSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
  type: z.enum(["COLLEGE", "CLUB", "COMPANY", "COMMUNITY", "PERSONAL"]),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
});

export const createOrg = asyncHandler(async (req: Request, res: Response) => {
  const body = createOrgSchema.parse(req.body);
  const org = await organizationService.create(body as any, req.user!.id);
  res.status(201).json({ success: true, data: org });
});

export const getOrgBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const org = await organizationService.getBySlug(slug as string);
  if (!org) {
    res.status(404).json({ success: false, message: "Organization not found" });
    return;
  }
  res.json({ success: true, data: org });
});

export const listOrgs = asyncHandler(async (_req: Request, res: Response) => {
  const orgs = await organizationService.listPublic();
  res.json({ success: true, data: orgs });
});

export const updateOrg = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const org = await organizationService.update(id as string, req.user!.id, req.body);
    res.json({ success: true, data: org });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED_ACCESS") {
      res.status(403).json({ success: false, message: "Not authorized to update this organization" });
      return;
    }
    throw err;
  }
});
