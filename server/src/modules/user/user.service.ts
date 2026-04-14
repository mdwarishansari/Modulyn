/**
 * server/src/modules/user/user.service.ts
 * User profile management — sync Clerk identity with our DB, profile reads/writes.
 */

import prisma from "@lib/prisma";

export class UserService {
  /**
   * Upserts a user record from Clerk's identity payload.
   * Called on first login or profile update via webhook/middleware.
   */
  async upsertFromClerk(clerkUserId: string, data: {
    email: string;
    name: string;
    avatarUrl?: string;
  }) {
    return prisma.user.upsert({
      where: { id: clerkUserId },
      update: {
        name: data.name,
        avatarUrl: data.avatarUrl ?? undefined,
      },
      create: {
        id: clerkUserId,
        email: data.email,
        name: data.name,
        avatarUrl: data.avatarUrl ?? null,
      },
    });
  }

  /**
   * Returns the full profile of the authenticated user.
   */
  async getMe(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatarUrl: true,
        phone: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            createdEvents: true,
            registrations: true,
            submissions: true,
          },
        },
      },
    });
  }

  /**
   * Updates mutable profile fields for the authenticated user.
   */
  async updateMe(userId: string, data: { name?: string; username?: string; phone?: string; avatarUrl?: string }) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        username: true,
        phone: true,
        avatarUrl: true,
      },
    });
  }

  /**
   * Returns a public profile by username.
   */
  async getPublicProfile(username: string) {
    return prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
  }
}

export const userService = new UserService();
