import * as React from "react";
import { cn } from "@/lib/utils";
import type { InputSize } from "@/types";

/**
 * client/components/ui/Input.tsx
 * Base Input component with label, helper text, and error state.
 * Fully accessible — label is always linked via htmlFor/id.
 */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  inputSize?: InputSize;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const sizeStyles: Record<InputSize, string> = {
  sm: "h-8 text-sm px-3",
  md: "h-10 text-sm px-3",
  lg: "h-12 text-base px-4",
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      inputSize = "md",
      leftElement,
      rightElement,
      id,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    // Generate a stable id if none provided
    const inputId = id ?? React.useId();
    const hasError = Boolean(errorMessage);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium text-[var(--text-primary)]",
              disabled && "opacity-50"
            )}
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative flex items-center">
          {leftElement && (
            <span className="absolute left-3 flex items-center text-[var(--text-muted)] pointer-events-none">
              {leftElement}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            className={cn(
              // Base
              "w-full rounded-[var(--radius-md)] border bg-[var(--bg-base)]",
              "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
              "transition-colors duration-150",

              // Default border
              "border-[var(--border-default)]",

              // Focus
              "focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)]",
              "focus:ring-offset-1 focus:ring-offset-[var(--bg-base)]",
              "focus:border-[var(--accent-500)]",

              // Error
              hasError && "border-[var(--status-error)] focus:ring-[var(--status-error)]",

              // Disabled
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--bg-subtle)]",

              // Padding adjustments for icons
              leftElement && "pl-9",
              rightElement && "pr-9",

              sizeStyles[inputSize],
              className
            )}
            {...props}
          />

          {rightElement && (
            <span className="absolute right-3 flex items-center text-[var(--text-muted)]">
              {rightElement}
            </span>
          )}
        </div>

        {/* Error message */}
        {hasError && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-[var(--status-error)] flex items-center gap-1"
          >
            {errorMessage}
          </p>
        )}

        {/* Helper text */}
        {!hasError && helperText && (
          <p
            id={`${inputId}-helper`}
            className="text-xs text-[var(--text-muted)]"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
