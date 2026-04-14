/**
 * server/src/modules/leaderboard/leaderboard.routes.ts
 *
 * GET /api/v1/leaderboard/:moduleId  → public leaderboard (optionalAuth)
 */

import { Router } from "express";
import { optionalAuth } from "@middlewares/auth/optionalAuth";
import * as leaderboardController from "./leaderboard.controller";

const router = Router();

// Public — visible without login; optionalAuth attaches user if present
router.get("/:moduleId", optionalAuth, leaderboardController.getLeaderboard);

export default router;
