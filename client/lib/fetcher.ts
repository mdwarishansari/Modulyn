/**
 * client/lib/fetcher.ts
 * SWR-compatible fetcher that automatically injects the Clerk auth token.
 * Usage: useSWR([endpoint, token], fetcher)
 */

import type { ApiResponse } from "@/types";
import { ApiError } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export async function fetcher<T>(
  endpoint: string,
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { headers });

  if (!res.ok) {
    const body: ApiResponse = await res.json().catch(() => ({
      success: false,
      message: res.statusText,
    }));
    throw new ApiError(body.message ?? "Request failed", res.status);
  }

  const data: ApiResponse<T> = await res.json();
  return data.data as T;
}

export async function mutationFetcher<T>(
  endpoint: string,
  method: "POST" | "PATCH" | "PUT" | "DELETE",
  body: unknown,
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const body2: ApiResponse = await res.json().catch(() => ({
      success: false,
      message: res.statusText,
    }));
    throw new ApiError(body2.message ?? "Request failed", res.status);
  }

  const data: ApiResponse<T> = await res.json();
  return data.data as T;
}
