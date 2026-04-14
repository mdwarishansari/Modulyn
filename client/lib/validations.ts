/**
 * client/lib/validations.ts
 * Zod schemas for all forms in Modulyn.
 * MUST mirror backend validators — update both when backend changes.
 */

import { z } from "zod";

// ─── Organization ─────────────────────────────────────────────────────────────

export const createOrgSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  slug: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  type: z.enum(["CLUB", "DEPARTMENT", "COLLEGE", "COMPANY", "COMMUNITY"]),
  description: z.string().max(500).optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

// ─── Events ───────────────────────────────────────────────────────────────────

export const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().max(2000).optional(),
  organizationId: z.string().min(1, "Organization is required"),
  visibility: z.enum(["PUBLIC", "PRIVATE", "INVITE_ONLY", "CODE_PROTECTED"]).default("PUBLIC"),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  registrationDeadline: z.string().optional(),
  maxParticipants: z.coerce.number().int().positive().optional(),
});

export const updateEventStateSchema = z.object({
  state: z.enum([
    "DRAFT",
    "PUBLISHED",
    "REGISTRATION_OPEN",
    "REGISTRATION_CLOSED",
    "LIVE",
    "FINISHED",
    "ARCHIVED",
  ]),
});

// ─── Modules ──────────────────────────────────────────────────────────────────

export const createModuleSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
  title: z.string().min(2, "Title is required").max(100),
  description: z.string().max(2000).optional(),
  type: z.enum(["QUIZ", "CODING", "HACKATHON", "POSTER", "UIUX", "VOTING", "PRESENTATION", "CUSTOM"]),
  mode: z.enum(["INDIVIDUAL", "TEAM"]).default("INDIVIDUAL"),
  maxTeamSize: z.coerce.number().int().min(2).max(10).optional(),
  registrationDeadline: z.string().optional(),
  submissionDeadline: z.string().optional(),
  rules: z.string().max(5000).optional(),
});

export const updateModuleStateSchema = z.object({
  state: z.enum([
    "INACTIVE",
    "DRAFT",
    "REGISTRATION_OPEN",
    "REGISTRATION_CLOSED",
    "LIVE",
    "FINISHED",
    "ARCHIVED",
  ]),
});

// ─── Registrations ────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  moduleId: z.string().min(1),
  questions: z
    .array(
      z.object({
        questionId: z.string(),
        answer: z.string().min(1, "Answer is required"),
      })
    )
    .optional()
    .default([]),
});

// ─── Teams ────────────────────────────────────────────────────────────────────

export const createTeamSchema = z.object({
  moduleId: z.string().min(1),
  name: z.string().min(2, "Team name must be at least 2 characters").max(50),
});

export const joinTeamSchema = z.object({
  code: z
    .string()
    .length(6, "Join code must be exactly 6 characters")
    .regex(/^[A-Z0-9]+$/, "Join code must be uppercase letters and numbers"),
});

// ─── Submissions ──────────────────────────────────────────────────────────────

const hackathonPayloadSchema = z.object({
  githubUrl: z.string().url("Must be a valid GitHub URL").min(1, "GitHub URL is required"),
  fileUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().max(1000).optional(),
});

const codingPayloadSchema = z.object({
  code: z.string().min(1, "Code is required"),
  language: z.string().min(1, "Language is required"),
});

const quizPayloadSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string(),
        answer: z.string(),
      })
    )
    .min(1, "At least one answer is required"),
});

const filePayloadSchema = z.object({
  fileUrl: z.string().url("Must be a valid file URL").min(1, "File is required"),
  description: z.string().max(1000).optional(),
});

export const submissionSchemas = {
  HACKATHON:    hackathonPayloadSchema,
  CODING:       codingPayloadSchema,
  QUIZ:         quizPayloadSchema,
  POSTER:       filePayloadSchema,
  UIUX:         filePayloadSchema,
  PRESENTATION: filePayloadSchema,
  VOTING:       filePayloadSchema,
  CUSTOM:       filePayloadSchema,
} as const;

export const createSubmissionSchema = z.object({
  moduleId: z.string().min(1),
  payload: z.record(z.string(), z.unknown()),
});

// ─── Evaluation ───────────────────────────────────────────────────────────────

export const evaluateSubmissionSchema = z.object({
  score: z.coerce
    .number()
    .min(0, "Score must be at least 0")
    .max(100, "Score cannot exceed 100"),
  feedback: z.string().max(2000).optional(),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type CreateEventInput        = z.infer<typeof createEventSchema>;
export type CreateModuleInput       = z.infer<typeof createModuleSchema>;
export type RegisterInput           = z.infer<typeof registerSchema>;
export type CreateTeamInput         = z.infer<typeof createTeamSchema>;
export type JoinTeamInput           = z.infer<typeof joinTeamSchema>;
export type CreateSubmissionInput   = z.infer<typeof createSubmissionSchema>;
export type EvaluateSubmissionInput = z.infer<typeof evaluateSubmissionSchema>;
