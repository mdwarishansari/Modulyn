"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { InputSize } from "@/types";

/**
 * components/ui/Textarea.tsx
 * Multi-line text input matching the Input design system.
 */

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  inputSize?: InputSize;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, errorMessage, inputSize = "md", id, className, disabled, ...props }, ref) => {
    const areaId = id ?? React.useId();
    const hasError = Boolean(errorMessage);

    const sizeStyles: Record<InputSize, string> = {
      sm: "text-sm px-3 py-2 min-h-[80px]",
      md: "text-sm px-3 py-2.5 min-h-[100px]",
      lg: "text-base px-4 py-3 min-h-[120px]",
    };

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={areaId}
            className={cn("text-sm font-medium text-[var(--text-primary)]", disabled && "opacity-50")}
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={areaId}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${areaId}-error` : helperText ? `${areaId}-helper` : undefined
          }
          className={cn(
            "w-full rounded-[var(--radius-md)] border bg-[var(--bg-base)]",
            "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
            "transition-colors duration-150 resize-y",
            "border-[var(--border-default)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)]",
            "focus:ring-offset-1 focus:ring-offset-[var(--bg-base)]",
            "focus:border-[var(--accent-500)]",
            hasError && "border-[var(--status-error)] focus:ring-[var(--status-error)]",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--bg-subtle)] disabled:resize-none",
            sizeStyles[inputSize],
            className
          )}
          {...props}
        />

        {hasError && (
          <p id={`${areaId}-error`} role="alert" className="text-xs text-[var(--status-error)]">
            {errorMessage}
          </p>
        )}
        {!hasError && helperText && (
          <p id={`${areaId}-helper`} className="text-xs text-[var(--text-muted)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
