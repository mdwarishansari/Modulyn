/**
 * components/ui/Skeleton/index.ts
 * Pre-built skeleton layouts for consistent loading states.
 * All compose Loader.Skeleton from ui/Loader.tsx.
 */

"use client";

import * as React from "react";
import { Loader } from "@/components/ui/Loader";
import { cn } from "@/lib/utils";

const S = Loader.Skeleton;

// ─── Event Card Skeleton ──────────────────────────────────────────────────────

export function EventCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden", className)}>
      {/* Banner */}
      <S className="h-40 w-full rounded-none" />
      <div className="p-5 flex flex-col gap-3">
        {/* State badge */}
        <S className="h-5 w-24 rounded-full" />
        {/* Title */}
        <S className="h-5 w-3/4" />
        {/* Org */}
        <S className="h-4 w-1/2" />
        {/* Footer row */}
        <div className="flex items-center gap-2 mt-1">
          <S className="h-4 w-20" />
          <S className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

// ─── Module Card Skeleton ─────────────────────────────────────────────────────

export function ModuleCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-5", className)}>
      <div className="flex items-start gap-4">
        {/* Type icon */}
        <S className="h-10 w-10 rounded-[var(--radius-md)] shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          {/* Badge row */}
          <div className="flex gap-2">
            <S className="h-5 w-16 rounded-full" />
            <S className="h-5 w-20 rounded-full" />
          </div>
          {/* Title */}
          <S className="h-5 w-2/3" />
          {/* Description */}
          <S className="h-4 w-full" />
          <S className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
}

// ─── Leaderboard Row Skeleton ─────────────────────────────────────────────────

export function LeaderboardRowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col divide-y divide-[var(--border-subtle)]">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 px-4">
          <S className="h-6 w-6 rounded-full shrink-0" />
          <S className="h-8 w-8 rounded-full shrink-0" />
          <S className="h-4 flex-1" />
          <S className="h-5 w-14" />
        </div>
      ))}
    </div>
  );
}

// ─── Submission Row Skeleton ──────────────────────────────────────────────────

export function SubmissionRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)]">
          <div className="flex-1 flex flex-col gap-2">
            <S className="h-4 w-1/3" />
            <S className="h-3 w-1/4" />
          </div>
          <S className="h-6 w-20 rounded-full" />
          <S className="h-5 w-12" />
        </div>
      ))}
    </div>
  );
}

// ─── Dashboard Stats Skeleton ─────────────────────────────────────────────────

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-5 flex flex-col gap-3">
          <S className="h-4 w-24" />
          <S className="h-8 w-16" />
          <S className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}
