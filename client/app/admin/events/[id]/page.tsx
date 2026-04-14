"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useEvent } from "@/hooks/useEvents";
import { useModules } from "@/hooks/useModules";
import { useAllSubmissions } from "@/hooks/useSubmissions";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { StateBadge } from "@/components/shared/StateBadge";
import { Dropdown } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { EmptyState } from "@/components/shared/EmptyState";
import { SubmissionRowSkeleton } from "@/components/ui/Skeleton";
import { mutationFetcher } from "@/lib/fetcher";
import { MODULE_STATE_TRANSITIONS } from "@/lib/states";
import type { ModuleState, Module } from "@/types";
import Link from "next/link";

function ModuleAdminRow({ module, onStateChange }: { module: Module; onStateChange: () => void }) {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const nextStates = MODULE_STATE_TRANSITIONS[module.state];

  const handleStateChange = async (state: ModuleState) => {
    try {
      const token = await getToken();
      await mutationFetcher(`/modules/${module.id}/state`, "PATCH", { state }, token);
      toast.success("Module state updated");
      onStateChange();
    } catch (err) {
      toast.error("Failed", err instanceof Error ? err.message : "");
    }
  };

  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-[var(--border-subtle)] last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--text-primary)]">{module.title}</p>
        <p className="text-xs text-[var(--text-muted)]">{module.type} · {module.mode}</p>
      </div>
      <StateBadge state={module.state} showDot={false} />
      <div className="flex items-center gap-2 shrink-0">
        {nextStates.length > 0 && (
          <Dropdown
            align="right"
            trigger={<Button variant="ghost" size="sm">Advance ▾</Button>}
            items={nextStates.map((s) => ({ label: `→ ${s.replace(/_/g, " ")}`, onClick: () => handleStateChange(s) }))}
          />
        )}
        <Button variant="secondary" size="sm" asChild>
          <Link href={`/admin/modules/${module.id}`}>Details</Link>
        </Button>
      </div>
    </div>
  );
}

export default function AdminEventDetailPage() {
  const params = useParams<{ id: string }>();
  const { event, isLoading, refetch } = useEvent("", ""); // We fetch by ID via modules
  const { modules, isLoading: modulesLoading, refetch: refetchModules } = useModules(params.id);
  const { getToken } = useAuth();
  const { toast } = useToast();

  // Since we only have org+slug route for events, fetch via a direct approach
  // The admin page gets event from modules' parent — simplified via first module if available
  const firstModule = modules[0];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={firstModule?.event?.title ?? `Event ${params.id.slice(0, 8)}…`}
        description="Manage modules, state, and settings."
        actions={
          <Button variant="primary" size="sm" asChild>
            <Link href="/admin/events">← Back to Events</Link>
          </Button>
        }
      />

      {/* Modules */}
      <section>
        <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Modules</h2>
        {modulesLoading ? (
          <Loader size="md" />
        ) : modules.length === 0 ? (
          <EmptyState title="No modules" description="No modules added to this event yet." />
        ) : (
          <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden">
            {modules.map((m) => (
              <ModuleAdminRow key={m.id} module={m} onStateChange={refetchModules} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
