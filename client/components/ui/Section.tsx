import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * components/ui/Section.tsx
 * Vertical spacing wrapper for page sections.
 * Provides consistent top/bottom padding so every section breathes the same way.
 *
 * Usage:
 *   <Section>
 *     <Container>...</Container>
 *   </Section>
 *
 *   <Section as="header" spacing="sm">...</Section>
 */

type SectionSpacing = "none" | "xs" | "sm" | "md" | "lg" | "xl";
type SectionElement = "section" | "div" | "header" | "footer" | "main" | "article" | "aside";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: SectionElement;
  spacing?: SectionSpacing;
}

const spacingClasses: Record<SectionSpacing, string> = {
  none: "",
  xs:   "py-4",
  sm:   "py-8",
  md:   "py-12",
  lg:   "py-16",
  xl:   "py-24",
};

export function Section({
  as: Tag = "section",
  spacing = "lg",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(spacingClasses[spacing], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
