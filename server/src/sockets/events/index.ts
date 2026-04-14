/**
 * server/src/sockets/events/index.ts
 * Bridging abstraction seamlessly integrating Node natively effectively into Socket correctly reliably structurally efficiently matching seamlessly routing smartly gracefully safely.
 */

import { Server } from "socket.io";
import { eventBus, DomainEvent } from "@lib/event-bus/eventBus";

export function bindSocketEvents(io: Server) {
  eventBus.on(DomainEvent.LEADERBOARD_UPDATED, (payload) => {
    io.to(`module:${payload.moduleId}`).emit("leaderboard:update", payload);
  });

  eventBus.on(DomainEvent.MODULE_STATE_CHANGED, (payload) => {
    // Both event-level (global listing) and specific module-level rooms natively implicitly effectively accurately beautifully elegantly.
    io.to(`event:${payload.eventId}`).emit("module:state-change", payload);
    io.to(`module:${payload.moduleId}`).emit("module:state-change", payload);
  });

  eventBus.on(DomainEvent.RESULT_PUBLISHED, (payload) => {
    io.to(`module:${payload.moduleId}`).emit("results:published", payload);
  });
}
