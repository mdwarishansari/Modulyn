"use client";
/**
 * client/hooks/useRegistrations.ts
 * Hooks for managing registrations (read + create).
 */

import useSWR from "swr";
import { useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetcher, mutationFetcher } from "@/lib/fetcher";
import type { Registration } from "@/types";
import type { RegisterInput } from "@/lib/validations";

/** Fetch the current user's registrations */
export function useMyRegistrations() {
  const { getToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<Registration[]>(
    "/registrations/me",
    async (endpoint: string) => {
      const token = await getToken();
      return fetcher<Registration[]>(endpoint, token);
    },
    { revalidateOnFocus: false }
  );

  return {
    registrations: data ?? [],
    isLoading,
    error,
    refetch: mutate,
  };
}

/** Check if user is registered for a specific module */
export function useIsRegistered(moduleId: string | null | undefined) {
  const { registrations, isLoading } = useMyRegistrations();
  const isRegistered = registrations.some((r) => r.moduleId === moduleId);
  return { isRegistered, isLoading };
}

/** Register for a module */
export function useRegister() {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(
    async (input: RegisterInput): Promise<Registration | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const result = await mutationFetcher<Registration>(
          "/registrations",
          "POST",
          input,
          token
        );
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Registration failed");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [getToken]
  );

  return { register, isLoading, error };
}
