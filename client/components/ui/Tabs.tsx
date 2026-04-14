"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * components/ui/Tabs.tsx
 * Controlled tab bar with underline indicator.
 * Used on Event page (Overview/Modules/Leaderboard/Rules) and Admin pages.
 */

interface Tab {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

interface TabsPanelProps {
  value: string;
  activeValue: string;
  children: React.ReactNode;
  className?: string;
}

function TabsRoot({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Tabs"
      className={cn(
        "flex gap-0 border-b border-[var(--border-default)] overflow-x-auto scrollbar-none",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            aria-disabled={tab.disabled}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.value)}
            className={cn(
              "relative inline-flex items-center gap-2 px-4 py-3 text-sm font-medium",
              "whitespace-nowrap transition-colors duration-150 cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-500)]",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              isActive
                ? "text-[var(--accent-500)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && (
              <span className={cn(
                "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1",
                "rounded-full text-xs font-semibold",
                isActive
                  ? "bg-[var(--accent-100)] text-[var(--accent-600)]"
                  : "bg-[var(--bg-muted)] text-[var(--text-muted)]"
              )}>
                {tab.badge}
              </span>
            )}
            {/* Active underline */}
            {isActive && (
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-500)] rounded-t-full"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function TabsPanel({ value, activeValue, children, className }: TabsPanelProps) {
  if (value !== activeValue) return null;
  return (
    <div role="tabpanel" className={cn("pt-6", className)}>
      {children}
    </div>
  );
}

export const Tabs = Object.assign(TabsRoot, { Panel: TabsPanel });
