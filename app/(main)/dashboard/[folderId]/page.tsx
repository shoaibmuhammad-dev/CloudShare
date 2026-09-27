import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { FileList } from "./_components/FileList";
import ButtonMenu from "./_components/ButtonMenu";

const FOLDERS: Record<string, string> = {
  "1": "Design Assets",
  "2": "Project Documents",
  "3": "Marketing Campaigns",
  "4": "Financial Reports",
  "5": "Client Presentations",
  "6": "Personal Backups",
};

interface FolderPageProps {
  params: Promise<{
    folderId: string;
  }>;
}

export async function generateMetadata({
  params,
}: FolderPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const folderName = FOLDERS[resolvedParams.folderId] || "Folder";

  return {
    title: `${folderName} | CloudShare`,
    description: `View files in ${folderName}`,
  };
}

export default async function FolderPage({ params }: FolderPageProps) {
  const resolvedParams = await params;

  const folderName = FOLDERS[resolvedParams.folderId] || "Unknown Folder";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center text-2xl font-bold tracking-tight">
            <Link
              href="/dashboard"
              className="text-slate-500 hover:text-blue-600 transition-colors"
            >
              Folders
            </Link>

            <ChevronRight className="h-6 w-6 text-slate-300 mx-1 shrink-0" />

            <span className="text-slate-900 truncate max-w-50 sm:max-w-md">
              {folderName}
            </span>
          </div>

          <p className="text-sm text-slate-500 mt-1">
            Manage files within this folder.
          </p>
        </div>

        <ButtonMenu />
      </div>

      <FileList />
    </div>
  );
}
