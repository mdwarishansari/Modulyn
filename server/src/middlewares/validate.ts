/**
 * server/src/middlewares/validate.ts
 * Request validation middleware using Zod.
 * Pass a Zod schema to validate req.body, req.query, or req.params.
 */

import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { sendError } from "@utils/response";

type Target = "body" | "query" | "params";

export function validate(schema: ZodSchema, target: Target = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = (result.error as ZodError).errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      sendError(res, "Validation failed", 422, JSON.stringify(errors));
      return;
    }

    // Replace the target with the parsed (coerced + typed) data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any)[target] = result.data;
    next();
  };
}
