"use client";

import Link from "next/link";
import { useMyRegistrations } from "@/hooks/useRegistrations";
import { useMySubmission } from "@/hooks/useSubmissions";
import { useNotifications } from "@/hooks/useNotifications";
import { PageHeader } from "@/components/shared/PageHeader";
import { DashboardStatsSkeleton } from "@/components/ui/Skeleton";
import type { Metadata } from "next";

/**
 * app/dashboard/page.tsx — Dashboard overview
 */

function StatCard({ label, value, sublabel, href }: { label: string; value: number | string; sublabel: string; href: string }) {
  return (
    <Link href={href} className="group rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-5 flex flex-col gap-2 transition-all duration-200 hover:border-[var(--accent-500)]/40 hover:shadow-[var(--shadow-sm)]">
      <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-bold text-[var(--text-primary)]">{value}</p>
      <p className="text-xs text-[var(--text-muted)] group-hover:text-[var(--accent-500)] transition-colors">{sublabel} →</p>
    </Link>
  );
}

export default function DashboardPage() {
  const { registrations, isLoading: regLoading } = useMyRegistrations();
  const { notifications, unreadCount }            = useNotifications();
  const isLoading = regLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Dashboard" description="Your event activity at a glance." />
        <DashboardStatsSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="Your event activity at a glance." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Registered Modules"
          value={registrations.length}
          sublabel="View registrations"
          href="/dashboard/registrations"
        />
        <StatCard
          label="Unread Notifications"
          value={unreadCount}
          sublabel="View notifications"
          href="/dashboard/notifications"
        />
        <StatCard
          label="Total Notifications"
          value={notifications.length}
          sublabel="View all"
          href="/dashboard/notifications"
        />
      </div>

      {/* Recent registrations */}
      {registrations.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Recent Registrations</h2>
          <div className="flex flex-col divide-y divide-[var(--border-subtle)] rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden">
            {registrations.slice(0, 5).map((r) => (
              <div key={r.id} className="px-4 py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{r.module?.title ?? "Module"}</p>
                  <p className="text-xs text-[var(--text-muted)]">{r.module?.event?.title ?? "Event"}</p>
                </div>
                <span className="text-xs text-[var(--text-muted)]">
                  {new Date(r.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>
            ))}
          </div>
          {registrations.length > 5 && (
            <Link href="/dashboard/registrations" className="text-xs text-[var(--accent-500)] hover:underline">
              View all {registrations.length} registrations →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
