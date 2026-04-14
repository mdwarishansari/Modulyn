"use client";

import Link from "next/link";
import { useEvents } from "@/hooks/useEvents";
import { EventCard } from "@/components/shared/EventCard";
import { EventCardSkeleton } from "@/components/ui/Skeleton";

/**
 * app/page.tsx — Modulyn Landing Page (Phase 12 polish)
 * - Tighter hero vertical spacing
 * - Narrower description max-w
 * - Reduced glow intensity
 * - Label/subtitle pattern consistent across all sections
 */

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Multi-Module Events",
    description: "Hackathons, quizzes, coding, poster sessions — all inside a single event.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Teams & Individuals",
    description: "Per-module mode config, auto join codes, and flexible team size limits.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Live Leaderboards",
    description: "Real-time rankings via WebSocket with REST fallback polling.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Multi-Tenant & Secure",
    description: "Org-level isolation, Clerk auth, type-safe scoped API calls.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "State Machine Lifecycle",
    description: "Draft → Published → Reg Open → Live → Finished → Archived.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    title: "Submission Engine",
    description: "Type-aware validators, judge scoring, feedback, and result publishing.",
  },
];

// ─── Shared section label pattern ──────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-widest text-[var(--accent-500)] uppercase mb-3">
      {children}
    </p>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-22 lg:py-28">
      {/* Subtle radial glow — reduced intensity */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -5%, color-mix(in srgb, var(--accent-500) 10%, transparent), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-[var(--accent-500)]/20 bg-[var(--accent-500)]/6 text-[var(--accent-500)] mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-500)] animate-pulse" aria-hidden />
          Multi-Tenant Event Platform
        </span>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-[var(--text-primary)] tracking-tight leading-[1.1] max-w-2xl">
          Run every kind of event.{" "}
          <span className="text-[var(--accent-500)]">One platform.</span>
        </h1>

        {/* Description — narrower, muted */}
        <p className="mt-5 text-base text-[var(--text-muted)] max-w-md leading-relaxed">
          Modulyn powers quiz, hackathon, coding, poster, and more — for colleges,
          clubs, and organizations of any size.
        </p>

        {/* CTAs — equal height h-11, clear primary vs secondary */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/events"
            className="inline-flex items-center justify-center h-11 px-7 rounded-[var(--radius-lg)] bg-[var(--accent-500)] text-white text-sm font-semibold shadow-[var(--shadow-accent)] transition-all duration-200 hover:bg-[var(--accent-600)] hover:-translate-y-px active:scale-[0.97]"
          >
            Browse Events
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center h-11 px-7 rounded-[var(--radius-lg)] bg-[var(--bg-card)] text-[var(--text-secondary)] text-sm font-medium border border-[var(--border-default)] transition-all duration-200 hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)] active:scale-[0.97]"
          >
            Get Started Free
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-6 sm:gap-10 w-full max-w-xs sm:max-w-sm">
          {[["8+", "Module types"], ["∞", "Events"], ["Live", "Leaderboard"]].map(([val, label]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{val}</span>
              <span className="text-xs text-[var(--text-muted)] leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[var(--bg-subtle)]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-12">
          <SectionLabel>Platform</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Everything you need
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-2 max-w-sm mx-auto leading-relaxed">
            A complete event operating system for any organization.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group p-5 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-default)] flex flex-col gap-3 transition-all duration-200 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)] hover:-translate-y-px"
            >
              {/* Icon — softer, smaller */}
              <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--accent-50)] flex items-center justify-center text-[var(--accent-500)] shrink-0 transition-transform duration-200 group-hover:scale-105">
                {f.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{f.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Live Events ──────────────────────────────────────────────────────────────

function LiveEventsSection() {
  const { events, isLoading } = useEvents();
  const preview = events
    .filter((e) => ["REGISTRATION_OPEN", "LIVE", "PUBLISHED"].includes(e.state))
    .slice(0, 3);

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section header — same pattern */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <SectionLabel>Events</SectionLabel>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Live &amp; Open Now
            </h2>
          </div>
          <Link
            href="/events"
            className="text-xs font-medium text-[var(--accent-500)] hover:text-[var(--accent-600)] transition-colors shrink-0"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)
            : preview.length > 0
              ? preview.map((e) => <EventCard key={e.id} event={e} />)
              : (
                <div className="col-span-3 py-14 text-center">
                  <p className="text-sm text-[var(--text-muted)]">
                    No live events right now.{" "}
                    <Link href="/events" className="text-[var(--accent-500)] hover:underline">
                      Browse all events
                    </Link>
                  </p>
                </div>
              )
          }
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm font-bold text-[var(--text-primary)] tracking-tight">Modulyn</p>
        <div className="flex items-center gap-5">
          {[["Events", "/events"], ["Sign In", "/sign-in"], ["Sign Up", "/sign-up"]].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-[var(--text-disabled)]">
          © {new Date().getFullYear()} Modulyn
        </p>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <LiveEventsSection />
      <Footer />
    </>
  );
}
