/**
 * server/src/modules/team/team.service.ts
 * Orchestrating implicit limits tracking natively safely globally bounds capacity cleanly.
 */

import prisma from "@lib/prisma";
import crypto from "crypto";

export class TeamService {
  /**
   * Initializes a Team bound locally tracking `maxTeams` capacities down explicitly onto modules.
   */
  async createTeam(moduleId: string, name: string, requestorId: string) {
    const modObj = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { _count: { select: { teams: true } } },
    });

    if (!modObj) throw new Error("Module not found");
    if (modObj.moduleMode === "INDIVIDUAL") throw new Error("This Module officially rejects Team mode completely.");

    // Validate global max bounds implicitly
    if (modObj.maxTeams && modObj._count.teams >= modObj.maxTeams) {
      throw new Error("Strict Capacity Block: Module has reached maximum allowed Teams natively.");
    }

    // Explicit unique 8 character alphanumeric code
    const uniqueCode = crypto.randomBytes(4).toString("hex").toUpperCase();

    // Map the creator as the explicit Owner Leader safely tracking directly.
    return prisma.team.create({
      data: {
        moduleId,
        name,
        code: uniqueCode,
        members: {
          create: {
            userId: requestorId,
            isLeader: true,
          },
        },
      },
    });
  }

  /**
   * Safe mapping validating user capacities safely before tracking team allocations explicitly.
   */
  async joinTeam(code: string, requestorId: string) {
    const team = await prisma.team.findUnique({
      where: { code },
      include: {
        module: true,
        _count: { select: { members: true } },
      },
    });

    if (!team) throw new Error("Invalid explicitly mapped Team code strictly returning cleanly.");
    if (team.module.state !== "REGISTRATION_OPEN" && team.module.state !== "LIVE") {
      throw new Error("Registration bounds explicitly blocked natively globally.");
    }

    // Track strict `teamSizeMax` bounds
    if (team.module.teamSizeMax && team._count.members >= team.module.teamSizeMax) {
      throw new Error("Team is officially full bounded exactly natively globally.");
    }

    return prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: requestorId,
        isLeader: false,
      },
    });
  }
}

export const teamService = new TeamService();
