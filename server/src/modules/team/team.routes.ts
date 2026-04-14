/**
 * server/src/modules/team/team.routes.ts
 * Mount mappings isolating domains cleanly safely locally globally.
 */

import { Router } from "express";
import { requireAuth } from "@middlewares/auth/requireAuth";
import * as teamController from "./team.controller";

const router = Router();

// ─── Protected ──────────────────────────────────────────────────────────
router.post("/", requireAuth, teamController.createTeam);
router.post("/join", requireAuth, teamController.joinTeam);

export default router;
