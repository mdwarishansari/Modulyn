/**
 * server/src/modules/leaderboard/leaderboard.service.ts
 * Fetches, ranks, and returns formatted leaderboard entries for a module.
 */

import prisma from "@lib/prisma";

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
  /**
   * Returns a ranked list of evaluated submissions for a module.
   * Tie-breaker: earlier submittedAt wins.
   */
  async getLeaderboard(moduleId: string): Promise<LeaderboardEntry[]> {
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

    return submissions.map((submission, index) => ({
      rank: index + 1,
      score: submission.score!,
      submittedAt: submission.submittedAt,
      evaluatedAt: submission.evaluatedAt,
      submissionId: submission.id,
      user: submission.user,
      team: submission.team,
    }));
  }
}

export const leaderboardService = new LeaderboardService();
