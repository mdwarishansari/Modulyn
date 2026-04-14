/**
 * client/types/index.ts
 * Shared frontend TypeScript types.
 * Domain-specific types live in their own files (e.g. types/event.ts, types/user.ts).
 */

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  username: string | null;
  avatarUrl: string | null;
}

// ─── Events ───────────────────────────────────────────────────────────────────

export type EventVisibility = "PUBLIC" | "PRIVATE" | "INVITE_ONLY" | "CODE_PROTECTED";

export type EventState =
  | "DRAFT"
  | "PUBLISHED"
  | "REGISTRATION_OPEN"
  | "REGISTRATION_CLOSED"
  | "LIVE"
  | "FINISHED"
  | "ARCHIVED";

export type ModuleType =
  | "QUIZ"
  | "CODING"
  | "HACKATHON"
  | "POSTER"
  | "UIUX"
  | "VOTING"
  | "PRESENTATION"
  | "CUSTOM";

export type ModuleState =
  | "INACTIVE"
  | "DRAFT"
  | "REGISTRATION_OPEN"
  | "REGISTRATION_CLOSED"
  | "LIVE"
  | "FINISHED"
  | "ARCHIVED";

// ─── UI ───────────────────────────────────────────────────────────────────────

export type Theme = "light" | "dark" | "system";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export type InputSize = "sm" | "md" | "lg";
