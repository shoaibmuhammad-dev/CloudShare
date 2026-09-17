import { Button } from "@/components/ui/button";
import { FolderList } from "./_components/FolderList";
import { Plus } from "lucide-react";

export const metadata = {
  title: "Dashboard | CloudShare",
  description: "Manage your files and folders.",
};

export default function DashboardPage() {
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
          <Button>
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Create Folder</span>
          </Button>
        </div>
      </section>

      <FolderList />
    </div>
  );
}
