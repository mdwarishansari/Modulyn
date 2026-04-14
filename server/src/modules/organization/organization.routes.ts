/**
 * server/src/modules/organization/organization.routes.ts
 */

import { Router } from "express";
import { requireAuth } from "@middlewares/auth/requireAuth";
import { optionalAuth } from "@middlewares/auth/optionalAuth";
import * as orgController from "./organization.controller";

const router = Router();

router.get("/", optionalAuth, orgController.listOrgs);
router.post("/", requireAuth, orgController.createOrg);
router.get("/:slug", optionalAuth, orgController.getOrgBySlug);
router.patch("/:id", requireAuth, orgController.updateOrg);

export default router;
