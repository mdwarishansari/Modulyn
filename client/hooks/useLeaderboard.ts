"use client";
/**
 * client/hooks/useLeaderboard.ts
 * Real-time leaderboard with socket + SWR fallback.
 */

import useSWR from "swr";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetcher } from "@/lib/fetcher";
import { useSocket } from "@/lib/socket";
import type { LeaderboardEntry } from "@/types";

export function useLeaderboard(moduleId: string | null | undefined) {
  const { getToken } = useAuth();
  const { socket, isConnected } = useSocket(moduleId ?? "", "module");
  const [liveEntries, setLiveEntries] = useState<LeaderboardEntry[] | null>(null);

  const { data, error, isLoading, mutate } = useSWR<LeaderboardEntry[]>(
    moduleId ? `/leaderboard/${moduleId}` : null,
    async (endpoint: string) => {
      const token = await getToken();
      return fetcher<LeaderboardEntry[]>(endpoint, token);
    },
    {
      revalidateOnFocus: false,
      // Poll every 15s as fallback when socket disconnected
      refreshInterval: isConnected ? 0 : 15_000,
    }
  );

  // Subscribe to real-time leaderboard updates
  useEffect(() => {
    if (!socket) return;
    const handler = (entries: LeaderboardEntry[]) => {
      setLiveEntries(entries);
    };
    socket.on("leaderboard:update", handler);
    return () => { socket.off("leaderboard:update", handler); };
  }, [socket]);

  // Listen for module state changes → refetch
  useEffect(() => {
    if (!socket) return;
    socket.on("module:state-change", () => { mutate(); });
    return () => { socket.off("module:state-change"); };
  }, [socket, mutate]);

  const entries = liveEntries ?? data ?? [];

  return { entries, isLoading, error, isConnected, refetch: mutate };
}
