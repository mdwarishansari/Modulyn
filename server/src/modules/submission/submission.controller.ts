/**
 * server/src/modules/submission/submission.controller.ts
 */

import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler";
import { submissionService } from "./submission.service";
import { createSubmissionSchema } from "./submission.validation";

export const createSubmission = asyncHandler(async (req: Request, res: Response) => {
  const { body } = createSubmissionSchema.parse({ body: req.body });

  try {
    const submission = await submissionService.createSubmission(
      body.moduleId,
      req.user!.id,
      body.payload,
      body.teamId
    );
    res.status(201).json({ success: true, data: submission });
  } catch (err: any) {
    if (err.code === "P2002") {
      res.status(400).json({
        success: false,
        message: "You have already submitted to this module.",
      });
      return;
    }
    res.status(400).json({ success: false, message: err.message });
  }
});

export const getModuleSubmissions = asyncHandler(async (req: Request, res: Response) => {
  const { moduleId } = req.params;
  const submissions = await submissionService.getSubmissionsForModule(moduleId as string);
  res.status(200).json({ success: true, data: submissions });
});

export const getMySubmission = asyncHandler(async (req: Request, res: Response) => {
  const { moduleId } = req.params;
  const submission = await submissionService.getUserSubmission(moduleId as string, req.user!.id);

  if (!submission) {
    res.status(404).json({ success: false, message: "No submission found" });
    return;
  }
  res.status(200).json({ success: true, data: submission });
});

export const evaluateSubmission = asyncHandler(async (req: Request, res: Response) => {
  const { submissionId } = req.params;
  const result = await submissionService.evaluateSubmission(submissionId as string);
  res.status(200).json({ success: true, data: result });
});
