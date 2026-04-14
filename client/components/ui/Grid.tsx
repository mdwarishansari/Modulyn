"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * components/ui/Grid.tsx
 * Responsive grid layout system.
 *
 * Usage:
 *   <Grid cols={3} gap="md">
 *     <Card />
 *     <Card />
 *     <Card />
 *   </Grid>
 *
 *   <Grid cols={{ base: 1, sm: 2, lg: 3 }} gap="lg">
 *     ...
 *   </Grid>
 */

type ColCount = 1 | 2 | 3 | 4 | 5 | 6 | 12;
type GapSize  = "none" | "xs" | "sm" | "md" | "lg" | "xl";

type ResponsiveCols = {
  base?: ColCount;
  sm?:   ColCount;
  md?:   ColCount;
  lg?:   ColCount;
  xl?:   ColCount;
};

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: ColCount | ResponsiveCols;
  gap?:  GapSize;
}

const colClass: Record<ColCount, string> = {
  1:  "grid-cols-1",
  2:  "grid-cols-2",
  3:  "grid-cols-3",
  4:  "grid-cols-4",
  5:  "grid-cols-5",
  6:  "grid-cols-6",
  12: "grid-cols-12",
};

const smColClass: Record<ColCount, string> = {
  1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3",
  4: "sm:grid-cols-4", 5: "sm:grid-cols-5", 6: "sm:grid-cols-6",
  12: "sm:grid-cols-12",
};
const mdColClass: Record<ColCount, string> = {
  1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3",
  4: "md:grid-cols-4", 5: "md:grid-cols-5", 6: "md:grid-cols-6",
  12: "md:grid-cols-12",
};
const lgColClass: Record<ColCount, string> = {
  1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3",
  4: "lg:grid-cols-4", 5: "lg:grid-cols-5", 6: "lg:grid-cols-6",
  12: "lg:grid-cols-12",
};
const xlColClass: Record<ColCount, string> = {
  1: "xl:grid-cols-1", 2: "xl:grid-cols-2", 3: "xl:grid-cols-3",
  4: "xl:grid-cols-4", 5: "xl:grid-cols-5", 6: "xl:grid-cols-6",
  12: "xl:grid-cols-12",
};

const gapClasses: Record<GapSize, string> = {
  none: "gap-0",
  xs:   "gap-2",
  sm:   "gap-4",
  md:   "gap-6",
  lg:   "gap-8",
  xl:   "gap-12",
};

export function Grid({
  cols = 3,
  gap = "md",
  className,
  children,
  ...props
}: GridProps) {
  let colClasses: string;

  if (typeof cols === "number") {
    colClasses = colClass[cols];
  } else {
    colClasses = cn(
      cols.base && colClass[cols.base],
      cols.sm   && smColClass[cols.sm],
      cols.md   && mdColClass[cols.md],
      cols.lg   && lgColClass[cols.lg],
      cols.xl   && xlColClass[cols.xl],
    );
  }

  return (
    <div
      className={cn("grid", colClasses, gapClasses[gap], className)}
      {...props}
    >
      {children}
    </div>
  );
}
