"use client";

import { useState } from "react";
import Link from "next/link";
import { useEvents } from "@/hooks/useEvents";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { StateBadge } from "@/components/shared/StateBadge";
import { Dropdown } from "@/components/ui/Dropdown";
import { EmptyState } from "@/components/shared/EmptyState";
import { Loader } from "@/components/ui/Loader";
import { mutationFetcher } from "@/lib/fetcher";
import { useAuth } from "@clerk/nextjs";
import { EVENT_STATE_TRANSITIONS } from "@/lib/states";
import type { EventState, Event } from "@/types";
import { formatDate } from "@/lib/utils";

function EventRow({ event, onStateChange }: { event: Event; onStateChange: () => void }) {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const [changing, setChanging] = useState(false);
  const nextStates = EVENT_STATE_TRANSITIONS[event.state];

  const handleStateChange = async (state: EventState) => {
    setChanging(true);
    try {
      const token = await getToken();
      await mutationFetcher(`/events/${event.id}/state`, "PATCH", { state }, token);
      toast.success("State updated", `${event.title} → ${state}`);
      onStateChange();
    } catch (err) {
      toast.error("Failed to update state", err instanceof Error ? err.message : "");
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-subtle)] transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{event.title}</p>
        <p className="text-xs text-[var(--text-muted)]">
          {event.organization.name} · {event.startsAt ? formatDate(event.startsAt) : "No date"}
        </p>
      </div>
      <StateBadge state={event.state} showDot={false} />
      <div className="flex items-center gap-2 shrink-0">
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
          <Link href={`/admin/events/${event.id}`}>Manage</Link>
        </Button>
      </div>
    </div>
  );
}

export default function AdminEventsPage() {
  const { events, isLoading, refetch } = useEvents();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Events"
        description="Manage all events and their lifecycle state."
        actions={
          <Button variant="primary" size="sm" asChild>
            <Link href="/admin/events/create">+ Create Event</Link>
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader size="lg" /></div>
      ) : events.length === 0 ? (
        <EmptyState
          title="No events yet"
          description="Create your first event to get started."
          action={<Button variant="primary" size="sm" asChild><Link href="/admin/events/create">Create Event</Link></Button>}
        />
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden">
          {events.map((e) => (
            <EventRow key={e.id} event={e} onStateChange={refetch} />
          ))}
        </div>
      )}
    </div>
  );
}
