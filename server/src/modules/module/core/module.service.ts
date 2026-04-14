/**
 * server/src/modules/module/core/module.service.ts
 * Acts as the logic broker delegating down into dynamically configured Type plugins.
 */

import prisma from "@lib/prisma";
import { Prisma, ModuleState } from "@prisma/client";
import { resolveHandler } from "@lib/module-engine/resolver";

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
   */
  async createModule(data: Prisma.ModuleUncheckedCreateInput) {
    // 1. Resolve handler explicitly mapped to native engine.
    const handler = resolveHandler(data.type);

    // 2. Safely bounce custom JSON configurations explicitly testing Type Logic abstractions natively.
    if (handler.validateConfig && data.configJsonb) {
      await handler.validateConfig(data.configJsonb as Prisma.JsonValue);
    }

    // 3. Mount module inherently onto Prisma constraints globally.
    return prisma.module.create({
      data,
    });
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
  async transitionState(moduleId: string, targetState: ModuleState) {
    const modObj = await prisma.module.findUnique({ where: { id: moduleId } });
    if (!modObj) throw new Error("Module not found");

    const allowed = VALID_MODULE_TRANSITIONS[modObj.state];
    if (!allowed.includes(targetState)) {
      throw new Error(`Invalid state transition for Module from ${modObj.state} directly to ${targetState}.`);
    }

    const handler = resolveHandler(modObj.type);

    // Invoke Pre/Post hooks mapped natively
    if (handler.onStateChange) {
      await handler.onStateChange(moduleId, modObj.state, targetState);
    }

    return prisma.module.update({
      where: { id: moduleId },
      data: { state: targetState },
    });
  }
}

export const moduleCoreService = new ModuleCoreService();
