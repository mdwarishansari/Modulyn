"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";
import { fetcher, mutationFetcher } from "@/lib/fetcher";
import { PageHeader } from "@/components/shared/PageHeader";
import { FetchError } from "@/components/ui/FetchError";
import { EmptyState } from "@/components/shared/EmptyState";
import { Loader } from "@/components/ui/Loader";
import { Card } from "@/components/ui/Card";
import { StateBadge } from "@/components/shared/StateBadge";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { useToast } from "@/components/ui/Toast";
import { MODULE_STATE_TRANSITIONS } from "@/lib/states";
import type { Module, ModuleState } from "@/types";

function ModuleRow({ module, onStateChange }: { module: Module; onStateChange: () => void }) {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const [changing, setChanging] = useState(false);
  const nextStates = MODULE_STATE_TRANSITIONS[module.state] || [];

  const handleStateChange = async (state: ModuleState) => {
    setChanging(true);
    try {
      const token = await getToken();
      await mutationFetcher(`/modules/${module.id}/state`, "PATCH", { state }, token);
      toast.success("State updated", `${module.title} → ${state}`);
      onStateChange();
    } catch (err) {
      toast.error("Failed to update state", err instanceof Error ? err.message : "");
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-subtle)] transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{module.title}</p>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-subtle)] shrink-0">
            {module.type}
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)] truncate">
          Event: {module.event?.title ?? "Unknown Event"}
        </p>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
        <StateBadge state={module.state} showDot={false} />
        <div className="flex items-center gap-2">
          {changing ? (
            <Loader size="sm" />
          ) : nextStates.length > 0 ? (
            <Dropdown
              align="right"
              trigger={<Button variant="ghost" size="sm">Advance ▾</Button>}
              items={nextStates.map((s) => ({
                label: `→ ${s.replace(/_/g, " ")}`,
                onClick: () => handleStateChange(s),
              }))}
            />
          ) : null}
          <Button variant="secondary" size="sm" asChild>
            <Link href={`/e/${module.event?.organization.slug}/${module.event?.slug}/module/${module.id}`}>
              Preview
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminModulesPage() {
  const { getToken } = useAuth();
  
  // We need to fetch all modules across events the admin manages. Ensure the backend supports /modules/admin
  const { data: modules, error, isLoading, mutate } = useSWR<Module[]>(
    "/modules/admin",
    async (endpoint: string) => {
      const token = await getToken();
      return fetcher<Module[]>(endpoint, token);
    },
    { revalidateOnFocus: false }
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Modules" 
        description="Lifecycle management for all event modules."
      />

      {error ? (
        <FetchError onRetry={() => mutate()} />
      ) : isLoading ? (
        <div className="flex justify-center py-12"><Loader size="lg" /></div>
      ) : !modules || modules.length === 0 ? (
        <EmptyState
          title="No modules found"
          description="Create events and attach modules to them to manage their states here."
          action={<Button variant="primary" asChild><Link href="/admin/events/create">Create Event</Link></Button>}
        />
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden flex flex-col">
          {modules.map(m => (
            <ModuleRow key={m.id} module={m} onStateChange={mutate} />
          ))}
        </div>
      )}
    </div>
  );
}
