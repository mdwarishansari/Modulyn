import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — Modulyn",
  description: "Create your free Modulyn account to start participating in events.",
};

const clerkAppearance = {
  variables: {
    colorPrimary:         "var(--accent-500)",
    colorBackground:      "var(--bg-card)",
    colorInputBackground: "var(--bg-base)",
    colorInputText:       "var(--text-primary)",
    colorText:            "var(--text-primary)",
    colorTextSecondary:   "var(--text-muted)",
    colorDanger:          "var(--status-error)",
    borderRadius:         "var(--radius-md)",
    fontFamily:           "var(--font-sans)",
    fontSize:             "0.875rem",
  },
  elements: {
    rootBox:          "w-full",
    card:             "bg-[var(--bg-card)] border border-[var(--border-default)] shadow-[var(--shadow-lg)] rounded-[var(--radius-xl)] p-0",
    headerTitle:      "hidden",
    headerSubtitle:   "hidden",
    socialButtonsBlockButton: "border border-[var(--border-default)] bg-[var(--bg-subtle)] text-[var(--text-primary)]",
    formFieldInput:   "bg-[var(--bg-base)] border-[var(--border-default)] text-[var(--text-primary)]",
    formButtonPrimary:"bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white font-semibold",
    footerActionLink: "text-[var(--accent-500)] font-medium",
    dividerLine:      "bg-[var(--border-default)]",
    dividerText:      "text-[var(--text-muted)]",
  },
} as const;

export default function SignUpPage() {
  return (
    <div
      className="flex min-h-[calc(100dvh-64px)] items-center justify-center px-4 py-12"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% -10%, color-mix(in srgb, var(--accent-500) 10%, transparent), transparent)",
      }}
    >
      <div className="w-full max-w-[400px] flex flex-col items-center gap-6">
        {/* Page heading above Clerk card */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Create your account</h1>
          <p className="text-sm text-[var(--text-muted)]">Free forever. No credit card required.</p>
        </div>
        <SignUp
          appearance={clerkAppearance}
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
