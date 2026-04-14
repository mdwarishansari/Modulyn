/**
 * server/src/lib/module-engine/resolver.ts
 * Fetches plugins dynamically across the system logic map.
 */

import { ModuleType } from "@prisma/client";
import { moduleRegistry } from "./registry";

/**
 * Returns a matched ModuleHandler or throws an explicit engine error.
 */
export function resolveHandler(type: ModuleType) {
  const handler = moduleRegistry.get(type);
  if (!handler) {
    throw new Error(`[ModuleEngine] No active plugin found matching type: ${type}`);
  }
  return handler;
}
