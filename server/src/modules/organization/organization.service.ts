/**
 * server/src/modules/organization/organization.service.ts
 */

import prisma from "@lib/prisma";
import { Prisma, OrgMemberRole } from "@prisma/client";

export class OrganizationService {
  async create(data: Prisma.OrganizationUncheckedCreateInput, ownerId: string) {
    return prisma.organization.create({
      data: {
        ...data,
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: OrgMemberRole.OWNER,
            status: "ACTIVE",
          },
        },
      },
    });
  }

  async getBySlug(slug: string) {
    return prisma.organization.findUnique({
      where: { slug },
      include: {
        members: {
          where: { status: "ACTIVE" },
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
        _count: { select: { events: true, members: true } },
      },
    });
  }

  async listPublic(limit = 20, offset = 0) {
    return prisma.organization.findMany({
      where: { status: "ACTIVE" },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        logoUrl: true,
        description: true,
        _count: { select: { events: true, members: true } },
      },
    });
  }

  async update(orgId: string, requestorId: string, data: Partial<Prisma.OrganizationUpdateInput>) {
    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) throw new Error("Organization not found");
    if (org.ownerId !== requestorId) throw new Error("UNAUTHORIZED_ACCESS");

    return prisma.organization.update({ where: { id: orgId }, data });
  }

  async archive(orgId: string, requestorId: string) {
    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) throw new Error("Organization not found");
    if (org.ownerId !== requestorId) throw new Error("UNAUTHORIZED_ACCESS");

    return prisma.organization.update({ where: { id: orgId }, data: { status: "ARCHIVED" } });
  }
}

export const organizationService = new OrganizationService();
