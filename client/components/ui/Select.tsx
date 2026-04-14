"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { InputSize } from "@/types";

/**
 * components/ui/Select.tsx
 * Styled native <select> matching the Input design system.
 */

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  inputSize?: InputSize;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, helperText, errorMessage, inputSize = "md", options, placeholder, id, className, disabled, ...props },
    ref
  ) => {
    const selectId = id ?? React.useId();
    const hasError = Boolean(errorMessage);

    const sizeStyles: Record<InputSize, string> = {
      sm: "h-8 text-sm px-3 pr-9",
      md: "h-10 text-sm px-3 pr-9",
      lg: "h-12 text-base px-4 pr-10",
    };

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className={cn("text-sm font-medium text-[var(--text-primary)]", disabled && "opacity-50")}
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={hasError}
            className={cn(
              "w-full appearance-none rounded-[var(--radius-md)] border bg-[var(--bg-base)]",
              "text-[var(--text-primary)] transition-colors duration-150",
              "border-[var(--border-default)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)]",
              "focus:ring-offset-1 focus:ring-offset-[var(--bg-base)]",
              "focus:border-[var(--accent-500)]",
              hasError && "border-[var(--status-error)] focus:ring-[var(--status-error)]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--bg-subtle)]",
              sizeStyles[inputSize],
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Chevron icon */}
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </div>

        {hasError && (
          <p role="alert" className="text-xs text-[var(--status-error)]">{errorMessage}</p>
        )}
        {!hasError && helperText && (
          <p className="text-xs text-[var(--text-muted)]">{helperText}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
