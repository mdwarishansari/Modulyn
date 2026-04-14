/**
 * client/lib/socket.ts
 * Next.js frontend socket execution mapping bounds explicitly dynamically safely tracking natively mapping cleanly.
 */

import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

export const getSocket = (token?: string | null): Socket | null => {
  if (!process.env.NEXT_PUBLIC_API_URL) return null;
  if (!token) return null;

  return io(process.env.NEXT_PUBLIC_API_URL, {
    auth: { token },
    withCredentials: true,
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
};

/**
 * Global dynamic hook securely mounting websockets locally seamlessly properly tracking mappings seamlessly mapping smartly seamlessly globally inherently.
 */
export function useSocket(roomId: string, roomType: "event" | "module" = "module") {
  const { getToken } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let activeSocket: Socket | null = null;
    let isActive = true;

    const setup = async () => {
      const token = await getToken();
      if (!isActive || !token) return;

      activeSocket = getSocket(token);
      if (!activeSocket) return;

      activeSocket.on("connect", () => {
        setIsConnected(true);
        activeSocket!.emit(`join:${roomType}`, roomId);
      });

      activeSocket.on("disconnect", () => {
        setIsConnected(false);
      });

      setSocket(activeSocket);
    };

    setup();

    return () => {
      isActive = false;
      if (activeSocket) {
        activeSocket.disconnect();
      }
    };
  }, [roomId, roomType, getToken]);

  return { socket, isConnected };
}
