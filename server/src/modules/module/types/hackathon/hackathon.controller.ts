/**
 * server/src/modules/module/types/hackathon/hackathon.controller.ts
 */

import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler";
import { hackathonService } from "./hackathon.service";

export const getSubmissionsForJudging = asyncHandler(async (req: Request, res: Response) => {
  const { moduleId } = req.params;
  const submissions = await hackathonService.getSubmissionsForJudging(moduleId as string);
  res.json({ success: true, data: submissions });
});
