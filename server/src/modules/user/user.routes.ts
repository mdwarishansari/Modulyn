/**
 * server/src/modules/user/user.routes.ts
 */

import { Router } from "express";
import { requireAuth } from "@middlewares/auth/requireAuth";
import { optionalAuth } from "@middlewares/auth/optionalAuth";
import * as userController from "./user.controller";

const router = Router();

router.get("/me", requireAuth, userController.getMe);
router.patch("/me", requireAuth, userController.updateMe);
router.get("/:username", optionalAuth, userController.getPublicProfile);

export default router;
