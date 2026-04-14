"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * components/ui/FetchError.tsx
 * Reusable error + retry UI for failed API calls.
 */

interface FetchErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function FetchError({
  title = "Failed to load",
  message = "Something went wrong. Please try again.",
  onRetry,
  className,
}: FetchErrorProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 px-6 text-center",
        className
      )}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-full bg-[var(--status-error-bg)] flex items-center justify-center text-[var(--status-error)]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1 max-w-xs">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{message}</p>
      </div>

      {/* Retry */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-[var(--radius-md)] text-sm font-medium border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all duration-150 active:scale-[0.97]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Try again
        </button>
      )}
    </div>
  );
}
