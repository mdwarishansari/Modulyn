import * as React from "react";
import { cn } from "@/lib/utils";
import type { ButtonVariant, ButtonSize } from "@/types";

/**
 * client/components/ui/Button.tsx
 * Base Button component. Supports all design system variants and sizes.
 * Compose with cn() for additional class overrides.
 */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-[var(--accent-500)] text-white",
    "hover:bg-[var(--accent-600)]",
    "active:bg-[var(--accent-700)]",
    "shadow-sm hover:shadow-md",
    "border border-transparent",
  ].join(" "),

  secondary: [
    "bg-[var(--bg-muted)] text-[var(--text-primary)]",
    "hover:bg-[var(--border-strong)]",
    "border border-[var(--border-default)]",
  ].join(" "),

  outline: [
    "bg-transparent text-[var(--accent-500)]",
    "border border-[var(--accent-500)]",
    "hover:bg-[var(--accent-50)] dark:hover:bg-[var(--accent-900)]/20",
  ].join(" "),

  ghost: [
    "bg-transparent text-[var(--text-secondary)]",
    "hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]",
    "border border-transparent",
  ].join(" "),

  danger: [
    "bg-[var(--status-error)] text-white",
    "hover:opacity-90 active:opacity-80",
    "border border-transparent",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5 rounded-[var(--radius-sm)]",
  md: "h-10 px-4 text-sm gap-2 rounded-[var(--radius-md)]",
  lg: "h-12 px-6 text-base gap-2.5 rounded-[var(--radius-lg)]",
};

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12" cy="12" r="10"
      stroke="currentColor" strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center font-medium",
          "transition-all duration-150 ease-in-out",
          "cursor-pointer select-none whitespace-nowrap",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[var(--accent-500)] focus-visible:ring-offset-2",
          "focus-visible:ring-offset-[var(--bg-base)]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Spinner />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {!isLoading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
