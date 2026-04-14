/**
 * server/src/modules/team/team.controller.ts
 * Explicit mapping handling errors natively globally avoiding implicit leaks.
 */

import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler";
import { teamService } from "./team.service";
import { createTeamSchema, joinTeamSchema } from "./team.validation";

export const createTeam = asyncHandler(async (req: Request, res: Response) => {
  const { body } = createTeamSchema.parse({ body: req.body });

  try {
    const team = await teamService.createTeam(body.moduleId, body.name, req.user!.id);
    res.status(201).json({
      success: true,
      data: team,
    });
  } catch (err: any) {
    if (err.code === 'P2002') {
      res.status(400).json({ success: false, message: "A team explicitly mapped using this exact name inherently exists within this Module cleanly." });
      return;
    }
    res.status(400).json({ success: false, message: err.message });
  }
});

export const joinTeam = asyncHandler(async (req: Request, res: Response) => {
  const { body } = joinTeamSchema.parse({ body: req.body });

  try {
    const member = await teamService.joinTeam(body.code, req.user!.id);
    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (err: any) {
    if (err.code === 'P2002') {
      res.status(400).json({ success: false, message: "You implicitly globally exist effectively matching exactly on this native Team securely." });
      return;
    }
    res.status(400).json({ success: false, message: err.message });
  }
});
