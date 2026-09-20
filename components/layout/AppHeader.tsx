"use client";

import Link from "next/link";
import Image from "next/image";
import { Cloud } from "lucide-react";
import { useCurrentUser } from "@/lib/hooks/use-current-user";

export function AppHeader() {
  const { data: user, isLoading } = useCurrentUser();

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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

          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
              <div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse" />
            </div>
          ) : (
            <Link href="/profile" className="flex items-center gap-3 group">
              <span className="text-sm font-medium text-slate-700 hidden sm:block">
                Welcome, {user?.fullName ?? "there"}
              </span>
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.fullName}
                  width={32}
                  height={32}
                  className="rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-200"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 ring-2 ring-transparent">
                  {user?.fullName?.charAt(0).toUpperCase() ?? "?"}
                </div>
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
