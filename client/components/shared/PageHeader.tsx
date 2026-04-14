"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * components/shared/PageHeader.tsx
 * Consistent page-level header: title + subtitle + right action slot.
 */

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, breadcrumb, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4", className)}>
      <div className="flex flex-col gap-1">
        {breadcrumb && <div className="text-sm text-[var(--text-muted)]">{breadcrumb}</div>}
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0 mt-2 sm:mt-0">{actions}</div>}
    </div>
  );
}
