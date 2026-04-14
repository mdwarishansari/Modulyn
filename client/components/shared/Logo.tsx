"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * components/shared/Logo.tsx
 * CLIENT COMPONENT — uses onError (event handler), requires "use client".
 * Uses /public/logo.png with a text+dot fallback if the image fails to load.
 */

type LogoSize = "sm" | "md" | "lg" | "xl";

interface LogoProps {
  size?:     LogoSize;
  asSpan?:   boolean;
  showText?: boolean;
  className?: string;
}

const sizeConfig: Record<LogoSize, { h: number; w: number; text: string }> = {
  sm: { h: 24, w: 24, text: "text-base" },
  md: { h: 32, w: 32, text: "text-xl"   },
  lg: { h: 40, w: 40, text: "text-2xl"  },
  xl: { h: 48, w: 48, text: "text-3xl"  },
};

function LogoMark({
  size = "md",
  showText = true,
  className,
}: Omit<LogoProps, "asSpan">) {
  const cfg = sizeConfig[size];
  const [imgError, setImgError] = React.useState(false);

  return (
    <span
      className={cn("inline-flex items-center gap-2 select-none", className)}
      aria-label="Modulyn"
    >
      <span className="relative shrink-0 flex items-center justify-center">
        {imgError ? (
          /* Fallback: accent dot when logo.png fails */
          <span
            aria-hidden="true"
            className="w-2 h-2 rounded-full bg-[var(--accent-500)]"
          />
        ) : (
          <Image
            src="/logo.png"
            alt="Modulyn logo"
            width={cfg.w}
            height={cfg.h}
            className="object-contain"
            priority
            onError={() => setImgError(true)}
          />
        )}
      </span>

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

export function Logo({
  size = "md",
  asSpan = false,
  showText = true,
  className,
}: LogoProps) {
  if (asSpan) {
    return <LogoMark size={size} showText={showText} className={className} />;
  }

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center rounded-[var(--radius-sm)]",
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
