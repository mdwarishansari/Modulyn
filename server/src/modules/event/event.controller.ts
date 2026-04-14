/**
 * server/src/modules/event/event.controller.ts
 * Handlers formatting requests/responses for Events natively.
 */

import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler";
import { eventService } from "./event.service";
import { createEventSchema } from "./event.validation";
import { EventState } from "@prisma/client";

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const { body } = createEventSchema.parse({ body: req.body });

  // req.user is guaranteed by requireAuth
  const event = await eventService.createEvent({
    ...body,
    createdById: req.user!.id,
  });

  res.status(201).json({
    success: true,
    data: event,
  });
});

export const getEventBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { orgId, slug } = req.params;
  
  const event = await eventService.getEventBySlug(orgId as string, slug as string);
  
  if (!event) {
    res.status(404).json({ success: false, message: "Event not found" });
    return;
  }

  res.status(200).json({
    success: true,
    data: event,
  });
});

export const listPublicEvents = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = parseInt(req.query.offset as string) || 0;

  const events = await eventService.listPublicEvents(limit, offset);

  res.status(200).json({
    success: true,
    data: events,
  });
});

export const transitionEventState = asyncHandler(async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const { state } = req.body;

  const updatedEvent = await eventService.transitionState(eventId as string, state as EventState);

  res.status(200).json({
    success: true,
    data: updatedEvent,
  });
});
