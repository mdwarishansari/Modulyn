"use client";

import { useMySubmission } from "@/hooks/useSubmissions";
import { useMyRegistrations } from "@/hooks/useRegistrations";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { SubmissionRowSkeleton } from "@/components/ui/Skeleton";
import { getSubmissionUI } from "@/lib/states";
import Link from "next/link";

/** Shows submission status for a single registered module */
function SubmissionEntry({ moduleId, moduleTitle, eventSlug, orgSlug }: { moduleId: string; moduleTitle: string; eventSlug: string; orgSlug: string }) {
  const { submission, isLoading } = useMySubmission(moduleId);
  const ui = submission ? getSubmissionUI(submission.status) : null;

  if (isLoading) return null;
  if (!submission) return null;

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 flex items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{moduleTitle}</p>
        <p className="text-xs text-[var(--text-muted)]">
          Submitted {new Date(submission.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </p>
        {submission.score !== null && (
          <p className="text-xs font-semibold text-[var(--accent-500)]">Score: {submission.score}/100</p>
        )}
        {submission.feedback && (
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate max-w-xs">{submission.feedback}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {ui && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full border"
            style={{ color: ui.colorVar, backgroundColor: `color-mix(in srgb, ${ui.colorVar} 10%, transparent)`, borderColor: `color-mix(in srgb, ${ui.colorVar} 25%, transparent)` }}
          >
            {ui.label}
          </span>
        )}
        <Link href={`/e/${orgSlug}/${eventSlug}/module/${moduleId}`} className="text-xs text-[var(--accent-500)] hover:underline">View →</Link>
      </div>
    </div>
  );
}

export default function SubmissionsPage() {
  const { registrations, isLoading } = useMyRegistrations();

  if (isLoading) return (
    <div className="flex flex-col gap-6">
      <PageHeader title="My Submissions" description="Your submission history and scores." />
      <SubmissionRowSkeleton count={3} />
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="My Submissions" description="Your submission history and scores." />

      {registrations.length === 0 ? (
        <EmptyState
          title="No submissions yet"
          description="Register for modules and participate to see submissions here."
          action={<Link href="/events" className="text-sm font-medium text-[var(--accent-500)] hover:underline">Browse Events</Link>}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {registrations.map((r) => (
            r.module && (
              <SubmissionEntry
                key={r.id}
                moduleId={r.moduleId}
                moduleTitle={r.module.title}
                eventSlug={r.module.event?.slug ?? ""}
                orgSlug={r.module.event?.organization?.slug ?? ""}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
}
