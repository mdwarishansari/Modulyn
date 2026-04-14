"use client";

import * as React from "react";
import { cn, truncate } from "@/lib/utils";
import { StateBadge } from "@/components/shared/StateBadge";
import type { Module, ModuleType } from "@/types";

/**
 * components/shared/ModuleCard.tsx
 * Memoized card for displaying a module within an event.
 */

const MODULE_ICONS: Record<ModuleType, React.ReactNode> = {
  QUIZ:         <path d="M9 9a3 3 0 1 1 6 0c0 2-3 3-3 5m0 3h.01" strokeLinecap="round" strokeLinejoin="round" />,
  CODING:       <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>,
  HACKATHON:    <><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></>,
  POSTER:       <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></>,
  UIUX:         <><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>,
  VOTING:       <><path d="m9 12 2 2 4-4" /><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7z" /><path d="M22 19H2" /></>,
  PRESENTATION: <><path d="M2 3h20v13H2z" /><path d="M8 21l4-7 4 7" /><path d="M12 14v-4" /></>,
  CUSTOM:       <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" /></>,
};

function ModuleTypeIcon({ type }: { type: ModuleType }) {
  return (
    <svg
      width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="var(--accent-500)" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      {MODULE_ICONS[type]}
    </svg>
  );
}

interface ModuleCardProps {
  module: Module;
  actions?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ModuleCard = React.memo(function ModuleCard({ module, actions, onClick, className }: ModuleCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] p-5",
        "transition-all duration-200",
        onClick && "cursor-pointer hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)] hover:bg-[var(--bg-card-hover)]",
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-50)]">
          <ModuleTypeIcon type={module.type} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <StateBadge state={module.state} />
            <span className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
              "bg-[var(--bg-muted)] text-[var(--text-muted)] border-[var(--border-default)]"
            )}>
              {module.mode === "TEAM" ? `Team · up to ${module.maxTeamSize ?? "?"}` : "Individual"}
            </span>
            <span className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
              "bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border-subtle)]"
            )}>
              {module.type}
            </span>
          </div>

          <h4 className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
            {truncate(module.title, 70)}
          </h4>

          {module.description && (
            <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
              {truncate(module.description, 100)}
            </p>
          )}

          {module.registrationDeadline && (
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Reg. closes: <span className="text-[var(--text-secondary)]">
                {new Date(module.registrationDeadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      {actions && (
        <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center gap-2 justify-end">
          {actions}
        </div>
      )}
    </div>
  );
});
