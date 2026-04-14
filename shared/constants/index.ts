/**
 * shared/constants/index.ts
 * Constants shared across client and server.
 * Keep this file pure — no imports from Node or browser APIs.
 */

// ─── Event Lifecycle ──────────────────────────────────────────────────────────

/**
 * Valid state transitions for an event.
 * Key = current state, Value = allowed next states.
 */
export const EVENT_STATE_TRANSITIONS: Record<string, string[]> = {
  DRAFT:               ["PUBLISHED"],
  PUBLISHED:           ["REGISTRATION_OPEN", "DRAFT"],
  REGISTRATION_OPEN:   ["REGISTRATION_CLOSED"],
  REGISTRATION_CLOSED: ["LIVE", "REGISTRATION_OPEN"],
  LIVE:                ["FINISHED"],
  FINISHED:            ["ARCHIVED"],
  ARCHIVED:            [],
};

/**
 * Valid state transitions for a module.
 */
export const MODULE_STATE_TRANSITIONS: Record<string, string[]> = {
  INACTIVE:            ["DRAFT"],
  DRAFT:               ["REGISTRATION_OPEN"],
  REGISTRATION_OPEN:   ["REGISTRATION_CLOSED"],
  REGISTRATION_CLOSED: ["LIVE", "REGISTRATION_OPEN"],
  LIVE:                ["FINISHED"],
  FINISHED:            ["ARCHIVED"],
  ARCHIVED:            [],
};

// ─── Module Types ─────────────────────────────────────────────────────────────

export const MODULE_TYPE_LABELS: Record<string, string> = {
  QUIZ:         "Quiz",
  CODING:       "Fast Coding",
  HACKATHON:    "Hackathon",
  POSTER:       "Poster Competition",
  UIUX:         "UI/UX Contest",
  VOTING:       "Voting Event",
  PRESENTATION: "Presentation",
  CUSTOM:       "Custom",
};

// ─── Limits ───────────────────────────────────────────────────────────────────

export const LIMITS = {
  event: {
    titleMaxLength:       100,
    descriptionMaxLength: 5000,
    slugMaxLength:        60,
    maxModulesPerEvent:   20,
  },
  module: {
    titleMaxLength:       100,
    descriptionMaxLength: 2000,
    maxTeamSize:          20,
    minTeamSize:          1,
  },
  user: {
    nameMaxLength:     100,
    usernameMaxLength: 30,
    usernameMinLength: 3,
  },
  pagination: {
    defaultPage:  1,
    defaultLimit: 12,
    maxLimit:     100,
  },
} as const;

// ─── Access ───────────────────────────────────────────────────────────────────

export const VISIBILITY_LABELS: Record<string, string> = {
  PUBLIC:         "Public",
  PRIVATE:        "Private",
  INVITE_ONLY:    "Invite Only",
  CODE_PROTECTED: "Code Protected",
};

// ─── API ──────────────────────────────────────────────────────────────────────

export const API_VERSION = "v1";
export const API_PREFIX  = `/api/${API_VERSION}`;
