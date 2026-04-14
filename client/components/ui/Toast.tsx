"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * components/ui/Toast.tsx + ToastProvider.tsx
 * Toast notification system with context + portal.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: {
    success: (title: string, description?: string) => void;
    error:   (title: string, description?: string) => void;
    warning: (title: string, description?: string) => void;
    info:    (title: string, description?: string) => void;
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// ─── Single Toast ─────────────────────────────────────────────────────────────

const variantConfig: Record<ToastVariant, { icon: string; colorVar: string; bgVar: string }> = {
  success: { icon: "✓", colorVar: "var(--status-success)", bgVar: "var(--status-success-bg)" },
  error:   { icon: "✕", colorVar: "var(--status-error)",   bgVar: "var(--status-error-bg)"   },
  warning: { icon: "⚠", colorVar: "var(--status-warning)", bgVar: "var(--status-warning-bg)" },
  info:    { icon: "i", colorVar: "var(--status-info)",    bgVar: "var(--status-info-bg)"    },
};

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const cfg = variantConfig[item.variant];

  React.useEffect(() => {
    const timer = setTimeout(() => onDismiss(item.id), item.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [item.id, item.duration, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{ borderColor: `color-mix(in srgb, ${cfg.colorVar} 30%, transparent)` }}
      className={cn(
        "flex items-start gap-3 w-full max-w-sm px-4 py-3",
        "bg-[var(--bg-card)] border rounded-[var(--radius-lg)]",
        "shadow-[var(--shadow-lg)] pointer-events-auto",
        "animate-in slide-in-from-right-4 fade-in duration-300"
      )}
    >
      {/* Icon */}
      <span
        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold mt-0.5"
        style={{ color: cfg.colorVar, backgroundColor: cfg.bgVar }}
      >
        {cfg.icon}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug">{item.title}</p>
        {item.description && (
          <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">{item.description}</p>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={() => onDismiss(item.id)}
        aria-label="Dismiss"
        className="shrink-0 w-5 h-5 flex items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = React.useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev.slice(-4), { id, variant, title, description }]);
    },
    []
  );

  const toast = React.useMemo(
    () => ({
      success: (t: string, d?: string) => add("success", t, d),
      error:   (t: string, d?: string) => add("error",   t, d),
      warning: (t: string, d?: string) => add("warning", t, d),
      info:    (t: string, d?: string) => add("info",    t, d),
    }),
    [add]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Portal target — bottom-right stack */}
      <div
        aria-label="Notifications"
        className="fixed bottom-4 right-4 flex flex-col gap-2 pointer-events-none"
        style={{ zIndex: "var(--z-toast)" }}
      >
        {toasts.map((t) => (
          <Toast key={t.id} item={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
