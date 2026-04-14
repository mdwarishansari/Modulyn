"use client";

import { useState, useMemo } from "react";
import { useEvents } from "@/hooks/useEvents";
import { EventCard } from "@/components/shared/EventCard";
import { EventCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { FetchError } from "@/components/ui/FetchError";
import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/Input";
import { useDebounce } from "@/hooks/useDebounce";
import type { EventState } from "@/types";

/**
 * app/events/page.tsx — Public events listing
 */

const STATE_FILTERS: { label: string; value: EventState | "ALL" }[] = [
  { label: "All",          value: "ALL"               },
  { label: "Open",         value: "REGISTRATION_OPEN" },
  { label: "Live",         value: "LIVE"              },
  { label: "Published",    value: "PUBLISHED"         },
  { label: "Finished",     value: "FINISHED"          },
];

export default function EventsPage() {
  const { events, isLoading, error, refetch } = useEvents();
  const [search, setSearch]     = useState("");
  const [stateFilter, setStateFilter] = useState<EventState | "ALL">("ALL");
  const debouncedSearch = useDebounce(search, 250);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchState = stateFilter === "ALL" || e.state === stateFilter;
      const matchSearch = !debouncedSearch ||
        e.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        e.organization.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchState && matchSearch;
    });
  }, [events, stateFilter, debouncedSearch]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
      <PageHeader
        title="Events"
        description="Browse all events from clubs, departments, and organizations."
        className="mb-8"
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Input
          placeholder="Search events or organizations…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
          leftElement={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          }
        />
        <div className="flex flex-wrap gap-2">
          {STATE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStateFilter(f.value)}
              className={[
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150",
                stateFilter === f.value
                  ? "bg-[var(--accent-500)] text-white border-[var(--accent-500)]"
                  : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[var(--accent-500)] hover:text-[var(--accent-500)]",
              ].join(" ")}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {error ? (
        <FetchError
          title="Failed to load events"
          message={error.message ?? "Could not connect to the server."}
          onRetry={refetch}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search ? "No events matched" : "No events yet"}
          description={search ? `No results for "${search}". Try a different search.` : "Check back soon — events will appear here as they are published."}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
        />
      ) : (
        <>
          <p className="text-xs text-[var(--text-muted)] mb-4">{filtered.length} event{filtered.length !== 1 ? "s" : ""}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </>
      )}
    </div>
  );
}
