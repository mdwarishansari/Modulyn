/**
 * server/src/modules/module/types/hackathon/hackathon.handler.ts
 * Hackathon ModuleHandler — validates project submissions, requires manual evaluation.
 */

import { ModuleType, Prisma } from "@prisma/client";
import { ModuleHandler, SubmissionResult } from "@lib/module-engine/types";
import { moduleRegistry } from "@lib/module-engine/registry";
import { uploadImage } from "@lib/cloudinary";

export const HackathonHandler: ModuleHandler = {
  type: ModuleType.HACKATHON,

  validateConfig: async (configJson: Prisma.JsonValue) => {
    if (typeof configJson !== "object" || Array.isArray(configJson) || configJson === null) {
      throw new Error("Hackathon config must be a JSON object");
    }
  },

  init: async (moduleId: string) => {
    console.log(`[HackathonHandler] Initialized hackathon module: ${moduleId}`);
  },

  submit: async (
    moduleId: string,
    _userId: string,
    payload: Record<string, unknown>
  ): Promise<SubmissionResult> => {
    const { projectTitle, description, repoUrl, demoUrl, fileBase64 } = payload as {
      projectTitle?: string;
      description?: string;
      repoUrl?: string;
      demoUrl?: string;
      fileBase64?: string; // Optional base64 encoded file for Cloudinary upload
    };

    if (!projectTitle || typeof projectTitle !== "string" || projectTitle.trim().length < 3) {
      throw new Error("Hackathon submission requires a 'projectTitle' (min 3 characters)");
    }
    if (!description || typeof description !== "string" || description.trim().length < 20) {
      throw new Error("Hackathon submission requires a 'description' (min 20 characters)");
    }

    let uploadedFileUrl: string | undefined;

    // Upload file to Cloudinary if provided
    if (fileBase64 && typeof fileBase64 === "string") {
      const result = await uploadImage(fileBase64, `modulyn/hackathon/${moduleId}`);
      uploadedFileUrl = result.secure_url;
    }

    return {
      contentJsonb: {
        projectTitle: projectTitle.trim(),
        description: description.trim(),
        repoUrl: repoUrl ?? null,
        demoUrl: demoUrl ?? null,
        attachmentUrl: uploadedFileUrl ?? null,
      },
      status: "pending-review", // Hackathons always require manual evaluation
    };
  },

  evaluate: async (submissionId: string) => {
    // Manual evaluation — score is set externally by judges.
    // This hook can dispatch notifications when called.
    console.log(`[HackathonHandler] evaluate() called for submission: ${submissionId}`);
    return { score: 0, feedback: "Awaiting judge evaluation" };
  },

  onStateChange: async (moduleId, oldState, newState) => {
    console.log(`[HackathonHandler] ${moduleId}: ${oldState} → ${newState}`);
  },
};

moduleRegistry.register(HackathonHandler);
