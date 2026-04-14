/**
 * shared/types/index.ts
 * Types shared between client and server.
 * Import from this file in both workspaces to keep contracts in sync.
 *
 * Usage (server): import type { EventState } from "../../shared/types";
 * Usage (client): import type { EventState } from "@shared/types";
 */

// ─── Lifecycle States ─────────────────────────────────────────────────────────

export type EventState =
  | "DRAFT"
  | "PUBLISHED"
  | "REGISTRATION_OPEN"
  | "REGISTRATION_CLOSED"
  | "LIVE"
  | "FINISHED"
  | "ARCHIVED";

export type ModuleState =
  | "INACTIVE"
  | "DRAFT"
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

export type EventVisibility = "PUBLIC" | "PRIVATE" | "INVITE_ONLY" | "CODE_PROTECTED";
export type ModuleMode      = "INDIVIDUAL" | "TEAM" | "HYBRID";
export type LocationType    = "ONLINE" | "OFFLINE" | "HYBRID";

// ─── Roles ────────────────────────────────────────────────────────────────────

export type OrgMemberRole   = "OWNER" | "ADMIN" | "MODERATOR" | "EDITOR" | "VIEWER";
export type EventMemberRole = "EVENT_OWNER" | "EVENT_ADMIN" | "MANAGER" | "JUDGE" | "VOLUNTEER" | "SUPPORT";

// ─── API Contract ─────────────────────────────────────────────────────────────

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

// ─── Domain DTOs (read-side, safe to expose to client) ───────────────────────

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  username: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface OrganizationDTO {
  id: string;
  name: string;
  slug: string;
  type: string;
  logoUrl: string | null;
  description: string | null;
  status: string;
  createdAt: string;
}

export interface EventDTO {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  bannerUrl: string | null;
  visibility: EventVisibility;
  state: EventState;
  locationType: LocationType;
  locationText: string | null;
  featured: boolean;
  startsAt: string | null;
  endsAt: string | null;
  registrationOpensAt: string | null;
  registrationClosesAt: string | null;
  organization: Pick<OrganizationDTO, "id" | "name" | "slug" | "logoUrl">;
  createdAt: string;
}

export interface ModuleDTO {
  id: string;
  eventId: string;
  title: string;
  slug: string;
  type: ModuleType;
  description: string;
  moduleMode: ModuleMode;
  state: ModuleState;
  visibility: EventVisibility;
  registrationRequired: boolean;
  maxParticipants: number | null;
  maxTeams: number | null;
  teamSizeMin: number | null;
  teamSizeMax: number | null;
  startsAt: string | null;
  endsAt: string | null;
  orderIndex: number;
  createdAt: string;
}
