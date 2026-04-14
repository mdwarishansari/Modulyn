/**
 * server/src/lib/module-engine/registry.ts
 * A synchronized singleton mapping registered handlers into memory.
 */

import { ModuleType } from "@prisma/client";
import { ModuleHandler } from "./types";

class ModuleRegistry {
  private handlers = new Map<ModuleType, ModuleHandler>();

  /**
   * Injects a built logic handler into the global engine natively.
   */
  register(handler: ModuleHandler) {
    if (this.handlers.has(handler.type)) {
      console.warn(`[ModuleEngine] Overwriting existing handler for type: ${handler.type}`);
    }
    this.handlers.set(handler.type, handler);
    // console.log(`[ModuleEngine] Registered plugin: ${handler.type}`);
  }

  /**
   * Checks mapping.
   */
  get(type: ModuleType): ModuleHandler | undefined {
    return this.handlers.get(type);
  }
}

export const moduleRegistry = new ModuleRegistry();
