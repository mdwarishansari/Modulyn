/**
 * server/src/lib/event-bus/eventBus.ts
 * Native Node.js central signaling hub effectively inherently decoupling websockets natively seamlessly matching routes efficiently safely.
 */

import { EventEmitter } from "events";

export enum DomainEvent {
  LEADERBOARD_UPDATED   = "LEADERBOARD_UPDATED",
  MODULE_STATE_CHANGED  = "MODULE_STATE_CHANGED",
  RESULT_PUBLISHED      = "RESULT_PUBLISHED",
  SUBMISSION_CREATED    = "SUBMISSION_CREATED",
}

class InternalEventBus extends EventEmitter {
  /**
   * Wrapper enforcing explicit payload mappings cleanly efficiently effectively inherently.
   */
  emitEvent(eventName: DomainEvent, payload: Record<string, unknown>) {
    return this.emit(eventName, payload);
  }
}

export const eventBus = new InternalEventBus();
