"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * components/ui/Badge.tsx
 * General-purpose status/label badge.
 * For event/module lifecycle states, use StateBadge instead.
 *
 * Usage:
 *   <Badge variant="success">Active</Badge>
 *   <Badge variant="warning" dot>Pending</Badge>
 *   <Badge variant="accent" size="lg">New</Badge>
 */

type BadgeVariant = "default" | "accent" | "success" | "warning" | "error" | "info" | "muted";
type BadgeSize    = "sm" | "md" | "lg";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?:    BadgeSize;
  dot?:     boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: [
    "bg-[var(--bg-muted)] text-[var(--text-primary)]",
    "border-[var(--border-default)]",
  ].join(" "),

  accent: [
    "bg-[var(--accent-100)] text-[var(--accent-700)]",
    "border-[var(--accent-200)]",
    ".dark & bg-[var(--accent-900)]/30 .dark & text-[var(--accent-300)]",
  ].join(" "),

  success: [
    "bg-[var(--status-success-bg)] text-[var(--status-success)]",
    "border-[color-mix(in_srgb,var(--status-success)_25%,transparent)]",
  ].join(" "),

  warning: [
    "bg-[var(--status-warning-bg)] text-[var(--status-warning)]",
    "border-[color-mix(in_srgb,var(--status-warning)_25%,transparent)]",
  ].join(" "),

  error: [
    "bg-[var(--status-error-bg)] text-[var(--status-error)]",
    "border-[color-mix(in_srgb,var(--status-error)_25%,transparent)]",
  ].join(" "),

  info: [
    "bg-[var(--status-info-bg)] text-[var(--status-info)]",
    "border-[color-mix(in_srgb,var(--status-info)_25%,transparent)]",
  ].join(" "),

  muted: [
    "bg-transparent text-[var(--text-muted)]",
    "border-[var(--border-subtle)]",
  ].join(" "),
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-[var(--text-muted)]",
  accent:  "bg-[var(--accent-500)]",
  success: "bg-[var(--status-success)]",
  warning: "bg-[var(--status-warning)]",
  error:   "bg-[var(--status-error)]",
  info:    "bg-[var(--status-info)]",
  muted:   "bg-[var(--text-muted)]",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-2.5 py-0.5 text-xs gap-1.5",
  lg: "px-3 py-1 text-sm gap-2",
};

export function Badge({
  variant = "default",
  size = "md",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium border rounded-[var(--radius-full)]",
        "transition-colors duration-150",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("shrink-0 rounded-full", size === "lg" ? "w-2 h-2" : "w-1.5 h-1.5", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
