import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * components/shared/Logo.tsx
 * Modulyn brand logo — uses /public/logo.png with text fallback.
 *
 * Modes:
 *   - Default: renders as <Link href="/">
 *   - asSpan:  renders as <span> (e.g. auth pages, splash screen)
 *
 * Sizes:
 *   - sm: h-6  (24px)
 *   - md: h-8  (32px)   ← default
 *   - lg: h-10 (40px)
 *   - xl: h-12 (48px)
 */

type LogoSize = "sm" | "md" | "lg" | "xl";

interface LogoProps {
  size?:      LogoSize;
  asSpan?:    boolean;
  showText?:  boolean;   // show wordmark next to logo image
  className?: string;
}

const sizeConfig: Record<LogoSize, { h: number; w: number; text: string }> = {
  sm: { h: 24,  w: 24,  text: "text-base" },
  md: { h: 32,  w: 32,  text: "text-xl"   },
  lg: { h: 40,  w: 40,  text: "text-2xl"  },
  xl: { h: 48,  w: 48,  text: "text-3xl"  },
};

function LogoMark({ size = "md", showText = true, className }: Omit<LogoProps, "asSpan">) {
  const cfg = sizeConfig[size];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 select-none",
        className
      )}
      aria-label="Modulyn"
    >
      {/* Logo image with text fallback */}
      <span className="relative shrink-0 flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="Modulyn logo"
          width={cfg.w}
          height={cfg.h}
          className="object-contain"
          priority
          onError={(e) => {
            // Hide broken image — fallback dot renders below
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Fallback accent dot (shown if logo.png fails to load) */}
        <span
          aria-hidden="true"
          className="hidden fallback:block w-2 h-2 rounded-full bg-[var(--accent-500)]"
        />
      </span>

      {/* Wordmark */}
      {showText && (
        <span
          className={cn(
            "font-semibold tracking-tight text-[var(--text-primary)]",
            cfg.text
          )}
        >
          Modulyn
        </span>
      )}
    </span>
  );
}

export function Logo({ size = "md", asSpan = false, showText = true, className }: LogoProps) {
  if (asSpan) {
    return <LogoMark size={size} showText={showText} className={className} />;
  }

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center",
        "rounded-[var(--radius-sm)]",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[var(--accent-500)] focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[var(--bg-base)]",
        "transition-opacity duration-150 hover:opacity-80",
        className
      )}
    >
      <LogoMark size={size} showText={showText} />
    </Link>
  );
}
