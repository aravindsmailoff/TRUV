"use client";

import { useSyncExternalStore } from "react";
import { RegisteredUser } from "./authStore";

const STORAGE_KEY_SESSION = "truv_current_session_v1";

let cachedRaw: string | null | undefined = undefined;
let cachedUser: RegisteredUser | null = null;

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => {
    cachedRaw = undefined;
    callback();
  };
  window.addEventListener("truv-auth-changed", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("truv-auth-changed", handler);
    window.removeEventListener("storage", handler);
  };
}

function getSnapshot(): RegisteredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedUser = raw ? (JSON.parse(raw) as RegisteredUser) : null;
    }
    return cachedUser;
  } catch {
    return null;
  }
}

function getServerSnapshot(): RegisteredUser | null {
  return null;
}

const emptySubscribe = () => () => {};

/**
 * SSR-safe session hook backed by React's `useSyncExternalStore`.
 * Initial client render matches SSR (`isHydrated === false`, `currentUser === null`),
 * preventing hydration mismatches while reading `localStorage` cleanly without effects.
 */
export function useSessionUser(): {
  currentUser: RegisteredUser | null;
  isHydrated: boolean;
} {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const storeUser = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    currentUser: isHydrated ? storeUser : null,
    isHydrated,
  };
}

