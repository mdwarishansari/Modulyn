/**
 * server/src/modules/module/types/hackathon/hackathon.service.ts
 * Hackathon-specific logic.
 */

import prisma from "@lib/prisma";

export class HackathonService {
  /**
   * Returns all project submissions for a hackathon module — for judging panel.
   */
  async getSubmissionsForJudging(moduleId: string) {
    return prisma.submission.findMany({
      where: { moduleId, status: { not: "DRAFT" } },
      orderBy: { submittedAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        team: { select: { id: true, name: true, members: { include: { user: { select: { id: true, name: true } } } } } },
      },
    });
  }
}

export const hackathonService = new HackathonService();
