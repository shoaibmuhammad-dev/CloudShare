import Link from "next/link";
import { Cloud, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + User Name */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm shadow-blue-200">
                <Cloud className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 hidden sm:block">
                CloudShare
              </span>
            </Link>
            <div className="hidden sm:block w-px h-6 bg-slate-200"></div>
          </div>
          <div className="text-sm font-medium text-slate-700">
            Welcome, John Doe
          </div>

          {/* Right: Create Folder Button */}
          {/* <div>
            <Button>
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Create Folder</span>
            </Button>
          </div> */}
        </div>
      </div>
    </header>
  );
}
