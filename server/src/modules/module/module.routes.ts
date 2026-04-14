/**
 * server/src/modules/module/module.routes.ts
 * Main aggregator for the module domain.
 */

import { Router } from "express";

import coreRoutes from "./core/module.routes";
import hackathonRoutes from "./types/hackathon/hackathon.routes";
import quizRoutes from "./types/quiz/quiz.routes";
import codingRoutes from "./types/coding/coding.routes";
import uiuxRoutes from "./types/uiux/uiux.routes";

const router = Router();

// Core module generic CRUD
router.use("/", coreRoutes);

// Type-specific isolated logic routed by module ID
router.use("/:moduleId/hackathon", hackathonRoutes);
router.use("/:moduleId/quiz", quizRoutes);
router.use("/:moduleId/coding", codingRoutes);
router.use("/:moduleId/uiux", uiuxRoutes);

export default router;
