/**
 * server/src/app.ts
 * Express application factory.
 * All middleware and routes are registered here.
 * server.ts is responsible only for binding to a port.
 */

import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import { env } from "@config/env";
import { requestLogger } from "@middlewares/requestLogger";
import { notFound } from "@middlewares/notFound";
import { clerkMiddleware } from "@clerk/express";
import { errorHandler } from "@middlewares/errorHandler";
import apiRouter from "@/routes/index";

export function createApp(): Application {
  const app = express();

  // ─── Security ───────────────────────────────────────────────────────────────
  app.use(helmet());

  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    })
  );

  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: "Too many requests. Please try again later." },
    })
  );

  // ─── Request Parsing ────────────────────────────────────────────────────────
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(compression());

  // ─── Authentication ───────────────────────────────────────────────────────────
  // Clerk implicitly handles session verification locally and safely mounts auth on req.
  app.use(clerkMiddleware());

  // ─── Logging ────────────────────────────────────────────────────────────────
  app.use(requestLogger);

  // ─── Routes ─────────────────────────────────────────────────────────────────
  app.use("/api/v1", apiRouter);

  // ─── Error Handling (must be last) ──────────────────────────────────────────
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
