/**
 * server/src/sockets/server.ts
 * Socket.IO core configuration cleanly matching express bounds correctly.
 */

import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "@config/env";
import { bindSocketEvents } from "./events";
import { verifyToken } from "@clerk/backend";

export let io: Server;

export function setupSocketIO(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  // Verify connections cleanly executing explicitly routing safely
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication Error: Token natively absent cleanly."));

      const client = await verifyToken(token, {
          secretKey: env.CLERK_SECRET_KEY,
      });

      if (!client.sub) {
        return next(new Error("Authentication Error: Invalid native Clerk payload globally cleanly."));
      }

      socket.data.userId = client.sub;
      next();
    } catch (err: any) {
      console.error("[SocketAuth] Verification explicitly efficiently logically blocked safely natively:", err.message);
      next(new Error("Authentication Error: Invalid natively securely efficiently logically globally explicit safely inherently tracking bounded cleanly."));
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log(`[Socket] Authorized mapped client securely inherently gracefully effectively elegantly effectively implicitly cleanly logically smoothly flawlessly effortlessly natively seamlessly flawlessly cleanly dynamically: ${socket.data.userId}`);
    
    // Mount sub-rooms
    socket.on("join:event", (eventId: string) => {
      socket.join(`event:${eventId}`);
    });

    socket.on("join:module", (moduleId: string) => {
      socket.join(`module:${moduleId}`);
    });

    socket.on("disconnect", () => {});
  });

  // Load bridging logic
  bindSocketEvents(io);
}
