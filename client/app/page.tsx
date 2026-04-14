"use client";

import Link from "next/link";
import { useEvents } from "@/hooks/useEvents";
import { EventCard } from "@/components/shared/EventCard";
import { EventCardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

/**
 * app/page.tsx — Modulyn Landing Page (Fixed layout, typography, responsiveness)
 */

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Multi-Module Events",
    description: "Run hackathons, quizzes, coding contests, poster presentations, and more — all inside a single event.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Teams & Individuals",
    description: "Per-module configuration for INDIVIDUAL or TEAM mode. Auto-generate join codes, manage team sizes.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Live Leaderboards",
    description: "Real-time rankings via WebSocket with automatic REST API fallback. Results published with one click.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Multi-Tenant & Secure",
    description: "Org-level isolation. Clerk-powered auth. Every API call is scoped, type-safe, and rate-limited.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Lifecycle State Machine",
    description: "Events and modules progress through states: Draft → Published → Reg Open → Live → Finished → Archived.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    title: "Submission Engine",
    description: "Type-aware submission validator per module. Judge-panel with scoring, feedback, and result publishing.",
  },
];

// ─── Section: Hero ─────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-32">
      {/* Radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% -10%, color-mix(in srgb, var(--accent-500) 14%, transparent), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border bg-[var(--accent-500)]/8 text-[var(--accent-500)] border-[var(--accent-500)]/20 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-500)] animate-pulse" aria-hidden />
          Multi-Tenant Event Operating System
        </span>

        {/* Heading — responsive scale */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] tracking-tight leading-[1.08] max-w-3xl">
          Run every kind of event.{" "}
          <span style={{ color: "var(--accent-500)" }}>One system.</span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-base sm:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
          Modulyn is a modular, multi-tenant platform for colleges, clubs, and
          organizations — quiz, hackathon, coding, poster, and more.
        </p>

        {/* CTA buttons — equal height, consistent gap */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/events"
            className="inline-flex items-center justify-center h-11 px-6 rounded-[var(--radius-lg)] bg-[var(--accent-500)] text-white text-sm font-semibold shadow-[var(--shadow-accent)] transition-all duration-200 hover:bg-[var(--accent-600)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] active:scale-[0.97]"
          >
            Browse Events
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center h-11 px-6 rounded-[var(--radius-lg)] bg-[var(--bg-card)] text-[var(--text-primary)] text-sm font-semibold border border-[var(--border-default)] shadow-[var(--shadow-sm)] transition-all duration-200 hover:bg-[var(--bg-subtle)] hover:border-[var(--border-strong)] hover:-translate-y-0.5 active:scale-[0.97]"
          >
            Get Started Free
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-14 pt-8 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-8 w-full max-w-xs sm:max-w-sm">
          {[["8+", "Module Types"], ["∞", "Events"], ["Live", "Leaderboard"]].map(([val, label]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">{val}</span>
              <span className="text-xs text-[var(--text-muted)] text-center leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Features ─────────────────────────────────────────────────────────

function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[var(--bg-subtle)]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Everything you need
          </h2>
          <p className="text-[var(--text-secondary)] mt-3 max-w-md mx-auto text-base">
            A complete event operating system built for organizations of any size.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-[var(--radius-xl)] bg-[var(--bg-card)] border border-[var(--border-default)] flex flex-col gap-4 transition-all duration-200 hover:border-[var(--accent-500)]/40 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--accent-50)] flex items-center justify-center text-[var(--accent-500)] transition-transform duration-200 group-hover:scale-110 shrink-0">
                {f.icon}
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{f.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Live Events ──────────────────────────────────────────────────────

function LiveEventsSection() {
  const { events, isLoading } = useEvents();
  const preview = events
    .filter((e) => ["REGISTRATION_OPEN", "LIVE", "PUBLISHED"].includes(e.state))
    .slice(0, 3);

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              Live &amp; Open Events
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1.5">Register or participate right now</p>
          </div>
          <Link
            href="/events"
            className="text-sm font-medium text-[var(--accent-500)] hover:text-[var(--accent-600)] transition-colors shrink-0"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)
            : preview.length > 0
              ? preview.map((e) => <EventCard key={e.id} event={e} />)
              : (
                <div className="col-span-3 py-16 text-center">
                  <p className="text-sm text-[var(--text-muted)]">
                    No live events right now.{" "}
                    <Link href="/events" className="text-[var(--accent-500)] hover:underline">Browse all events</Link>
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
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm font-bold text-[var(--text-primary)] tracking-tight">Modulyn</span>
        <div className="flex items-center gap-6">
          {[["Events", "/events"], ["Sign In", "/sign-in"], ["Sign Up", "/sign-up"]].map(([label, href]) => (
            <Link key={href} href={href} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              {label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-[var(--text-disabled)]">
          © {new Date().getFullYear()} Modulyn. All rights reserved.
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
