"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, formatDate, truncate } from "@/lib/utils";
import { StateBadge } from "@/components/shared/StateBadge";
import type { Event } from "@/types";

/**
 * components/shared/EventCard.tsx
 * Memoized card for displaying an event in a listing grid.
 */

interface EventCardProps {
  event: Event;
  className?: string;
}

export const EventCard = React.memo(function EventCard({ event, className }: EventCardProps) {
  const href = `/e/${event.organization.slug}/${event.slug}`;

  return (
    <Link href={href} className={cn(
      "group block rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden",
      "transition-all duration-200 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)] hover:-translate-y-px",
      className
    )}>
      {/* Banner */}
      <div className="relative h-40 w-full bg-[var(--bg-muted)] overflow-hidden">
        {event.bannerUrl ? (
          <Image
            src={event.bannerUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{
              background: "radial-gradient(ellipse 80% 60% at 50% 50%, color-mix(in srgb, var(--accent-500) 15%, transparent), transparent)",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-300)" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        )}
        {/* State badge overlay */}
        <div className="absolute top-3 left-3">
          <StateBadge state={event.state} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent-500)] transition-colors">
          {truncate(event.title, 60)}
        </h3>

        <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
          <span className="w-4 h-4 shrink-0 flex items-center justify-center rounded-sm bg-[var(--bg-muted)]">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </span>
          {event.organization.name}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-1 pt-2 border-t border-[var(--border-subtle)]">
          <span className="text-xs text-[var(--text-muted)]">
            {event.startsAt ? formatDate(event.startsAt) : "Date TBD"}
          </span>
          {(event.moduleCount ?? 0) > 0 && (
            <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-muted)] px-2 py-0.5 rounded-full">
              {event.moduleCount} module{event.moduleCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
});
