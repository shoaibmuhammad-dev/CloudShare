"use client";

import { useQuery } from "@tanstack/react-query";

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  image: string | null;
  emailVerified: string | null;
  createdAt: string;
}

async function fetchCurrentUser(): Promise<CurrentUser> {
  const res = await fetch("/api/user/me");
  if (!res.ok) {
    throw new Error("Failed to load profile");
  }
  return res.json();
}

/**
 * Fetches the logged-in user's profile once and caches it under the
 * "current-user" key. Every component that calls this — AppHeader, the
 * profile page, a sidebar avatar, etc. — shares the same cached data
 * instead of each firing its own request.
 *
 * After editing the profile (name/avatar/password), call:
 *   queryClient.invalidateQueries({ queryKey: ["current-user"] })
 * in that mutation's onSuccess so every consumer updates immediately.
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: fetchCurrentUser,
  });
}
