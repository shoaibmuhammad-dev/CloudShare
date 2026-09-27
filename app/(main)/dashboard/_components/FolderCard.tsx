import { Folder, MoreVertical, Users } from "lucide-react";
import Link from "next/link";
import CardActionsDropdown from "./CardActionsDropdown";
import type { FolderItem } from "@/lib/hooks/useFolders";

interface FolderProps {
  id: number;
  name: string;
  items: number;
  size: string;
  shared: boolean;
  lastModified: string;
}

export default function FolderCard({ folder }: { folder: FolderProps }) {
  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md cursor-pointer min-h-60">
      <div className="flex items-start justify-between">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
          <Folder className="h-6 w-6 fill-current opacity-20" />
          <Folder className="absolute h-6 w-6" />
        </div>
        <CardActionsDropdown />
      </div>

      <div className="mt-5">
        <Link href={`/dashboard/${folder.id}`}>
          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 hover:underline">
            {folder.name}
          </h3>
        </Link>
        <div className="mt-1.5 flex items-center text-xs text-slate-500 space-x-2">
          <span>{folder.items} items</span>
          <span className="text-slate-300">&bull;</span>
          <span>{folder.size}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="text-xs text-slate-400">
          Modified {folder.lastModified}
        </div>
        {folder.shared && (
          <div
            title="Shared Folder"
            className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-100"
          >
            <Users className="h-3.5 w-3.5 text-slate-500" />
          </div>
        )}
      </div>
    </div>
  );
}
