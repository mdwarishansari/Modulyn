import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * components/ui/Loader.tsx
 * Spinner and skeleton loading components.
 *
 * Usage:
 *   <Loader />                        → medium centered spinner
 *   <Loader size="sm" />              → small inline spinner
 *   <Loader.Overlay />                → full-page blocking overlay
 *   <Loader.Skeleton className="h-8 w-full" />   → skeleton placeholder
 *   <Loader.Pulse className="h-4 w-32" />        → pulse rectangle
 */

type LoaderSize = "xs" | "sm" | "md" | "lg" | "xl";

interface LoaderProps extends React.SVGAttributes<SVGSVGElement> {
  size?: LoaderSize;
  label?: string;
}

const sizeMap: Record<LoaderSize, number> = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 36,
  xl: 48,
};

function Spinner({ size = "md", label = "Loading…", className, ...props }: LoaderProps) {
  const px = sizeMap[size];
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      aria-label={label}
      role="status"
      className={cn("animate-spin text-[var(--accent-500)]", className)}
      {...props}
    >
      <circle
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="opacity-20"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LoaderOverlay({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      className="fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center bg-[var(--bg-overlay)] backdrop-blur-sm"
      role="status"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      </div>
    </div>
  );
}

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] bg-[var(--bg-muted)]",
        "animate-pulse",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

function Pulse({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-sm)] bg-[var(--bg-muted)]",
        "animate-pulse opacity-60",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

// Attach sub-components
Spinner.Overlay  = LoaderOverlay;
Spinner.Skeleton = Skeleton;
Spinner.Pulse    = Pulse;

export { Spinner as Loader };
