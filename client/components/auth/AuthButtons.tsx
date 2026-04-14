"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";

export function AuthButtons() {
  const { isLoaded, isSignedIn } = useAuth();
  const { openSignIn, openSignUp } = useClerk();

  if (!isLoaded || isSignedIn) {
    return null; // Handle loading or already signed-in state cleanly
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        onClick={() => openSignIn()}
        className="font-semibold text-[var(--text-secondary)]"
      >
        Log in
      </Button>
      <Button
        variant="primary"
        onClick={() => openSignUp()}
        className="font-semibold"
      >
        Sign up
      </Button>
    </div>
  );
}
