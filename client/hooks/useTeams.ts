"use client";
/**
 * client/hooks/useTeams.ts
 * Hooks for creating and joining teams.
 */

import { useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { mutationFetcher } from "@/lib/fetcher";
import type { Team } from "@/types";
import type { CreateTeamInput, JoinTeamInput } from "@/lib/validations";

export function useTeams() {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTeam = useCallback(
    async (input: CreateTeamInput): Promise<Team | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getToken();
        return await mutationFetcher<Team>("/teams", "POST", input, token);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create team");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [getToken]
  );

  const joinTeam = useCallback(
    async (input: JoinTeamInput): Promise<Team | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getToken();
        return await mutationFetcher<Team>("/teams/join", "POST", input, token);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to join team");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [getToken]
  );

  return { createTeam, joinTeam, isLoading, error };
}
