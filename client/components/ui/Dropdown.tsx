"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * components/ui/Dropdown.tsx
 * Accessible popover action menu. Click-outside closes.
 * Uses --z-dropdown token.
 *
 * Usage:
 *   <Dropdown trigger={<Button>Actions</Button>} items={[
 *     { label: "Edit", onClick: () => {} },
 *     { label: "Delete", onClick: () => {}, variant: "danger" },
 *   ]} />
 */

export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "danger";
  disabled?: boolean;
  separator?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({ trigger, items, align = "right", className }: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close on click outside
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Close on Escape
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  return (
    <div className={cn("relative inline-block", className)} ref={containerRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen((v) => !v)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Menu */}
      {isOpen && (
        <div
          role="menu"
          className={cn(
            "absolute top-full mt-1.5 min-w-[160px] py-1",
            "bg-[var(--bg-card)] border border-[var(--border-default)]",
            "rounded-[var(--radius-md)] shadow-[var(--shadow-lg)]",
            "z-[var(--z-dropdown)]",
            "animate-in fade-in zoom-in-95 duration-100",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item, i) => (
            <React.Fragment key={i}>
              {item.separator && i > 0 && (
                <div className="my-1 border-t border-[var(--border-subtle)]" />
              )}
              <button
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick();
                    setIsOpen(false);
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left",
                  "transition-colors duration-100 cursor-pointer",
                  "focus-visible:outline-none focus-visible:bg-[var(--bg-subtle)]",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  item.variant === "danger"
                    ? "text-[var(--status-error)] hover:bg-[var(--status-error-bg)]"
                    : "text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                )}
              >
                {item.icon && (
                  <span className="shrink-0 w-4 h-4 flex items-center justify-center">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
