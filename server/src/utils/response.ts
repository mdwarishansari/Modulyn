/**
 * server/src/utils/response.ts
 * Standardized API response helpers.
 * All endpoints should use these to keep the response shape consistent.
 */

import { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: Record<string, unknown>;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
  meta?: Record<string, unknown>
): Response {
  const payload: ApiResponse<T> = { success: true, message, data };
  if (meta) payload.meta = meta;
  return res.status(statusCode).json(payload);
}

export function sendCreated<T>(res: Response, data: T, message = "Created"): Response {
  return sendSuccess(res, data, message, 201);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  error?: string
): Response {
  const payload: ApiResponse = { success: false, message };
  if (error) payload.error = error;
  return res.status(statusCode).json(payload);
}

export function sendNotFound(res: Response, message = "Resource not found"): Response {
  return sendError(res, message, 404);
}

export function sendUnauthorized(res: Response, message = "Unauthorized"): Response {
  return sendError(res, message, 401);
}

export function sendForbidden(res: Response, message = "Forbidden"): Response {
  return sendError(res, message, 403);
}

export function sendBadRequest(res: Response, message = "Bad request"): Response {
  return sendError(res, message, 400);
}
