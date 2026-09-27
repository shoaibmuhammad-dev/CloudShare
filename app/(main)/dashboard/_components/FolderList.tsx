"use client";

import { Folder as FolderIcon, RefreshCcw } from "lucide-react";
import { useFolders } from "@/lib/hooks/useFolders";
import FolderCard from "./FolderCard";

export function FolderList() {
  // parentId=null -> dashboard root. Because the server component already
  // seeded ["folders", null] via HydrationBoundary, this resolves with
  // data immediately on first render — no loading flash on initial load.
  // It still refetches in the background per the QueryClient's staleTime,
  // and re-runs automatically whenever CreateFolderModal's mutation
  // invalidates this same query key.
  const {
    data: folders,
    isLoading,
    isError,
    error,
    refetch,
  } = useFolders(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <p className="text-sm text-slate-600">
          {(error as Error)?.message ?? "Couldn't load your folders."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          <RefreshCcw className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  if (!folders || folders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
          <FolderIcon className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-slate-900">No folders yet</p>
        <p className="text-sm text-slate-500">
          Create your first folder to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {folders.map((folder) => (
        <FolderCard folder={folder} key={folder.id} />
      ))}
    </div>
  );
}
