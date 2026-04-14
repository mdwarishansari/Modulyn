/**
 * server/src/modules/module/core/module.controller.ts
 * Standard routing interface parsing input directly resolving against native validation bindings securely.
 */

import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler";
import { moduleCoreService } from "./module.service";
import { createModuleSchema } from "./module.validation";
import { ModuleState } from "@prisma/client";

export const createModule = asyncHandler(async (req: Request, res: Response) => {
  const { body } = createModuleSchema.parse({ body: req.body });

  // Req.user strictly applied by requireAuth natively
  const newModule = await moduleCoreService.createModule({
    ...body,
    configJsonb: body.configJsonb || {},
    createdById: req.user!.id,
  });

  res.status(201).json({
    success: true,
    data: newModule,
  });
});

export const getEventModules = asyncHandler(async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const modulesObj = await moduleCoreService.getModulesByEventId(eventId as string);

  res.status(200).json({
    success: true,
    data: modulesObj,
  });
});

export const transitionModuleState = asyncHandler(async (req: Request, res: Response) => {
  const { moduleId } = req.params;
  const { state } = req.body;

  const alteredMod = await moduleCoreService.transitionState(moduleId as string, state as ModuleState);

  res.status(200).json({
    success: true,
    data: alteredMod,
  });
});
