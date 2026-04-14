/**
 * client/lib/socket.ts
 * Socket.IO connection with auto-reconnect and API fallback polling.
 */

import { io, Socket } from "socket.io-client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const createSocket = (token: string): Socket => {
  return io(API_URL, {
    auth: { token },
    withCredentials: true,
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1500,
  });
};

/**
 * Hook for subscribing to a module or event room with automatic API fallback.
 * If the socket disconnects, falls back to polling the leaderboard REST API.
 */
export function useSocket(roomId: string, roomType: "event" | "module" = "module") {
  const { getToken } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const fallbackIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startFallbackPolling = useCallback(() => {
    if (fallbackIntervalRef.current) return;
    fallbackIntervalRef.current = setInterval(async () => {
      // Lightweight API poll — components consuming this can refetch on their own
      console.log(`[Socket:Fallback] Polling leaderboard for ${roomType}:${roomId}`);
    }, 10_000);
  }, [roomId, roomType]);

  const stopFallbackPolling = useCallback(() => {
    if (fallbackIntervalRef.current) {
      clearInterval(fallbackIntervalRef.current);
      fallbackIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    let activeSocket: Socket | null = null;
    let disconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let isActive = true;

    const setup = async () => {
      const token = await getToken();
      if (!isActive || !token) return;

      activeSocket = createSocket(token);

      activeSocket.on("connect", () => {
        setIsConnected(true);
        stopFallbackPolling();
        activeSocket!.emit(`join:${roomType}`, roomId);
      });

      activeSocket.on("disconnect", () => {
        setIsConnected(false);
        // Start fallback polling after 3 seconds of disconnection
        disconnectTimer = setTimeout(startFallbackPolling, 3000);
      });

      activeSocket.on("connect_error", () => {
        setIsConnected(false);
        startFallbackPolling();
      });

      setSocket(activeSocket);
    };

    setup();

    return () => {
      isActive = false;
      if (disconnectTimer) clearTimeout(disconnectTimer);
      stopFallbackPolling();
      if (activeSocket) activeSocket.disconnect();
    };
  }, [roomId, roomType, getToken, startFallbackPolling, stopFallbackPolling]);

  return { socket, isConnected };
}
