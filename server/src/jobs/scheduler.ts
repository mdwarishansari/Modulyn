/**
 * server/src/jobs/scheduler.ts
 * Interval-based background job scheduler — no external dependency.
 */

import prisma from "@lib/prisma";

type Job = {
  name: string;
  intervalMs: number;
  handler: () => Promise<void>;
};

const jobs: Job[] = [
  {
    name: "cleanupOldNotifications",
    intervalMs: 1000 * 60 * 60 * 24, // Every 24 hours
    async handler() {
      const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
      const { count } = await prisma.notification.deleteMany({
        where: { createdAt: { lt: cutoff }, isRead: true },
      });
      if (count > 0) {
        console.log(`[Job:cleanup] Deleted ${count} stale read notifications`);
      }
    },
  },
  {
    name: "cleanupOldAuditLogs",
    intervalMs: 1000 * 60 * 60 * 24 * 7, // Every 7 days
    async handler() {
      const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
      const { count } = await prisma.auditLog.deleteMany({
        where: { timestamp: { lt: cutoff } },
      });
      if (count > 0) {
        console.log(`[Job:auditCleanup] Deleted ${count} old audit logs`);
      }
    },
  },
];

export function startScheduler() {
  for (const job of jobs) {
    // Run once immediately, then on schedule
    job.handler().catch((err) => console.error(`[Job:${job.name}] Initial run failed:`, err));

    setInterval(() => {
      job.handler().catch((err) => console.error(`[Job:${job.name}] Failed:`, err));
    }, job.intervalMs).unref(); // .unref() prevents blocking process exit
  }

  console.log(`[Scheduler] ${jobs.length} background jobs started`);
}
