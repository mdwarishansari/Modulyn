/**
 * server/src/types/express/index.d.ts
 * Override Express Request typing to inject our normalized auth entity.
 */

import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        isSuperAdmin: boolean;
      };
    }
  }
}
