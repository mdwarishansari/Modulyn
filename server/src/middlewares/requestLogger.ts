/**
 * server/src/middlewares/requestLogger.ts
 * HTTP request logger middleware using morgan.
 * Uses 'dev' format in development, 'combined' in production.
 */

import morgan, { StreamOptions } from "morgan";
import { env } from "@config/env";

// Pipe morgan output through console.log
const stream: StreamOptions = {
  write: (message) => console.log(message.trim()),
};

export const requestLogger = morgan(
  env.isDevelopment ? "dev" : "combined",
  { stream }
);
