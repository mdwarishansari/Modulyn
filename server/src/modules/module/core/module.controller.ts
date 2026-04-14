/**
 * server/src/modules/module/core/module.controller.ts
 * Standard routing interface parsing input directly resolving against native validation bindings securely.
 */

import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler";
import { moduleCoreService } from "./module.service";
import { createModuleSchema } from "./module.validation";
import { ModuleState } from "@prisma/client";
import prisma from "@lib/prisma";

export const createModule = asyncHandler(async (req: Request, res: Response) => {
  const { body } = createModuleSchema.parse({ body: req.body });

  try {
    const newModule = await moduleCoreService.createModule({
      ...body,
      configJsonb: body.configJsonb || {},
      createdById: req.user!.id,
    }, req.user!.id);

    res.status(201).json({
      success: true,
      data: newModule,
    });
  } catch (error: any) {
    if (error.message.includes("UNAUTHORIZED_ACCESS")) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    throw error;
  }
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

  try {
    const alteredMod = await moduleCoreService.transitionState(moduleId as string, state as ModuleState, req.user!.id);

    res.status(200).json({
      success: true,
      data: alteredMod,
    });
  } catch (error: any) {
    if (error.message.includes("UNAUTHORIZED_ACCESS")) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    if (error.message.includes("Invalid state transition")) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    throw error;
  }
});

export const publishResults = asyncHandler(async (req: Request, res: Response) => {
  const { moduleId } = req.params;

  // Basic strict check inside controller for demonstration limits
  const modObj = await prisma.module.findUnique({
    where: { id: moduleId as string },
    include: { event: { include: { organization: true } } }
  });

  if (!modObj) throw new Error("Module not found");

  if (modObj.event.createdById !== req.user!.id && modObj.event.organization.ownerId !== req.user!.id) {
    res.status(403).json({ success: false, message: "UNAUTHORIZED_ACCESS: You do not have permission to publish results." });
    return;
  }
  
  if (modObj.state !== "FINISHED") {
    res.status(400).json({ success: false, message: "Module must be FINISHED to publish results." });
    return;
  }

  const updated = await prisma.module.update({
    where: { id: moduleId as string },
    data: { resultPublished: true }
  });

  res.status(200).json({ success: true, data: updated });
});
