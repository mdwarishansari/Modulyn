/**
 * server/src/lib/prisma.ts
 * Prisma client singleton.
 * In development, re-uses the same instance across hot reloads to avoid
 * exhausting the connection pool.
 */

import { PrismaClient } from "@prisma/client";
import { env } from "@config/env";

declare global {
  // Prevent multiple Prisma instances in development (Next.js / ts-node-dev hot reload)
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma: PrismaClient =
  global.__prisma ??
  new PrismaClient({
    log: env.isDevelopment ? ["query", "error", "warn"] : ["error"],
  });

if (env.isDevelopment) {
  global.__prisma = prisma;
}

export default prisma;
