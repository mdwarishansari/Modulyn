"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";

/**
 * components/shared/ErrorBoundary.tsx
 * React class ErrorBoundary with Modulyn-styled fallback UI.
 */

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
    this.props.onError?.(error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-6 p-8">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[var(--status-error-bg)]">
            <svg
              width="28" height="28" viewBox="0 0 24 24"
              fill="none" stroke="var(--status-error)" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="text-center max-w-sm">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
              Something went wrong
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              {this.state.error?.message ?? "An unexpected error occurred."}
            </p>
          </div>
          <Button variant="secondary" onClick={this.handleReset}>
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
