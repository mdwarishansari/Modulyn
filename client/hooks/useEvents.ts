"use client";
/**
 * client/hooks/useEvents.ts
 * SWR-powered hooks for events data.
 */

import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { fetcher } from "@/lib/fetcher";
import type { Event } from "@/types";

/** Fetch all public events */
export function useEvents() {
  const { getToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<Event[]>(
    "/events",
    async (endpoint: string) => {
      const token = await getToken();
      return fetcher<Event[]>(endpoint, token);
    },
    { revalidateOnFocus: false }
  );

  return {
    events: data ?? [],
    isLoading,
    error,
    refetch: mutate,
  };
}

/** Fetch a single event by org slug + event slug */
export function useEvent(org: string, eventSlug: string) {
  const { getToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<Event>(
    org && eventSlug ? `/events/${org}/${eventSlug}` : null,
    async (endpoint: string) => {
      const token = await getToken();
      return fetcher<Event>(endpoint, token);
    },
    { revalidateOnFocus: false }
  );

  return {
    event: data ?? null,
    isLoading,
    error,
    refetch: mutate,
  };
}
