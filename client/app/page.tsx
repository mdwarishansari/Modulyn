/**
 * client/app/page.tsx
 * Homepage — placeholder until the public event listing page is implemented.
 * Replace with the real homepage design during feature development.
 */

import { Logo } from "@/components/shared/Logo";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-dvh gap-6 px-4">
      {/* Accent glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, color-mix(in srgb, var(--accent-500) 12%, transparent), transparent)",
        }}
      />

      <div className="relative flex flex-col items-center gap-4 text-center max-w-xl">
        <Logo size="lg" asSpan />

        <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
          A multi-tenant, modular event operating platform.
          <br />
          One system. Every kind of event.
        </p>

        <div className="flex items-center gap-2 mt-2">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
              bg-[var(--accent-500)]/10 text-[var(--accent-500)] border border-[var(--accent-500)]/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-500)] animate-pulse" />
            Setting up
          </span>
        </div>
      </div>
    </main>
  );
}
