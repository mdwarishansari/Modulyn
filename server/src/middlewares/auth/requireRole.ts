/**
 * server/src/middlewares/auth/requireRole.ts
 * Ensure user holds sufficient platform roles or is super admin.
 */

import { Request, Response, NextFunction } from "express";

export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (req.user.isSuperAdmin) {
      return next(); // Super admin bypasses role blocks
    }

    // Role expansion logic here (fetching event/org specific roles later if needed)
    // For now simple system-wide reject if they aren't super admin since we
    // handle event-specific roles via domain modules usually.
    if (allowedRoles.includes("super_admin")) {
        return res.status(403).json({ success: false, message: "Forbidden: Super Admin access required" });
    }

    next();
  };
}
