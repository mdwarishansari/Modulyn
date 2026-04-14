"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEvent } from "@/hooks/useEvents";
import { useModules } from "@/hooks/useModules";
import { useIsRegistered, useRegister } from "@/hooks/useRegistrations";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useToast } from "@/components/ui/Toast";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StateBadge } from "@/components/shared/StateBadge";
import { ModuleCard } from "@/components/shared/ModuleCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Loader } from "@/components/ui/Loader";
import { ModuleCardSkeleton, LeaderboardRowSkeleton } from "@/components/ui/Skeleton";
import { getModuleActions } from "@/lib/states";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import type { Module } from "@/types";

/** Single module CTA row */
function ModuleCTARow({ module }: { module: Module }) {
  const { isSignedIn } = useUser();
  const { isRegistered } = useIsRegistered(module.id);
  const { register, isLoading } = useRegister();
  const { toast } = useToast();
  const params = useParams<{ org: string; eventSlug: string }>();
  const actions = getModuleActions(module.state, isRegistered);

  const handleAction = async (action: string) => {
    if (!isSignedIn) {
      toast.info("Sign in required", "Please sign in to register for this module.");
      return;
    }
    if (action === "register") {
      const result = await register({ moduleId: module.id, questions: [] });
      if (result) toast.success("Registered!", `You're registered for ${module.title}`);
      else toast.error("Registration failed", "Please try again.");
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {actions.map((cta) =>
        cta.action === "participate" || cta.action === "view-results" ? (
          <Button key={cta.label} variant={cta.variant} size="sm" disabled={cta.disabled} asChild>
            <Link href={`/e/${params.org}/${params.eventSlug}/module/${module.id}`}>
              {cta.label}
            </Link>
          </Button>
        ) : (
          <Button
            key={cta.label}
            variant={cta.variant}
            size="sm"
            disabled={cta.disabled || isLoading}
            isLoading={isLoading}
            onClick={() => handleAction(cta.action)}
          >
            {cta.label}
          </Button>
        )
      )}
    </div>
  );
}

/** Leaderboard tab — first module with results */
function LeaderboardTab({ modules }: { modules: Module[] }) {
  const finishedModule = modules.find((m) => m.state === "FINISHED" || m.resultsPublished);
  const { entries, isLoading } = useLeaderboard(finishedModule?.id ?? null);

  if (!finishedModule) {
    return (
      <EmptyState
        title="No results yet"
        description="Leaderboard will appear after a module finishes and results are published."
        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>}
      />
    );
  }

  if (isLoading) return <LeaderboardRowSkeleton count={5} />;

  if (entries.length === 0) {
    return <EmptyState title="Results not published yet" description="Check back after judging is complete." />;
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          {finishedModule.title} — Leaderboard
        </p>
      </div>
      <ul className="divide-y divide-[var(--border-subtle)]">
        {entries.map((entry) => (
          <li key={entry.rank} className="flex items-center gap-4 px-4 py-3">
            <span className={[
              "w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold shrink-0",
              entry.rank === 1 ? "bg-yellow-100 text-yellow-700" :
              entry.rank === 2 ? "bg-gray-100 text-gray-600" :
              entry.rank === 3 ? "bg-orange-100 text-orange-600" :
              "bg-[var(--bg-muted)] text-[var(--text-muted)]",
            ].join(" ")}>
              {entry.rank}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                {entry.team?.name ?? entry.user.name}
              </p>
              {entry.team && (
                <p className="text-xs text-[var(--text-muted)]">{entry.user.name}</p>
              )}
            </div>
            <span className="text-sm font-semibold text-[var(--accent-500)]">
              {entry.score.toFixed(1)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function EventPage() {
  const params = useParams<{ org: string; eventSlug: string }>();
  const { event, isLoading: eventLoading } = useEvent(params.org, params.eventSlug);
  const { modules, isLoading: modulesLoading } = useModules(event?.id);
  const [activeTab, setActiveTab] = useState("overview");

  const TABS = [
    { value: "overview",    label: "Overview"    },
    { value: "modules",     label: "Modules",    badge: modules.length || undefined },
    { value: "leaderboard", label: "Leaderboard" },
    { value: "rules",       label: "Rules"       },
  ];

  if (eventLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-[var(--container-xl)] px-4 py-20">
        <EmptyState title="Event not found" description="This event doesn't exist or has been removed." />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 w-full bg-[var(--bg-muted)] overflow-hidden">
        {event.bannerUrl ? (
          <Image src={event.bannerUrl} alt={event.title} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0" style={{
            background: "linear-gradient(135deg, color-mix(in srgb, var(--accent-600) 80%, #000), color-mix(in srgb, var(--accent-400) 60%, #fff))",
          }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 sm:left-6 right-4 flex items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <StateBadge state={event.state} />
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight drop-shadow-sm">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[var(--container-xl)] px-4 sm:px-6">
        {/* Tabs */}
        <Tabs tabs={TABS} value={activeTab} onChange={setActiveTab} className="mt-0 border-b-0 border-[var(--border-default)]" />

        <div className="py-6">
          {/* Overview */}
          <Tabs.Panel value="overview" activeValue={activeTab} className="pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Description */}
                {event.description && (
                  <div>
                    <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">About</h2>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="flex flex-col gap-4">
                <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">Event Details</h3>
                  <dl className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-[var(--text-muted)]">Organized by</dt>
                      <dd className="text-[var(--text-primary)] font-medium">{event.organization.name}</dd>
                    </div>
                    {event.startsAt && (
                      <div className="flex justify-between">
                        <dt className="text-[var(--text-muted)]">Start date</dt>
                        <dd className="text-[var(--text-primary)]">{formatDate(event.startsAt)}</dd>
                      </div>
                    )}
                    {event.endsAt && (
                      <div className="flex justify-between">
                        <dt className="text-[var(--text-muted)]">End date</dt>
                        <dd className="text-[var(--text-primary)]">{formatDate(event.endsAt)}</dd>
                      </div>
                    )}
                    {event.registrationDeadline && (
                      <div className="flex justify-between">
                        <dt className="text-[var(--text-muted)]">Reg. deadline</dt>
                        <dd className="text-[var(--text-primary)]">{formatDate(event.registrationDeadline)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-[var(--text-muted)]">Modules</dt>
                      <dd className="text-[var(--text-primary)]">{modules.length}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </Tabs.Panel>

          {/* Modules */}
          <Tabs.Panel value="modules" activeValue={activeTab} className="pt-0">
            {modulesLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, i) => <ModuleCardSkeleton key={i} />)}
              </div>
            ) : modules.length === 0 ? (
              <EmptyState title="No modules yet" description="Modules will appear here once added by the organizer." />
            ) : (
              <div className="flex flex-col gap-3">
                {modules.map((m) => (
                  <ModuleCard
                    key={m.id}
                    module={m}
                    actions={<ModuleCTARow module={m} />}
                  />
                ))}
              </div>
            )}
          </Tabs.Panel>

          {/* Leaderboard */}
          <Tabs.Panel value="leaderboard" activeValue={activeTab} className="pt-0">
            <LeaderboardTab modules={modules} />
          </Tabs.Panel>

          {/* Rules */}
          <Tabs.Panel value="rules" activeValue={activeTab} className="pt-0">
            {modules.some((m) => m.rules) ? (
              <div className="flex flex-col gap-6">
                {modules.filter((m) => m.rules).map((m) => (
                  <div key={m.id} className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">{m.title} — Rules</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{m.rules}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No rules posted" description="The organizer hasn't posted rules yet." />
            )}
          </Tabs.Panel>
        </div>
      </div>
    </div>
  );
}
