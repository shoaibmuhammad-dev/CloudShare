"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiErrorShape {
  error?: string;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchFolders(parentId: string | null): Promise<FolderItem[]> {
  const url = parentId ? `/api/folders?parentId=${parentId}` : "/api/folders";
  const res = await fetch(url);
  const data: { folders?: FolderItem[] } & ApiErrorShape = await res
    .json()
    .catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.error ?? "Failed to load folders", res.status);
  }

  return data.folders ?? [];
}

/**
 * Lists folders directly inside `parentId` (null = dashboard root).
 * Cached per parentId, so navigating between folders doesn't refetch
 * folders you've already loaded in this session.
 */
export function useFolders(parentId: string | null) {
  return useQuery({
    queryKey: ["folders", parentId],
    queryFn: () => fetchFolders(parentId),
  });
}

interface CreateFolderInput {
  name: string;
  parentId: string | null;
}

async function createFolderRequest(
  input: CreateFolderInput,
): Promise<FolderItem> {
  const res = await fetch("/api/folders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data: FolderItem & ApiErrorShape = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      (data as ApiErrorShape).error ?? "Failed to create folder",
      res.status,
    );
  }

  return data;
}

/**
 * Creates a folder inside `parentId`. On success, invalidates the
 * ["folders", parentId] query — this is what makes the dashboard (or
 * whichever folder view is open) show the new folder immediately without
 * any manual state syncing between the modal and the grid.
 */
export function useCreateFolder(parentId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createFolderRequest({ name, parentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders", parentId] });
    },
  });
}
