"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * components/shared/EmptyState.tsx
 * Generic empty/zero-data state with icon, heading, subtext and optional CTA.
 */

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-16 px-6 text-center", className)}>
      {icon && (
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[var(--bg-muted)] text-[var(--text-muted)]">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1 max-w-xs">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>
        {description && (
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
