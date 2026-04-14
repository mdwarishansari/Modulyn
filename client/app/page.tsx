"use client";

import Link from "next/link";
import { useEvents } from "@/hooks/useEvents";
import { EventCard } from "@/components/shared/EventCard";
import { EventCardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

/**
 * app/page.tsx — Modulyn Landing Page
 */

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Multi-Module Events",
    description: "Run hackathons, quizzes, coding contests, poster presentations, and more — all inside a single event.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Teams & Individuals",
    description: "Per-module configuration for INDIVIDUAL or TEAM mode. Auto-generate join codes, manage team sizes.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Live Leaderboards",
    description: "Real-time rankings via WebSocket with automatic REST API fallback. Results published with one click.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Multi-Tenant & Secure",
    description: "Org-level isolation. Clerk-powered auth. Every API call is scoped, type-safe, and rate-limited.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Lifecycle State Machine",
    description: "Events and modules progress through states: Draft → Published → Reg Open → Live → Finished → Archived.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    title: "Submission Engine",
    description: "Type-aware submission validator per module. Judge-panel with scoring, feedback, and result publishing.",
  },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 px-4">
      {/* Glow */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in srgb, var(--accent-500) 12%, transparent), transparent)" }}
      />
      <div className="relative mx-auto max-w-[var(--container-md)] text-center flex flex-col items-center gap-6">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border bg-[var(--accent-500)]/10 text-[var(--accent-500)] border-[var(--accent-500)]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-500)] animate-pulse" />
          Multi-Tenant Event Operating System
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] tracking-tight leading-[1.1]">
          Run every kind of event.<br />
          <span style={{ color: "var(--accent-500)" }}>One system.</span>
        </h1>

        <p className="text-lg text-[var(--text-secondary)] max-w-lg leading-relaxed">
          Modulyn is a modular, multi-tenant platform for colleges, clubs, and organizations — quiz, hackathon, coding, poster, and more.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <Button size="lg" variant="primary" asChild>
            <Link href="/events">Browse Events</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-10 pt-8 border-t border-[var(--border-subtle)] w-full max-w-sm">
          {[["8+", "Module Types"], ["∞", "Events"], ["Real-time", "Leaderboard"]].map(([val, label]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-[var(--text-primary)]">{val}</span>
              <span className="text-xs text-[var(--text-muted)] text-center">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-[var(--bg-subtle)]">
      <div className="mx-auto max-w-[var(--container-xl)]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Everything you need</h2>
          <p className="text-[var(--text-secondary)] mt-2 max-w-md mx-auto">A complete event operating system built for organizations of any size.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="group p-6 rounded-[var(--radius-xl)] bg-[var(--bg-card)] border border-[var(--border-default)] transition-all duration-200 hover:border-[var(--accent-500)]/40 hover:shadow-[var(--shadow-md)]">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--accent-50)] flex items-center justify-center text-[var(--accent-500)] mb-4 transition-transform duration-200 group-hover:scale-110">
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{f.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveEventsSection() {
  const { events, isLoading } = useEvents();
  const preview = events.filter((e) => ["REGISTRATION_OPEN", "LIVE", "PUBLISHED"].includes(e.state)).slice(0, 3);

  return (
    <section className="py-20 px-4">
      <div className="mx-auto max-w-[var(--container-xl)]">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Live &amp; Open Events</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Register or participate right now</p>
          </div>
          <Link href="/events" className="text-sm font-medium text-[var(--accent-500)] hover:text-[var(--accent-600)] transition-colors">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)
            : preview.length > 0
              ? preview.map((e) => <EventCard key={e.id} event={e} />)
              : (
                <div className="col-span-3 py-12 text-center text-sm text-[var(--text-muted)]">
                  No live events right now. <Link href="/events" className="text-[var(--accent-500)] hover:underline">Browse all events</Link>
                </div>
              )
          }
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] py-10 px-4">
      <div className="mx-auto max-w-[var(--container-xl)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">Modulyn</span>
        <div className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
          <Link href="/events" className="hover:text-[var(--text-primary)] transition-colors">Events</Link>
          <Link href="/sign-in" className="hover:text-[var(--text-primary)] transition-colors">Sign In</Link>
          <Link href="/sign-up" className="hover:text-[var(--text-primary)] transition-colors">Sign Up</Link>
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
