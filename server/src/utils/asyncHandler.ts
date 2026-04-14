/**
 * server/src/utils/asyncHandler.ts
 * Wraps async Express route handlers so you don't need try/catch in every controller.
 * Any thrown error is automatically forwarded to the global error middleware.
 */

import { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

export function asyncHandler(fn: AsyncRequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
