"use client";
/**
 * client/hooks/useModules.ts
 * SWR hooks for module data.
 */

import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { fetcher } from "@/lib/fetcher";
import type { Module } from "@/types";

/** Fetch all modules for an event */
export function useModules(eventId: string | null | undefined) {
  const { getToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<Module[]>(
    eventId ? `/modules/event/${eventId}` : null,
    async (endpoint: string) => {
      const token = await getToken();
      return fetcher<Module[]>(endpoint, token);
    },
    { revalidateOnFocus: false }
  );

  return {
    modules: data ?? [],
    isLoading,
    error,
    refetch: mutate,
  };
}

/** Fetch a single module by ID */
export function useModule(moduleId: string | null | undefined) {
  const { getToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<Module>(
    moduleId ? `/modules/${moduleId}` : null,
    async (endpoint: string) => {
      const token = await getToken();
      return fetcher<Module>(endpoint, token);
    },
    { revalidateOnFocus: false }
  );

  return {
    module: data ?? null,
    isLoading,
    error,
    refetch: mutate,
  };
}
