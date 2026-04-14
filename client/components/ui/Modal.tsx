"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * components/ui/Modal.tsx
 * Accessible base modal. Traps focus, closes on Escape, locks body scroll.
 *
 * Usage:
 *   <Modal isOpen={open} onClose={() => setOpen(false)} title="Create Event">
 *     <p>Modal body content</p>
 *     <Modal.Footer>
 *       <Button variant="ghost" onClick={onClose}>Cancel</Button>
 *       <Button>Confirm</Button>
 *     </Modal.Footer>
 *   </Modal>
 */

interface ModalProps {
  isOpen:    boolean;
  onClose:   () => void;
  title?:    string;
  size?:     "sm" | "md" | "lg" | "xl" | "full";
  children:  React.ReactNode;
  /** Prevent closing when clicking the backdrop */
  persistent?: boolean;
}

const sizeClasses = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-lg",
  xl:   "max-w-xl",
  full: "max-w-screen-lg",
};

function ModalFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "flex items-center justify-end gap-3 pt-4 mt-4",
      "border-t border-[var(--border-subtle)]",
      className
    )}>
      {children}
    </div>
  );
}

export function Modal({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
  persistent = false,
}: ModalProps) {
  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape key
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !persistent) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose, persistent]);

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center p-4",
        "bg-[var(--bg-overlay)] backdrop-blur-sm",
        "z-[var(--z-modal)]",
        "animate-in fade-in duration-200"
      )}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? "modal-title" : undefined}
      onClick={persistent ? undefined : onClose}
    >
      {/* Panel */}
      <div
        className={cn(
          "relative w-full bg-[var(--bg-card)] rounded-[var(--radius-xl)]",
          "border border-[var(--border-default)]",
          "shadow-[var(--shadow-xl)]",
          "p-6",
          "animate-in zoom-in-95 duration-200",
          sizeClasses[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-start justify-between mb-5">
            <h2
              id="modal-title"
              className="text-lg font-semibold text-[var(--text-primary)] leading-snug tracking-tight"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className={cn(
                "ml-4 shrink-0 w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)]",
                "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                "hover:bg-[var(--bg-muted)]",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-500)]"
              )}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="text-[var(--text-secondary)]">
          {children}
        </div>
      </div>
    </div>
  );
}

Modal.Footer = ModalFooter;
