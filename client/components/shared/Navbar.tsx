"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { AuthButtons } from "@/components/auth/AuthButtons";
import { UserMenu } from "@/components/auth/UserMenu";

/**
 * components/shared/Navbar.tsx
 * Full application navigation bar.
 * Sticky + backdrop blur. Mobile: hamburger → slide-down.
 */

const NAV_LINKS = [
  { href: "/",       label: "Home"   },
  { href: "/events", label: "Events" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium px-3 py-1.5 rounded-[var(--radius-md)] transition-colors duration-150",
        isActive
          ? "text-[var(--accent-500)] bg-[var(--accent-50)]"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
      )}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  const pathname = usePathname();
  React.useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-[var(--z-sticky)] w-full",
        "border-b border-[var(--border-subtle)]",
        "bg-[var(--bg-card)]/90 backdrop-blur-md",
        "transition-shadow duration-200",
        scrolled && "shadow-[var(--shadow-sm)]"
      )}
    >
      <div className="mx-auto max-w-[var(--container-xl)] px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Left: Logo */}
        <Logo size="sm" />

        {/* Center: Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map((l) => <NavLink key={l.href} {...l} />)}
        </nav>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {/* NotificationBell only for signed-in users */}
          <Show when="signed-in">
            <NotificationBell />
          </Show>

          {/* Auth */}
          <Show when="signed-out">
            <div className="hidden sm:flex">
              <AuthButtons />
            </div>
          </Show>
          <Show when="signed-in">
            <UserMenu />
          </Show>

          {/* Mobile hamburger */}
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
            className={cn(
              "sm:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5",
              "rounded-[var(--radius-md)] hover:bg-[var(--bg-subtle)]",
              "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-500)]"
            )}
          >
            <span className={cn("w-5 h-0.5 bg-current transition-all duration-200", mobileOpen && "rotate-45 translate-y-2")} />
            <span className={cn("w-5 h-0.5 bg-current transition-all duration-200", mobileOpen && "opacity-0")} />
            <span className={cn("w-5 h-0.5 bg-current transition-all duration-200", mobileOpen && "-rotate-45 -translate-y-2")} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3 flex flex-col gap-1 animate-in slide-in-from-top-2 duration-200">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium py-2.5 px-3 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          {/* Mobile auth */}
          <Show when="signed-out">
            <div className="pt-2 border-t border-[var(--border-subtle)] flex gap-2">
              <AuthButtons />
            </div>
          </Show>
        </div>
      )}
    </header>
  );
}
