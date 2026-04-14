/**
 * server/src/middlewares/notFound.ts
 * Catch-all for any route that doesn't match a registered handler.
 * Must be registered AFTER all routes, BEFORE errorHandler.
 */

import { Request, Response, NextFunction } from "express";
import { AppError } from "@middlewares/errorHandler";

export function notFound(_req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(`Route ${_req.method} ${_req.originalUrl} not found`, 404));
}
