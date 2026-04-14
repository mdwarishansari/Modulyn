/**
 * server/src/modules/audit/audit.service.ts
 * Captures explicit administrative interactions natively effectively capturing states globally safely.
 */

import prisma from "@lib/prisma";

export class AuditService {
  /**
   * Tracks discrete interactions strictly mapping payload limits securely dynamically cleanly accurately.
   */
  async log(action: string, userId: string, moduleId?: string | null, metadata: Record<string, unknown> = {}) {
    try {
      await prisma.auditLog.create({
        data: {
          action,
          userId,
          moduleId: moduleId ?? null,
          metadata: metadata as object,
        },
      });
    } catch (error) {
      console.error("[AuditService] Failed to capture log definitively natively:", error);
    }
  }
}

export const auditService = new AuditService();
