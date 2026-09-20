import { FolderList } from "./_components/FolderList";
import { CreateFolderModal } from "./_components/CreateFolderModal";

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
          <CreateFolderModal />
        </div>
      </section>

      <FolderList />
    </div>
  );
}
