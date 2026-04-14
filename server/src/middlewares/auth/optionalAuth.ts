/**
 * server/src/middlewares/auth/optionalAuth.ts
 * Validates the Clerk session if passed, otherwise continues anonymously.
 */

import { Request, Response, NextFunction } from "express";
import { clerkMiddleware, getAuth } from "@clerk/express";
import prisma from "@lib/prisma";
import { env } from "@config/env";

export const optionalAuth = [
  clerkMiddleware(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auth = getAuth(req);
      
      if (auth && auth.userId) {
        const dbUser = await prisma.user.findUnique({
          where: { id: auth.userId }
        });

        if (dbUser) {
          let isSuperAdmin = false;
          if (
            (env.SUPER_ADMIN_EMAIL && dbUser.email === env.SUPER_ADMIN_EMAIL) ||
            (env.SUPER_ADMIN_ALLOWED_DOMAINS && dbUser.email.endsWith(`@${env.SUPER_ADMIN_ALLOWED_DOMAINS}`))
          ) {
            isSuperAdmin = true;
          }

          req.user = {
            id: dbUser.id,
            email: dbUser.email,
            isSuperAdmin,
          };
        }
      }
      next();
    } catch (error) {
      // Continue anonymously on error
      console.error("[optionalAuth] Error:", error);
      next();
    }
  }
];
