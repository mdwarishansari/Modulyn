"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { PageHeader } from "@/components/shared/PageHeader";
import { StateBadge } from "@/components/shared/StateBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { FetchError } from "@/components/ui/FetchError";
import { SubmissionRowSkeleton } from "@/components/ui/Skeleton";
import { getSubmissionUI } from "@/lib/states";
import type { Submission } from "@/types";

export default function SubmissionsPage() {
  const { getToken } = useAuth();
  const { data: submissions, error, isLoading, mutate } = useSWR<Submission[]>(
    "/submissions/me",
    async (endpoint: string) => {
      const token = await getToken();
      return fetcher<Submission[]>(endpoint, token);
    },
    { revalidateOnFocus: false }
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="My Submissions" description="Your module submissions and scores across all events." />

      {error ? (
        <FetchError onRetry={() => mutate()} />
      ) : isLoading ? (
        <SubmissionRowSkeleton count={4} />
      ) : !submissions || submissions.length === 0 ? (
        <EmptyState
          title="No submissions yet"
          description="Participate in event modules and submit your work to see it here."
          action={<Link href="/events" className="text-sm font-medium text-[var(--accent-500)] hover:underline">Browse Events</Link>}
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {submissions.map((s) => {
            const ui = getSubmissionUI(s.status);
            return (
              <div key={s.id} className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[var(--border-strong)] transition-colors">
                
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {s.module?.title ?? "Module"}
                    </p>
                    <span 
                      className="text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0" 
                      style={{ 
                        color: ui.colorVar, 
                        backgroundColor: `color-mix(in srgb, ${ui.colorVar} 10%, transparent)`,
                        borderColor: `color-mix(in srgb, ${ui.colorVar} 30%, transparent)`
                      }}
                    >
                      {ui.label}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] truncate">
                    {s.module?.event?.organization?.name ?? "Org"} · {s.module?.event?.title ?? "Event"}
                  </p>
                  <p className="text-xs text-[var(--text-disabled)]">
                    Submitted {new Date(s.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric" })}
                  </p>
                </div>
                
                <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                  {s.score !== null ? (
                    <div className="flex flex-col sm:items-end">
                      <p className="text-sm font-bold text-[var(--text-primary)]">{s.score.toFixed(1)} / 100</p>
                      {s.feedback && <p className="text-xs text-[var(--text-secondary)] italic">View feedback</p>}
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--text-muted)]">Pending Evaluation</p>
                  )}
                  {s.module && (
                    <Link href={`/e/${s.module.event?.organization.slug}/${s.module.event?.slug}/module/${s.module.id}`}>
                      <span className="text-xs font-medium text-[var(--accent-500)] hover:underline mt-1 inline-block">View Module →</span>
                    </Link>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
