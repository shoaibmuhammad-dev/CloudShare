import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { authOptions } from "@/lib/auth";
import { getQueryClient } from "@/lib/get-query-client";
import { listFolders } from "@/lib/data/folders";
import { FolderList } from "./_components/FolderList";
import { CreateFolderModal } from "./_components/CreateFolderModal";

export const metadata = {
  title: "Dashboard | CloudShare",
  description: "Manage your files and folders.",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // middleware.ts already protects this route, but this is a cheap,
  // explicit second check directly in the page — worth keeping in case
  // the middleware matcher ever changes and stops covering this path.
  if (!session?.user?.id) {
    redirect("/login");
  }

  const queryClient = getQueryClient();

  try {
    const folders = await listFolders(session.user.id, null);
    // Seed the client's ["folders", null] cache entry directly — no need
    // for a queryFn here since we already have the data.
    queryClient.setQueryData(["folders", null], folders);
  } catch (err) {
    // If the DB hiccups during SSR, don't crash the whole page — just skip
    // the prefetch. FolderList will fall back to its own client-side fetch
    // and show a normal error/retry state if that fails too.
    console.error("DASHBOARD_SSR_FOLDERS_ERROR", err);
  }

  return (
    <div className="space-y-6">
      <section className="w-full flex items-center justify-between flex-wrap gap-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Folders
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and organize your shared folders and files.
          </p>
        </div>
        <div>
          <CreateFolderModal />
        </div>
      </section>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <FolderList />
      </HydrationBoundary>
    </div>
  );
}
