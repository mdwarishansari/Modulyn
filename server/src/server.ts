/**
 * server/src/server.ts
 * Entry point. Connects the database and starts the HTTP server.
 * Performs graceful shutdown on SIGTERM / SIGINT.
 */

import http from "http";
import { env } from "@config/env";
import { createApp } from "./app";
import prisma from "@lib/prisma";
import { setupSocketIO } from "./sockets/server";

async function main(): Promise<void> {
  // ─── Validate DB connection ────────────────────────────────────────────────
  await prisma.$connect();
  console.log("[DB] Connected to PostgreSQL via Prisma");

  // ─── Start server ─────────────────────────────────────────────────────────
  const app = createApp();
  const server = http.createServer(app);

  setupSocketIO(server);

  server.listen(env.PORT, () => {
    console.log(`[Server] Modulyn API + Socket.IO running in ${env.NODE_ENV} mode`);
    console.log(`[Server] Listening on http://localhost:${env.PORT}`);
    console.log(`[Server] Health → http://localhost:${env.PORT}/api/v1/health`);
  });

  // ─── Graceful Shutdown ────────────────────────────────────────────────────
  async function shutdown(signal: string): Promise<void> {
    console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      console.log("[DB] Prisma disconnected.");
      process.exit(0);
    });

    // Force exit if graceful shutdown takes too long
    setTimeout(() => process.exit(1), 10_000);
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

main().catch((err) => {
  console.error("[Server] Fatal startup error:", err);
  process.exit(1);
});
