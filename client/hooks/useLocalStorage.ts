"use client";

/**
 * client/hooks/useLocalStorage.ts
 * Type-safe localStorage hook with SSR safety.
 * Syncs state across tabs via the "storage" event.
 */

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Read from localStorage (SSR-safe)
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Write to localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const newValue =
          typeof value === "function"
            ? (value as (prev: T) => T)(storedValue)
            : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);
        // Notify other tabs
        window.dispatchEvent(new Event("local-storage"));
      } catch (error) {
        console.warn(`[useLocalStorage] Failed to set key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`[useLocalStorage] Failed to remove key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = () => setStoredValue(readValue());
    window.addEventListener("storage", handleStorage);
    window.addEventListener("local-storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("local-storage", handleStorage);
    };
  }, [readValue]);

  return [storedValue, setValue, removeValue];
}
