/**
 * server/src/modules/module/core/module.service.ts
 * Acts as the logic broker delegating down into dynamically configured Type plugins.
 */

import prisma from "@lib/prisma";
import { Prisma, ModuleState } from "@prisma/client";
import { resolveHandler } from "@lib/module-engine/resolver";
import { eventBus, DomainEvent } from "@lib/event-bus/eventBus";
import { auditService } from "@modules/audit/audit.service";

// Must define lifecycle rules exactly mapped to specific events.
const VALID_MODULE_TRANSITIONS: Record<ModuleState, ModuleState[]> = {
  [ModuleState.INACTIVE]: [ModuleState.DRAFT],
  [ModuleState.DRAFT]: [ModuleState.REGISTRATION_OPEN, ModuleState.LIVE, ModuleState.ARCHIVED],
  [ModuleState.REGISTRATION_OPEN]: [ModuleState.REGISTRATION_CLOSED, ModuleState.ARCHIVED],
  [ModuleState.REGISTRATION_CLOSED]: [ModuleState.LIVE, ModuleState.ARCHIVED],
  [ModuleState.LIVE]: [ModuleState.FINISHED],
  [ModuleState.FINISHED]: [ModuleState.ARCHIVED],
  [ModuleState.ARCHIVED]: [],
};

export class ModuleCoreService {
  /**
   * Initializes a module boundary inside an event leveraging dynamic plugins implicitly.
   * Tracks strict enforcement mapping the requestor natively against the core Event.
   */
  async createModule(data: Prisma.ModuleUncheckedCreateInput, requestorId: string) {
    const event = await prisma.event.findUnique({ where: { id: data.eventId }, include: { organization: true } });
    if (!event) throw new Error("Parent Event not found");
    if (event.createdById !== requestorId && event.organization.ownerId !== requestorId) {
      throw new Error("UNAUTHORIZED_ACCESS: You do not have permission to append modules under this Event.");
    }

    // 1. Resolve handler explicitly mapped to native engine.
    const handler = resolveHandler(data.type);

    // 2. Safely bounce custom JSON configurations explicitly testing Type Logic abstractions natively.
    if (handler.validateConfig && data.configJsonb) {
      await handler.validateConfig(data.configJsonb as Prisma.JsonValue);
    }

    // 3. Mount module inherently onto Prisma constraints globally.
    const newModule = await prisma.module.create({
      data,
    });

    // 4. Hook explicit module bootstrapper cleanly pushing flows downstream implicitly.
    if (handler.init) {
      await handler.init(newModule.id);
    }

    return newModule;
  }

  /**
   * Retrieves modules associated natively to an explicit Event wrapper.
   */
  async getModulesByEventId(eventId: string) {
    return prisma.module.findMany({
      where: { eventId },
      orderBy: { orderIndex: 'asc' },
    });
  }

  /**
   * Applies State Machine transition inherently triggering mapped plugins on validation securely.
   */
  async transitionState(moduleId: string, targetState: ModuleState, requestorId: string) {
    const modObj = await prisma.module.findUnique({ where: { id: moduleId }, include: { event: { include: { organization: true } } } });
    if (!modObj) throw new Error("Module not found");

    if (modObj.event.createdById !== requestorId && modObj.event.organization.ownerId !== requestorId) {
      throw new Error("UNAUTHORIZED_ACCESS: You do not have permission to mutate this Module's lifecycle.");
    }

    const allowed = VALID_MODULE_TRANSITIONS[modObj.state];
    if (!allowed.includes(targetState)) {
      throw new Error(`Invalid state transition for Module from ${modObj.state} directly to ${targetState}.`);
    }

    const handler = resolveHandler(modObj.type);

    // Invoke Pre/Post hooks mapped natively
    if (handler.onStateChange) {
      await handler.onStateChange(moduleId, modObj.state, targetState);
    }

    const updated = await prisma.module.update({
      where: { id: moduleId },
      data: { state: targetState },
    });

    eventBus.emitEvent(DomainEvent.MODULE_STATE_CHANGED, { moduleId, oldState: modObj.state, newState: targetState });
    await auditService.log("MODULE_STATE_CHANGED", requestorId, moduleId, { oldState: modObj.state, newState: targetState });

    return updated;
  }
}

export const moduleCoreService = new ModuleCoreService();
