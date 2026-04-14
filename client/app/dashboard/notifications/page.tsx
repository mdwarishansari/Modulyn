"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { notifications, unreadCount, markRead } = useNotifications();

  const unread = notifications.filter((n) => !n.isRead);
  const read   = notifications.filter((n) =>  n.isRead);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
        actions={
          unreadCount > 0 ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => unread.forEach((n) => markRead(n.id))}
            >
              Mark all read
            </Button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="You'll see event updates, results, and team invites here."
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {unread.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Unread</h2>
              <div className="flex flex-col divide-y divide-[var(--border-subtle)] rounded-[var(--radius-lg)] border border-[var(--border-default)] overflow-hidden bg-[var(--bg-card)]">
                {unread.map((n) => (
                  <NotificationRow key={n.id} notification={n} onMarkRead={markRead} />
                ))}
              </div>
            </section>
          )}
          {read.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Read</h2>
              <div className="flex flex-col divide-y divide-[var(--border-subtle)] rounded-[var(--radius-lg)] border border-[var(--border-default)] overflow-hidden bg-[var(--bg-card)] opacity-70">
                {read.map((n) => (
                  <NotificationRow key={n.id} notification={n} onMarkRead={markRead} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationRow({ notification: n, onMarkRead }: { notification: { id: string; title: string; body: string; isRead: boolean; createdAt: string }; onMarkRead: (id: string) => void }) {
  return (
    <div
      className={cn("flex items-start gap-4 px-4 py-4 cursor-pointer transition-colors hover:bg-[var(--bg-subtle)]", !n.isRead && "bg-[var(--accent-50)]")}
      onClick={() => !n.isRead && onMarkRead(n.id)}
    >
      {!n.isRead && <span className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-[var(--accent-500)]" />}
      <div className={cn("flex-1 min-w-0", n.isRead && "pl-5")}>
        <p className="text-sm font-semibold text-[var(--text-primary)]">{n.title}</p>
        <p className="text-sm text-[var(--text-muted)] mt-0.5 leading-relaxed">{n.body}</p>
        <p className="text-xs text-[var(--text-disabled)] mt-1">
          {new Date(n.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}
