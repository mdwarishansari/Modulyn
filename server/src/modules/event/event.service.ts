/**
 * server/src/modules/event/event.service.ts
 * Primitives for dispatching Prisma ops and enforcing robust lifecycle constraints.
 */

import prisma from "@lib/prisma";
import { EventState, Prisma } from "@prisma/client";

// Define the valid paths an Event can travel.
// e.g., A "DRAFT" event can only step forward to "PUBLISHED".
const VALID_TRANSITIONS: Record<EventState, EventState[]> = {
  [EventState.DRAFT]: [EventState.PUBLISHED, EventState.ARCHIVED],
  [EventState.PUBLISHED]: [EventState.REGISTRATION_OPEN, EventState.ARCHIVED, EventState.DRAFT],
  [EventState.REGISTRATION_OPEN]: [EventState.REGISTRATION_CLOSED, EventState.ARCHIVED],
  [EventState.REGISTRATION_CLOSED]: [EventState.LIVE, EventState.ARCHIVED],
  [EventState.LIVE]: [EventState.FINISHED],
  [EventState.FINISHED]: [EventState.ARCHIVED],
  [EventState.ARCHIVED]: [], // Terminal state
};

export class EventService {
  /**
   * Generates a completely new event shell attached to an organization.
   */
  async createEvent(data: Prisma.EventUncheckedCreateInput) {
    return prisma.event.create({
      data,
    });
  }

  /**
   * Retrieves full event data natively by slug, often for public display mapping.
   */
  async getEventBySlug(organizationId: string, slug: string) {
    return prisma.event.findUnique({
      where: {
        organizationId_slug: {
          organizationId,
          slug,
        },
      },
    });
  }

  /**
   * Fetches public visible events across all orgs, usually for a global index or feed.
   */
  async listPublicEvents(limit = 20, offset = 0) {
    return prisma.event.findMany({
      where: {
        visibility: "PUBLIC",
        state: {
          not: "DRAFT",
        },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Safely attempts to change an Event's state, preventing illegal transitions.
   * Enforces strict ownership implicitly preventing unauthorized actors natively.
   */
  async transitionState(eventId: string, targetState: EventState, requestorId: string) {
    const event = await prisma.event.findUnique({ where: { id: eventId }, include: { organization: true } });
    if (!event) throw new Error("Event not found");

    // Strict Enforcement Boundary
    if (event.createdById !== requestorId && event.organization.ownerId !== requestorId) {
       throw new Error("UNAUTHORIZED_ACCESS: You do not have permission to modify this Event's lifecycle.");
    }

    const allowed = VALID_TRANSITIONS[event.state];
    if (!allowed.includes(targetState)) {
      throw new Error(`Invalid state transition. Cannot move from ${event.state} directly to ${targetState}.`);
    }

    // Specific trigger logic (e.g. Published adds a timestamp natively)
    const updateData: Prisma.EventUpdateInput = { state: targetState };
    if (targetState === EventState.PUBLISHED && !event.publishedAt) {
      updateData.publishedAt = new Date();
    }

    return prisma.event.update({
      where: { id: eventId },
      data: updateData,
    });
  }
}

export const eventService = new EventService();
