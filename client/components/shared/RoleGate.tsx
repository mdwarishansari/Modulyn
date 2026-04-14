"use client";

import { useUser } from "@clerk/nextjs";
import { isAdmin, isJudge } from "@/lib/rbac";
import type { UserRole } from "@/types";

/**
 * components/shared/RoleGate.tsx
 * Renders children only if the current user has the required role.
 */

interface RoleGateProps {
  role: UserRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGate({ role, children, fallback = null }: RoleGateProps) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const allowed =
    role === "ADMIN"  ? isAdmin(user) :
    role === "JUDGE"  ? isJudge(user) :
    role === "USER"   ? Boolean(user) :
    true; // GUEST — always allowed

  return allowed ? <>{children}</> : <>{fallback}</>;
}
