import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * client/components/shared/Logo.tsx
 * Modulyn wordmark logo. Renders as a <Link> to "/" by default.
 * Pass `asSpan` to render the mark without a link (e.g. in auth pages).
 */

interface LogoProps {
  size?: "sm" | "md" | "lg";
  asSpan?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { text: "text-base", dot: "w-2 h-2" },
  md: { text: "text-xl",   dot: "w-2.5 h-2.5" },
  lg: { text: "text-3xl",  dot: "w-3 h-3" },
};

function LogoMark({ size = "md", className }: Omit<LogoProps, "asSpan">) {
  const s = sizeMap[size];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold tracking-tight select-none",
        s.text,
        className
      )}
      aria-label="Modulyn"
    >
      <span className="text-[var(--text-primary)]">Modulyn</span>
      {/* Accent dot — represents the "module" identity */}
      <span
        className={cn(
          "rounded-full bg-[var(--accent-500)] shrink-0 mb-[0.1em]",
          s.dot
        )}
        aria-hidden="true"
      />
    </span>
  );
}

export function Logo({ size = "md", asSpan = false, className }: LogoProps) {
  if (asSpan) {
    return <LogoMark size={size} className={className} />;
  }

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-[var(--accent-500)]",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]",
        "rounded-[var(--radius-sm)]",
        className
      )}
    >
      <LogoMark size={size} />
    </Link>
  );
}
