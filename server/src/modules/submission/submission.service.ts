/**
 * server/src/modules/submission/submission.service.ts
 * Core submission orchestration — delegates payload processing to ModuleHandlers.
 */

import prisma from "@lib/prisma";
import { resolveHandler } from "@lib/module-engine/resolver";
import { ModuleState } from "@prisma/client";
import { eventBus, DomainEvent } from "@lib/event-bus/eventBus";
import { auditService } from "@modules/audit/audit.service";

export class SubmissionService {
  /**
   * Creates a submission for a module, enforcing:
   * 1) Module must be LIVE
   * 2) User must be registered
   * 3) No duplicate submissions (raises P2002 which controller catches)
   * 4) Delegates payload validation + normalization to the ModuleHandler
   */
  async createSubmission(
    moduleId: string,
    userId: string,
    payload: Record<string, unknown>,
    teamId?: string
  ) {
    const mod = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { event: true },
    });

    if (!mod) throw new Error("Module not found");

    // Lifecycle gate — must be LIVE
    if (mod.state !== ModuleState.LIVE) {
      throw new Error(
        `Submissions are not accepted. Module state is '${mod.state}'. Must be LIVE.`
      );
    }

    // Event must also not be finished/archived
    if (["FINISHED", "ARCHIVED"].includes(mod.event.state)) {
      throw new Error(`Event is '${mod.event.state}'. Submissions are closed.`);
    }

    // Registration gate — user must be registered for this module
    const registration = await prisma.registration.findFirst({
      where: {
        moduleId,
        OR: [{ userId }, { team: { members: { some: { userId } } } }],
        status: "CONFIRMED",
      },
    });

    if (!registration) {
      throw new Error("You must be a confirmed registrant to submit to this module.");
    }

    // Resolve handler and delegate the actual submission logic
    const handler = resolveHandler(mod.type);

    if (!handler.submit) {
      throw new Error(`Module type '${mod.type}' does not support submissions`);
    }

    const result = await handler.submit(moduleId, userId, payload);

    // Persist the normalized submission
    const newSubmission = await prisma.submission.create({
      data: {
        moduleId,
        userId: teamId ? null : userId,
        teamId: teamId ?? null,
        contentJsonb: result.contentJsonb as object,
        score: result.score ?? null,
        status: (result.status === "auto-evaluated" ? "EVALUATED" : "SUBMITTED") as any,
        evaluatedAt: result.status === "auto-evaluated" ? new Date() : null,
      },
    });

    eventBus.emitEvent(DomainEvent.SUBMISSION_CREATED, { moduleId, submissionId: newSubmission.id });
    
    if (newSubmission.status === "EVALUATED") {
      eventBus.emitEvent(DomainEvent.LEADERBOARD_UPDATED, { moduleId });
    }

    return newSubmission;
  }

  /**
   * Lists submissions for a module — admin/judge view.
   */
  async getSubmissionsForModule(moduleId: string) {
    return prisma.submission.findMany({
      where: { moduleId },
      orderBy: { submittedAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        team: { select: { id: true, name: true } },
      },
    });
  }

  /**
   * Gets a single user submission for a module.
   */
  async getUserSubmission(moduleId: string, userId: string) {
    return prisma.submission.findFirst({
      where: { moduleId, userId },
    });
  }

  /**
   * Triggers evaluate() hook on a specific submission.
   * Used by judges/admins post-LIVE.
   */
  async evaluateSubmission(submissionId: string, evaluatorId: string) {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { module: true },
    });

    if (!submission) throw new Error("Submission not found");

    if (submission.module.resultPublished) {
       throw new Error("Module results are published. Evaluation is locked.");
    }

    if (submission.status === "EVALUATED") {
       throw new Error("Submission is already evaluated. Re-evaluation must be explicitly reset first.");
    }

    // Move to UNDER_REVIEW automatically before calling evaluate hook (optional, depending on architecture, but good for tracking)
    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: "UNDER_REVIEW" }
    });

    const handler = resolveHandler(submission.module.type);

    if (!handler.evaluate) {
      throw new Error(`Module type '${submission.module.type}' does not support manual evaluation`);
    }

    const result = await handler.evaluate(submissionId);

    const updatedSub = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        score: result.score,
        feedback: result.feedback ?? null,
        status: "EVALUATED",
        evaluatorId: evaluatorId,
        evaluatedAt: new Date(),
      },
    });

    eventBus.emitEvent(DomainEvent.LEADERBOARD_UPDATED, { moduleId: submission.module.id });
    await auditService.log("EVALUATE_SUBMISSION", evaluatorId, submission.module.id, { submissionId, newScore: result.score });

    return updatedSub;
  }
}

export const submissionService = new SubmissionService();
