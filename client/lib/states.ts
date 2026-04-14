/**
 * client/lib/states.ts
 * Centralized state → UI mapping system.
 * NEVER duplicate this logic in components — always import from here.
 */

import type {
  EventState,
  ModuleState,
  SubmissionStatus,
  StateCTA,
  ButtonVariant,
} from "@/types";

// ─── Color tokens (maps to CSS vars in globals.css) ──────────────────────────

export const EVENT_STATE_META: Record<
  EventState,
  { label: string; colorVar: string; description: string }
> = {
  DRAFT:               { label: "Draft",              colorVar: "var(--state-draft)",      description: "Not yet visible to the public"      },
  PUBLISHED:           { label: "Published",          colorVar: "var(--state-published)",  description: "Visible but registration not open"   },
  REGISTRATION_OPEN:   { label: "Registration Open",  colorVar: "var(--state-reg-open)",   description: "Accepting new registrations"         },
  REGISTRATION_CLOSED: { label: "Reg. Closed",        colorVar: "var(--state-reg-closed)", description: "Registration window has ended"       },
  LIVE:                { label: "Live",               colorVar: "var(--state-live)",       description: "Event is currently running"          },
  FINISHED:            { label: "Finished",           colorVar: "var(--state-finished)",   description: "Event has ended"                     },
  ARCHIVED:            { label: "Archived",           colorVar: "var(--state-archived)",   description: "Event archived from public view"     },
};

export const MODULE_STATE_META: Record<
  ModuleState,
  { label: string; colorVar: string; description: string }
> = {
  INACTIVE:            { label: "Inactive",           colorVar: "var(--state-inactive)",   description: "Module not yet activated"            },
  DRAFT:               { label: "Draft",              colorVar: "var(--state-draft)",      description: "Module in setup"                     },
  REGISTRATION_OPEN:   { label: "Registration Open",  colorVar: "var(--state-reg-open)",   description: "Accepting registrations"             },
  REGISTRATION_CLOSED: { label: "Reg. Closed",        colorVar: "var(--state-reg-closed)", description: "Registration closed"                 },
  LIVE:                { label: "Live",               colorVar: "var(--state-live)",       description: "Submissions are open"                },
  FINISHED:            { label: "Finished",           colorVar: "var(--state-finished)",   description: "Submissions closed"                  },
  ARCHIVED:            { label: "Archived",           colorVar: "var(--state-archived)",   description: "Module archived"                     },
};

// ─── CTA Logic ───────────────────────────────────────────────────────────────

/**
 * Returns the primary CTA for an event based on its state.
 */
export function getEventCTA(state: EventState): StateCTA {
  switch (state) {
    case "REGISTRATION_OPEN":
      return { label: "Register Now", variant: "primary", action: "register" };
    case "LIVE":
      return { label: "View Event", variant: "primary", action: "participate" };
    case "FINISHED":
      return { label: "View Results", variant: "outline", action: "view-results" };
    case "PUBLISHED":
      return { label: "View Event", variant: "secondary", action: "participate" };
    default:
      return { label: "View", variant: "ghost", action: "none", disabled: true };
  }
}

/**
 * Returns CTAs available for a module based on its state + user registration status.
 */
export function getModuleActions(
  state: ModuleState,
  isRegistered: boolean
): StateCTA[] {
  switch (state) {
    case "REGISTRATION_OPEN":
      if (isRegistered) {
        return [{ label: "Registered ✓", variant: "secondary", action: "none", disabled: true }];
      }
      return [{ label: "Register", variant: "primary", action: "register" }];

    case "REGISTRATION_CLOSED":
      if (isRegistered) {
        return [{ label: "Registered ✓", variant: "secondary", action: "none", disabled: true }];
      }
      return [{ label: "Registration Closed", variant: "ghost", action: "none", disabled: true }];

    case "LIVE":
      if (isRegistered) {
        return [{ label: "Participate →", variant: "primary", action: "participate" }];
      }
      return [{ label: "View Module", variant: "ghost", action: "participate" }];

    case "FINISHED":
      return [{ label: "View Results", variant: "outline", action: "view-results" }];

    default:
      return [{ label: "View", variant: "ghost", action: "none", disabled: true }];
  }
}

/**
 * Returns UI info for a submission status.
 */
export function getSubmissionUI(status: SubmissionStatus): {
  label: string;
  colorVar: string;
  variant: ButtonVariant;
} {
  switch (status) {
    case "SUBMITTED":
      return { label: "Submitted",      colorVar: "var(--status-info)",    variant: "secondary" };
    case "UNDER_REVIEW":
      return { label: "Under Review",   colorVar: "var(--status-warning)", variant: "secondary" };
    case "EVALUATED":
      return { label: "Evaluated",      colorVar: "var(--status-success)", variant: "primary"   };
    case "DISQUALIFIED":
      return { label: "Disqualified",   colorVar: "var(--status-error)",   variant: "danger"    };
  }
}

// ─── Admin state transition helpers ──────────────────────────────────────────

/** Valid next states for an event from its current state. */
export const EVENT_STATE_TRANSITIONS: Record<EventState, EventState[]> = {
  DRAFT:               ["PUBLISHED"],
  PUBLISHED:           ["REGISTRATION_OPEN", "DRAFT"],
  REGISTRATION_OPEN:   ["REGISTRATION_CLOSED", "LIVE"],
  REGISTRATION_CLOSED: ["LIVE"],
  LIVE:                ["FINISHED"],
  FINISHED:            ["ARCHIVED"],
  ARCHIVED:            [],
};

/** Valid next states for a module from its current state. */
export const MODULE_STATE_TRANSITIONS: Record<ModuleState, ModuleState[]> = {
  INACTIVE:            ["DRAFT"],
  DRAFT:               ["REGISTRATION_OPEN"],
  REGISTRATION_OPEN:   ["REGISTRATION_CLOSED", "LIVE"],
  REGISTRATION_CLOSED: ["LIVE"],
  LIVE:                ["FINISHED"],
  FINISHED:            ["ARCHIVED"],
  ARCHIVED:            [],
};
