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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auth = getAuth(req);
      if (!auth || !auth.userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      // We rely on Clerk Webhooks for creating the user, but this adds a safety net
      // or at least attaches our internal DB user to the request.
      const dbUser = await prisma.user.findUnique({
        where: { id: auth.userId }
      });

      if (!dbUser) {
        return res.status(401).json({
          success: false,
          message: "User account not synced completely. Please try again later.",
        });
      }

      // Check Super Admin Override
      let isSuperAdmin = false;
      if (
        (env.SUPER_ADMIN_EMAIL && dbUser.email === env.SUPER_ADMIN_EMAIL) ||
        (env.SUPER_ADMIN_ALLOWED_DOMAINS && dbUser.email.endsWith(`@${env.SUPER_ADMIN_ALLOWED_DOMAINS}`))
      ) {
        isSuperAdmin = true;
      }

      // Attach to request
      req.user = {
        id: dbUser.id,
        email: dbUser.email,
        isSuperAdmin,
      };

      next();
    } catch (error) {
      console.error("[requireAuth] Error:", error);
      res.status(500).json({ success: false, message: "Internal server error during auth validation." });
    }
  }
];
