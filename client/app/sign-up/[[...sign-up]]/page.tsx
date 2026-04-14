import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Modulyn account.",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100dvh-56px)] items-center justify-center p-4"
      style={{
        background: "radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in srgb, var(--accent-500) 8%, transparent), transparent)",
      }}
    >
      <div className="w-full flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">Get started</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Create your Modulyn account</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full max-w-sm",
              card: "bg-[var(--bg-card)] border border-[var(--border-default)] shadow-[var(--shadow-lg)] rounded-[var(--radius-xl)]",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            },
          }}
        />
      </div>
    </div>
  );
}
