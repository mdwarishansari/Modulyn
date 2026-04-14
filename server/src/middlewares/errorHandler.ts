/**
 * server/src/middlewares/errorHandler.ts
 * Global error handling middleware.
 * Must be registered LAST in app.ts (after all routes).
 */

import { Request, Response, NextFunction } from "express";
import { env } from "@config/env";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    // Maintains proper stack trace in V8
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : "Internal server error";

  // In development, include the full stack trace for debugging
  const payload: Record<string, unknown> = {
    success: false,
    message,
    ...(env.isDevelopment && { stack: err.stack }),
  };

  res.status(statusCode).json(payload);
}
