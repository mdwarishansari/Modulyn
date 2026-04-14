"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { EventState, ModuleState } from "@/types";

/**
 * client/components/shared/StateBadge.tsx
 * Renders a colored badge for event or module lifecycle states.
 * Uses the CSS state color tokens from globals.css.
 */

type AnyState = EventState | ModuleState;

const stateConfig: Record<AnyState, { label: string; colorVar: string }> = {
  // Event states
  DRAFT:               { label: "Draft",              colorVar: "var(--state-draft)"      },
  PUBLISHED:           { label: "Published",          colorVar: "var(--state-published)"  },
  REGISTRATION_OPEN:   { label: "Registration Open",  colorVar: "var(--state-reg-open)"   },
  REGISTRATION_CLOSED: { label: "Reg. Closed",        colorVar: "var(--state-reg-closed)" },
  LIVE:                { label: "Live",               colorVar: "var(--state-live)"       },
  FINISHED:            { label: "Finished",           colorVar: "var(--state-finished)"   },
  ARCHIVED:            { label: "Archived",           colorVar: "var(--state-archived)"   },
  // Module-only states
  INACTIVE:            { label: "Inactive",           colorVar: "var(--state-draft)"      },
};

interface StateBadgeProps {
  state: AnyState;
  showDot?: boolean;
  className?: string;
}

export function StateBadge({ state, showDot = true, className }: StateBadgeProps) {
  const { label, colorVar } = stateConfig[state] ?? {
    label: state,
    colorVar: "var(--state-archived)",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5",
        "rounded-full text-xs font-medium border",
        className
      )}
      style={{
        color: colorVar,
        borderColor: `color-mix(in srgb, ${colorVar} 30%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${colorVar} 10%, transparent)`,
      }}
    >
      {showDot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: colorVar }}
          aria-hidden="true"
        />
      )}
      {label}
    </span>
  );
}
