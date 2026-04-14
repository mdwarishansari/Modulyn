/**
 * client/lib/rbac.ts
 * Front-end role-based access control helpers.
 * Reads role from Clerk publicMetadata — set by backend on user sync.
 */

import type { UserRole } from "@/types";

export function getUserRole(user: any): UserRole {
  if (!user) return "PARTICIPANT";
  const role = user.publicMetadata?.role;
  if (role === "ADMIN" || role === "ORGANIZER" || role === "JUDGE") {
    return role as UserRole;
  }
  return "PARTICIPANT";
}

export function isAdmin(user: any): boolean {
  return getUserRole(user) === "ADMIN";
}

export function isJudge(user: any): boolean {
  const role = getUserRole(user);
  return role === "ADMIN" || role === "JUDGE";
}

export function canManageEvent(
  user: any
): boolean {
  return isAdmin(user);
}

export function canEvaluateSubmissions(
  user: any
): boolean {
  return isJudge(user);
}
