import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * client/components/ui/Card.tsx
 * Composable Card component with sub-components:
 *   <Card>
 *     <Card.Header>
 *       <Card.Title />
 *       <Card.Description />
 *     </Card.Header>
 *     <Card.Body />
 *     <Card.Footer />
 *   </Card>
 */

// ─── Root Card ───────────────────────────────────────────────────────────────

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;     // Enable hover lift effect
  bordered?: boolean;  // Show border
  noPadding?: boolean; // Remove default padding
}

function Card({
  hover = false,
  bordered = true,
  noPadding = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] bg-[var(--bg-card)]",
        "transition-all duration-200",
        bordered && "border border-[var(--border-default)]",
        hover && [
          "cursor-pointer",
          "hover:bg-[var(--bg-card-hover)]",
          "hover:border-[var(--border-strong)]",
          "hover:shadow-[var(--shadow-md)]",
          "hover:-translate-y-0.5",
        ],
        !noPadding && "p-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Card.Header ──────────────────────────────────────────────────────────────

function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1 mb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Card.Title ───────────────────────────────────────────────────────────────

function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-base font-semibold text-[var(--text-primary)] leading-snug tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

// ─── Card.Description ─────────────────────────────────────────────────────────

function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-[var(--text-secondary)] leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

// ─── Card.Body ────────────────────────────────────────────────────────────────

function CardBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

// ─── Card.Footer ──────────────────────────────────────────────────────────────

function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 mt-4 pt-4 border-t border-[var(--border-subtle)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Attach sub-components ────────────────────────────────────────────────────

Card.Header      = CardHeader;
Card.Title       = CardTitle;
Card.Description = CardDescription;
Card.Body        = CardBody;
Card.Footer      = CardFooter;

export { Card };
