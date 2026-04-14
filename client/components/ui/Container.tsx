"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * components/ui/Container.tsx
 * Max-width layout wrapper. Centers content with consistent horizontal padding.
 * Use this as the immediate child of a <Section> or <main>.
 *
 * Sizes map to --container-* tokens:
 *   xs  → 480px   (narrow — auth pages, dialogs)
 *   sm  → 640px   (compact — settings, forms)
 *   md  → 768px   (default — article, event details)
 *   lg  → 1024px  (wide — dashboards)
 *   xl  → 1280px  (full — main layout)
 *   2xl → 1440px  (max — large screens)
 */

type ContainerSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  noPadding?: boolean;
}

const maxWidths: Record<ContainerSize, string> = {
  "xs":  "max-w-[var(--container-xs)]",
  "sm":  "max-w-[var(--container-sm)]",
  "md":  "max-w-[var(--container-md)]",
  "lg":  "max-w-[var(--container-lg)]",
  "xl":  "max-w-[var(--container-xl)]",
  "2xl": "max-w-[var(--container-2xl)]",
};

export function Container({
  size = "xl",
  noPadding = false,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto",
        !noPadding && "px-4 sm:px-6 lg:px-8",
        maxWidths[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
