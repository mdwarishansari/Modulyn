"use client";
/**
 * client/hooks/useSubmissions.ts
 * Hooks for reading and creating submissions.
 */

import useSWR from "swr";
import { useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetcher, mutationFetcher } from "@/lib/fetcher";
import type { Submission } from "@/types";
import type { EvaluateSubmissionInput } from "@/lib/validations";

/** Fetch the current user's submission for a module */
export function useMySubmission(moduleId: string | null | undefined) {
  const { getToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<Submission>(
    moduleId ? `/submissions/${moduleId}/me` : null,
    async (endpoint: string) => {
      const token = await getToken();
      return fetcher<Submission>(endpoint, token);
    },
    { revalidateOnFocus: false }
  );

  return { submission: data ?? null, isLoading, error, refetch: mutate };
}

/** Fetch all submissions for a module (admin/judge only) */
export function useAllSubmissions(moduleId: string | null | undefined) {
  const { getToken } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<Submission[]>(
    moduleId ? `/submissions/${moduleId}` : null,
    async (endpoint: string) => {
      const token = await getToken();
      return fetcher<Submission[]>(endpoint, token);
    },
    { revalidateOnFocus: false }
  );

  return { submissions: data ?? [], isLoading, error, refetch: mutate };
}

/** Submit a module entry */
export function useSubmit() {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (moduleId: string, payload: Record<string, unknown>): Promise<Submission | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getToken();
        return await mutationFetcher<Submission>(
          "/submissions",
          "POST",
          { moduleId, payload },
          token
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Submission failed");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [getToken]
  );

  return { submit, isLoading, error };
}

/** Evaluate a submission (judge only) */
export function useEvaluate() {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evaluate = useCallback(
    async (submissionId: string, input: EvaluateSubmissionInput): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getToken();
        await mutationFetcher(
          `/submissions/evaluate/${submissionId}`,
          "POST",
          input,
          token
        );
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Evaluation failed");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [getToken]
  );

  return { evaluate, isLoading, error };
}
