/**
 * client/types/index.ts
 * All TypeScript types for the Modulyn frontend.
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

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  username: string | null;
  avatarUrl: string | null;
  role: "USER" | "ADMIN" | "JUDGE";
}

// ─── Organization ─────────────────────────────────────────────────────────────

export type OrgType = "CLUB" | "DEPARTMENT" | "COLLEGE" | "COMPANY" | "COMMUNITY";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  type: OrgType;
  logoUrl: string | null;
  description: string | null;
  website: string | null;
  createdAt: string;
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

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  bannerUrl: string | null;
  visibility: EventVisibility;
  state: EventState;
  startsAt: string | null;
  endsAt: string | null;
  registrationDeadline: string | null;
  maxParticipants: number | null;
  organization: Organization;
  organizationId: string;
  modules?: Module[];
  moduleCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Modules ──────────────────────────────────────────────────────────────────

export type ModuleType =
  | "QUIZ"
  | "CODING"
  | "HACKATHON"
  | "POSTER"
  | "UIUX"
  | "VOTING"
  | "PRESENTATION"
  | "CUSTOM";

export type ModuleMode = "INDIVIDUAL" | "TEAM";

export type ModuleState =
  | "INACTIVE"
  | "DRAFT"
  | "REGISTRATION_OPEN"
  | "REGISTRATION_CLOSED"
  | "LIVE"
  | "FINISHED"
  | "ARCHIVED";

export interface Module {
  id: string;
  title: string;
  description: string | null;
  type: ModuleType;
  mode: ModuleMode;
  state: ModuleState;
  eventId: string;
  event?: Pick<Event, "id" | "title" | "slug" | "organization">;
  maxTeamSize: number | null;
  registrationDeadline: string | null;
  submissionDeadline: string | null;
  rules: string | null;
  resultsPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Registrations ────────────────────────────────────────────────────────────

export interface RegistrationQuestion {
  id: string;
  question: string;
  required: boolean;
}

export interface Registration {
  id: string;
  moduleId: string;
  module?: Module;
  userId: string;
  teamId: string | null;
  team?: Team;
  answers: { questionId: string; answer: string }[];
  createdAt: string;
}

// ─── Teams ────────────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  name: string;
  avatarUrl: string | null;
  isLeader: boolean;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  moduleId: string;
  members: TeamMember[];
  maxSize: number;
  createdAt: string;
}

// ─── Submissions ──────────────────────────────────────────────────────────────

export type SubmissionStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "EVALUATED"
  | "DISQUALIFIED";

export interface HackathonPayload {
  githubUrl: string;
  fileUrl?: string;
  description?: string;
}

export interface CodingPayload {
  code: string;
  language: string;
}

export interface QuizPayload {
  answers: { questionId: string; answer: string }[];
}

export interface FilePayload {
  fileUrl: string;
  description?: string;
}

export type SubmissionPayload =
  | HackathonPayload
  | CodingPayload
  | QuizPayload
  | FilePayload;

export interface Submission {
  id: string;
  moduleId: string;
  module?: Pick<Module, "id" | "title" | "type">;
  userId: string;
  teamId: string | null;
  payload: SubmissionPayload;
  status: SubmissionStatus;
  score: number | null;
  feedback: string | null;
  submittedAt: string;
  evaluatedAt: string | null;
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  score: number;
  user: { id: string; name: string; avatarUrl: string | null };
  team?: { id: string; name: string };
  submittedAt: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType =
  | "REGISTRATION_CONFIRMED"
  | "MODULE_LIVE"
  | "MODULE_FINISHED"
  | "RESULTS_PUBLISHED"
  | "TEAM_INVITE"
  | "SUBMISSION_EVALUATED"
  | "GENERAL";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

// ─── UI ───────────────────────────────────────────────────────────────────────

export type Theme = "light" | "dark" | "system";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export type InputSize = "sm" | "md" | "lg";

export type UserRole = "USER" | "ADMIN" | "JUDGE" | "ORGANIZER" | "PARTICIPANT" | "GUEST";

// State-based CTA shape (used by lib/states.ts)
export interface StateCTA {
  label: string;
  variant: ButtonVariant;
  action: "register" | "participate" | "view-results" | "none";
  disabled?: boolean;
}
