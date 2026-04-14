/**
 * server/src/modules/leaderboard/leaderboard.controller.ts
 */

import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler";
import { leaderboardService } from "./leaderboard.service";

export const getLeaderboard = asyncHandler(async (req: Request, res: Response) => {
  const { moduleId } = req.params;

  const leaderboard = await leaderboardService.getLeaderboard(moduleId as string);

  res.status(200).json({
    success: true,
    data: leaderboard,
  });
});
