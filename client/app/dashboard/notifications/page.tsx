"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { PageHeader } from "@/components/shared/PageHeader";
import { FetchError } from "@/components/ui/FetchError";
import { EmptyState } from "@/components/shared/EmptyState";
import { Loader } from "@/components/ui/Loader";
import { Button } from "@/components/ui/Button";

export default function NotificationsPage() {
  const { notifications, unreadCount, markRead } = useNotifications();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Notifications" 
        description="Updates, scores, and event announcements."
      />
      {notifications.length === 0 ? (
        <EmptyState
          title="All caught up"
          description="You don't have any notifications right now."
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
        />
      ) : (
        <div className="flex flex-col divide-y divide-[var(--border-subtle)] rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              className={["px-5 py-4 transition-colors", !n.isRead ? "bg-[var(--bg-muted)]" : "bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)]"].join(" ")}
            >
              <div className="flex gap-4">
                <div className="shrink-0 pt-1">
                  {/* Status Indicator Dot */}
                  <div className={["w-2 h-2 rounded-full", !n.isRead ? "bg-[var(--accent-500)]" : "bg-[var(--border-strong)]"].join(" ")} />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <p className={["text-sm", !n.isRead ? "font-semibold text-[var(--text-primary)]" : "font-medium text-[var(--text-secondary)]"].join(" ")}>
                    {n.title}
                  </p>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {n.body}
                  </p>
                  <p className="text-xs text-[var(--text-disabled)] mt-1">
                    {new Date(n.createdAt).toLocaleString("en-IN", {
                      day: "numeric", month: "short", hour: "numeric", minute: "numeric"
                    })}
                  </p>
                  {!n.isRead && (
                    <button onClick={() => markRead(n.id)} className="text-xs text-[var(--accent-500)] hover:underline mt-2 self-start">
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
