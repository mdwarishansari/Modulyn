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
 * components/shared/Navbar.tsx — Fixed layout, h-16, backdrop blur, mobile hamburger
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
        "text-sm px-3 py-1.5 rounded-[var(--radius-md)] transition-all duration-200 font-medium",
        isActive
          ? "text-[var(--accent-500)]"
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
  const pathname = usePathname();

  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  React.useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-[var(--z-sticky)] w-full",
        "border-b border-[var(--border-subtle)]",
        "bg-[var(--bg-card)]/92 backdrop-blur-md",
        "transition-all duration-200",
        scrolled && "shadow-[var(--shadow-sm)]"
      )}
    >
      {/* Main bar — h-16, consistent container */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">

        {/* Left: Logo */}
        <Logo size="sm" />

        {/* Center: Desktop nav links */}
        <nav className="hidden sm:flex items-center gap-0.5" aria-label="Primary navigation">
          {NAV_LINKS.map((l) => <NavLink key={l.href} {...l} />)}
        </nav>

        {/* Right: theme + bell + auth + hamburger */}
        <div className="flex items-center gap-1.5">
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-[var(--accent-500)] hover:text-[var(--accent-600)] hidden sm:flex px-2 py-1.5 transition-colors"
            >
              Dashboard
            </Link>
          </Show>

          <ThemeToggle />

          <Show when="signed-in">
            <NotificationBell />
            <UserMenu />
          </Show>

          <Show when="signed-out">
            <div className="hidden sm:flex items-center gap-2">
              <AuthButtons />
            </div>
          </Show>

          {/* Mobile hamburger */}
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
            className={cn(
              "sm:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px]",
              "rounded-[var(--radius-md)] text-[var(--text-secondary)]",
              "hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]",
              "transition-colors duration-150 focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-[var(--accent-500)]"
            )}
          >
            <span className={cn("w-[18px] h-0.5 bg-current rounded-full transition-all duration-200", mobileOpen && "rotate-45 translate-y-[7px]")} />
            <span className={cn("w-[18px] h-0.5 bg-current rounded-full transition-all duration-200", mobileOpen && "opacity-0 scale-x-0")} />
            <span className={cn("w-[18px] h-0.5 bg-current rounded-full transition-all duration-200", mobileOpen && "-rotate-45 -translate-y-[7px]")} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
        className={cn(
          "sm:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-card)]",
          "overflow-hidden transition-all duration-200 ease-out",
          mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium py-2.5 px-3 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors duration-150"
            >
              {l.label}
            </Link>
          ))}
          <Show when="signed-out">
            <div className="pt-2 mt-1 border-t border-[var(--border-subtle)] flex flex-col gap-2">
              <AuthButtons />
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
}
