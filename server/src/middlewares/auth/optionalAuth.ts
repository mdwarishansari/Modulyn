/**
 * server/src/middlewares/auth/optionalAuth.ts
 * Validates the Clerk session if present, continues anonymously otherwise.
 */

import { Request, Response, NextFunction } from "express";
import { clerkMiddleware, getAuth } from "@clerk/express";
import prisma from "@lib/prisma";
import { env } from "@config/env";

export const optionalAuth = [
  clerkMiddleware(),
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const auth = getAuth(req);

      if (auth?.userId) {
        const dbUser = await prisma.user.findUnique({
          where: { id: auth.userId },
        });

        if (dbUser) {
          const isSuperAdmin =
            (!!env.SUPER_ADMIN_EMAIL && dbUser.email === env.SUPER_ADMIN_EMAIL) ||
            (!!env.SUPER_ADMIN_ALLOWED_DOMAINS &&
              dbUser.email.endsWith(`@${env.SUPER_ADMIN_ALLOWED_DOMAINS}`));

          req.user = { id: dbUser.id, email: dbUser.email, isSuperAdmin };
        }
      }
      next();
    } catch (error) {
      console.error("[optionalAuth] Error:", error);
      next(); // Continue anonymously on error
    }
  },
];
