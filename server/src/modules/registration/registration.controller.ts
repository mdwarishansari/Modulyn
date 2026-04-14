/**
 * server/src/modules/registration/registration.controller.ts
 * Exposes payload endpoints cleanly catching structural limits globally.
 */

import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler";
import { registrationService } from "./registration.service";
import { createRegistrationSchema } from "./registration.validation";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { body } = createRegistrationSchema.parse({ body: req.body });

  try {
    const registration = await registrationService.register(
      body.moduleId,
      req.user!.id,
      body.teamId
    );

    res.status(201).json({
      success: true,
      data: registration,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Prisma Unique constraint violation natively traps duplicates
      res.status(400).json({ success: false, message: "Duplicate registration detected. You (or your team) are already registered." });
      return;
    }
    
    // Catch standard lifecycle bounds
    res.status(400).json({ success: false, message: error.message });
  }
});
