"use client";

import Link from "next/link";
import { useMyRegistrations } from "@/hooks/useRegistrations";
import { PageHeader } from "@/components/shared/PageHeader";
import { StateBadge } from "@/components/shared/StateBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { SubmissionRowSkeleton } from "@/components/ui/Skeleton";

export default function RegistrationsPage() {
  const { registrations, isLoading } = useMyRegistrations();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="My Registrations" description="All modules you've registered for." />

      {isLoading ? (
        <SubmissionRowSkeleton count={4} />
      ) : registrations.length === 0 ? (
        <EmptyState
          title="No registrations yet"
          description="Browse events and register for modules to see them here."
          action={<Link href="/events" className="text-sm font-medium text-[var(--accent-500)] hover:underline">Browse Events</Link>}
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {registrations.map((r) => (
            <div key={r.id} className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 flex items-center justify-between gap-4 hover:border-[var(--border-strong)] transition-colors">
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                  {r.module?.title ?? "Module"}
                </p>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {r.module?.event?.title ?? "Event"}
                </p>
                <p className="text-xs text-[var(--text-disabled)]">
                  Registered {new Date(r.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {r.module?.state && <StateBadge state={r.module.state} showDot={false} />}
                {r.module && r.module.state === "LIVE" && (
                  <Link href={`/e/${r.module.event?.organization?.slug ?? ""}/${r.module.event?.slug ?? ""}/module/${r.moduleId}`}>
                    <span className="text-xs font-medium text-[var(--accent-500)] hover:underline">Participate →</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
