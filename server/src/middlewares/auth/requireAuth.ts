/**
 * server/src/middlewares/auth/requireAuth.ts
 * Strictly validates the Clerk token and syncs the user into our DB.
 * Implements Super Admin domain/email check.
 */

import { Request, Response, NextFunction } from "express";
import { requireAuth as clerkRequireAuth, getAuth } from "@clerk/express";
import prisma from "@lib/prisma";
import { env } from "@config/env";

export const requireAuth = [
  clerkRequireAuth(),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const auth = getAuth(req);
      if (!auth || !auth.userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: auth.userId },
      });

      if (!dbUser) {
        res.status(401).json({
          success: false,
          message: "User account not synced. Please try again later.",
        });
        return;
      }

      // Super Admin override via env vars — never hardcoded in DB
      const isSuperAdmin =
        (!!env.SUPER_ADMIN_EMAIL && dbUser.email === env.SUPER_ADMIN_EMAIL) ||
        (!!env.SUPER_ADMIN_ALLOWED_DOMAINS &&
          dbUser.email.endsWith(`@${env.SUPER_ADMIN_ALLOWED_DOMAINS}`));

      req.user = { id: dbUser.id, email: dbUser.email, isSuperAdmin };
      next();
    } catch (error) {
      console.error("[requireAuth] Error:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  },
];
