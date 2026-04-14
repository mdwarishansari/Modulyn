"use client";

import * as React from "react";
import Image from "next/image";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = React.useState(false);

  // Close dropdown if clicked outside
  const menuRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoaded || !isSignedIn || !user) {
    return null;
  }

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
  };

  const primaryEmail = user.primaryEmailAddress?.emailAddress ?? "No email provided";
  const fullName = user.fullName ?? user.username ?? "Anonymous";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-full)] overflow-hidden border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-500)]"
      >
        <Image
          src={user.imageUrl}
          alt={fullName}
          width={40}
          height={40}
          className="object-cover"
        />
      </button>

      {isOpen && (
        <div className={cn(
          "absolute right-0 top-12 w-64 bg-[var(--bg-card)]",
          "border border-[var(--border-default)] shadow-[var(--shadow-lg)]",
          "rounded-[var(--radius-md)] overflow-hidden z-[var(--z-popover)]",
          "animate-in fade-in zoom-in-95 duration-100"
        )}>
          {/* Header */}
          <div className="px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]">
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {fullName}
            </p>
            <p className="text-xs text-[var(--text-muted)] truncate">
              {primaryEmail}
            </p>
          </div>

          {/* Body/Actions */}
          <div className="p-2 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              onClick={() => {
                setIsOpen(false);
                // Future profile navigation logic
              }}
            >
              Profile Options
            </Button>
            <Button
              variant="danger"
              className="w-full justify-start opacity-90"
              onClick={handleSignOut}
            >
              Log out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
