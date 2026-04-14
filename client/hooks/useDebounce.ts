"use client";

/**
 * client/hooks/useDebounce.ts
 * Debounces a value update by a given delay.
 * Use for search inputs to avoid firing API calls on every keystroke.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchQuery, 400);
 *   useEffect(() => { fetchResults(debouncedSearch); }, [debouncedSearch]);
 */

import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
