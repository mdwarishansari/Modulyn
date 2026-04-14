/**
 * server/src/modules/user/user.controller.ts
 */

import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler";
import { userService } from "./user.service";
import { z } from "zod";

const updateMeSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/).optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getMe(req.user!.id);
  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }
  res.json({ success: true, data: user });
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const body = updateMeSchema.parse(req.body);
  const user = await userService.updateMe(req.user!.id, body);
  res.json({ success: true, data: user });
});

export const getPublicProfile = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;
  const user = await userService.getPublicProfile(username as string);
  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }
  res.json({ success: true, data: user });
});
