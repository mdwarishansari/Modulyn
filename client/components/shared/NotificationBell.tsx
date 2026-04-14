"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";

/**
 * components/shared/NotificationBell.tsx
 * Shows unread count badge and a popover list of notifications.
 */

export function NotificationBell() {
  const { notifications, unreadCount, markRead } = useNotifications();
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        className={cn(
          "relative w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)]",
          "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]",
          "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-500)]"
        )}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full text-[10px] font-bold bg-[var(--status-error)] text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={cn(
          "absolute right-0 top-11 w-80 max-h-96 overflow-y-auto",
          "bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[var(--radius-lg)]",
          "shadow-[var(--shadow-xl)] z-[var(--z-popover)]",
          "animate-in fade-in zoom-in-95 duration-150"
        )}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-[var(--text-muted)]">{unreadCount} unread</span>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="py-10 text-center text-sm text-[var(--text-muted)]">No notifications yet</div>
          ) : (
            <ul>
              {notifications.slice(0, 10).map((n) => (
                <li
                  key={n.id}
                  onClick={() => !n.isRead && markRead(n.id)}
                  className={cn(
                    "px-4 py-3 border-b border-[var(--border-subtle)] last:border-0 cursor-pointer",
                    "transition-colors duration-100",
                    !n.isRead
                      ? "bg-[var(--accent-50)] hover:bg-[var(--accent-100)]"
                      : "hover:bg-[var(--bg-subtle)]"
                  )}
                >
                  <div className="flex items-start gap-2">
                    {!n.isRead && (
                      <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--accent-500)]" />
                    )}
                    <div className={cn(!n.isRead ? "" : "pl-3.5")}>
                      <p className="text-xs font-semibold text-[var(--text-primary)] leading-snug">{n.title}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">{n.body}</p>
                      <p className="text-[10px] text-[var(--text-disabled)] mt-1">
                        {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
