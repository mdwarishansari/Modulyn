"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Loader } from "@/components/ui/Loader";

/**
 * Higher Order Component to enforce strict client-side routing protection.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[var(--bg-base)]">
        <Loader size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
