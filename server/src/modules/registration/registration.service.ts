/**
 * server/src/modules/registration/registration.service.ts
 * Handles atomic registration linkages dynamically asserting team vs solitary scopes intelligently implicitly.
 */

import prisma from "@lib/prisma";

export class RegistrationService {
  /**
   * Registers a user or a team inherently mapping atomic database footprints locally.
   */
  async register(moduleId: string, requestorId: string, teamId?: string) {
    const moduleObj = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { event: true },
    });

    if (!moduleObj) throw new Error("Module not found");

    if (moduleObj.state !== "REGISTRATION_OPEN" && moduleObj.state !== "LIVE") {
      throw new Error(`Registration is currently blocked. Module is: ${moduleObj.state}`);
    }

    // Individual Mode Validation
    if (moduleObj.moduleMode === "INDIVIDUAL") {
      if (teamId) throw new Error("This module prohibits Team registrations.");
      return prisma.registration.create({
        data: {
          moduleId,
          userId: requestorId,
          status: moduleObj.approvalRequired ? "PENDING" : "CONFIRMED",
        },
      });
    }

    // Team Mode Validation
    if (moduleObj.moduleMode === "TEAM") {
      if (!teamId) throw new Error("This module strictly requires a Team context registration.");
      
      const team = await prisma.team.findUnique({ where: { id: teamId }, include: { members: true } });
      if (!team) throw new Error("Team not found");
      
      const isLeader = team.members.find(m => m.userId === requestorId && m.isLeader);
      if (!isLeader) throw new Error("Only the Team Leader can submit the final registration natively.");

      // Check max team bounds if needed here.
      return prisma.registration.create({
        data: {
          moduleId,
          teamId,
          status: moduleObj.approvalRequired ? "PENDING" : "CONFIRMED",
        },
      });
    }

    // HYBRID mode mapping falls back inherently.
    return prisma.registration.create({
      data: {
        moduleId,
        userId: teamId ? null : requestorId,
        teamId: teamId || null,
        status: moduleObj.approvalRequired ? "PENDING" : "CONFIRMED",
      },
    });
  }
}

export const registrationService = new RegistrationService();
