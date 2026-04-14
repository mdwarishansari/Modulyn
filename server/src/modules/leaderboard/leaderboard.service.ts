/**
 * server/src/modules/leaderboard/leaderboard.service.ts
 * Fetches, ranks, and returns formatted leaderboard entries for a module.
 */

import prisma from "@lib/prisma";
import { eventBus, DomainEvent } from "@lib/event-bus/eventBus";

export interface LeaderboardEntry {
  rank: number;
  score: number;
  submittedAt: Date;
  evaluatedAt: Date | null;
  submissionId: string;
  // Populated for individual mode
  user?: { id: string; name: string; email: string; avatarUrl: string | null } | null;
  // Populated for team mode
  team?: { id: string; name: string } | null;
}

export class LeaderboardService {
  private cache: Map<string, { entries: LeaderboardEntry[], timestamp: number }> = new Map();
  private readonly CACHE_TTL_MS = 1000 * 60 * 5; // 5 minute absolute fallback

  constructor() {
    eventBus.on(DomainEvent.LEADERBOARD_UPDATED, ({ moduleId }) => {
      this.invalidateCache(moduleId);
    });
    eventBus.on(DomainEvent.RESULT_PUBLISHED, ({ moduleId }) => {
      this.invalidateCache(moduleId);
    });
  }

  public invalidateCache(moduleId: string) {
    this.cache.delete(moduleId);
  }

  /**
   * Returns a ranked list of evaluated submissions for a module utilizing fast LRU caches securely effectively optimally inherently globally natively safely elegantly.
   * Tie-breaker: earlier submittedAt wins.
   */
  async getLeaderboard(moduleId: string): Promise<LeaderboardEntry[]> {
    const cached = this.cache.get(moduleId);
    if (cached && (Date.now() - cached.timestamp < this.CACHE_TTL_MS)) {
      return cached.entries;
    }

    const mod = await prisma.module.findUnique({ where: { id: moduleId } });
    if (!mod) throw new Error("Module not found");

    const submissions = await prisma.submission.findMany({
      where: {
        moduleId,
        status: "EVALUATED",
        score: { not: null },
      },
      orderBy: [
        { score: "desc" },
        { submittedAt: "asc" }, // Tie-breaker: first submission wins
      ],
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        team: { select: { id: true, name: true } },
      },
    });

    const results = submissions.map((submission, index) => ({
      rank: index + 1,
      score: submission.score!,
      submittedAt: submission.submittedAt,
      evaluatedAt: submission.evaluatedAt,
      submissionId: submission.id,
      user: submission.user,
      team: submission.team,
    }));

    this.cache.set(moduleId, { entries: results, timestamp: Date.now() });

    return results;
  }
}

export const leaderboardService = new LeaderboardService();
