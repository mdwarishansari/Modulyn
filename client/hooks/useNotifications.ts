"use client";
/**
 * client/hooks/useNotifications.ts
 * Subscribes to real-time notifications and keeps a local badge count.
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { createSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
}

export function useNotifications() {
  const { getToken } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchInitial = useCallback(async () => {
    const token = await getToken();
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const json = await res.json();
      setNotifications(json.data ?? []);
      setUnreadCount((json.data ?? []).filter((n: Notification) => !n.isRead).length);
    } catch {
      // Silently fail — socket will keep us up to date
    }
  }, [getToken]);

  useEffect(() => {
    let socketInst: Socket | null = null;
    let isActive = true;

    const setup = async () => {
      const token = await getToken();
      if (!isActive || !token) return;

      await fetchInitial();

      socketInst = createSocket(token);

      socketInst.on("notification:new", (notif: Notification) => {
        setNotifications((prev) => [{ ...notif, isRead: false }, ...prev]);
        setUnreadCount((c) => c + 1);
      });
    };

    setup();

    return () => {
      isActive = false;
      socketInst?.disconnect();
    };
  }, [getToken, fetchInitial]);

  const markRead = useCallback(
    async (id: string) => {
      const token = await getToken();
      if (!token) return;

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    },
    [getToken]
  );

  return { notifications, unreadCount, markRead };
}
