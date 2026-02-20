"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Bell, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  userName: string;
  userRole: string;
}

export function Header({ userName, userRole }: HeaderProps) {
  return (
    <header className="h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-30">

      {/* Left side: Mobile menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button className="lg:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:flex max-w-md w-full">
          <div className="relative w-full group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder="Cari lead, proyek, atau laporan..."
              className="h-9 w-full bg-zinc-100 dark:bg-zinc-900 border-transparent rounded-lg pl-9 pr-4 text-sm focus:bg-white dark:focus:bg-zinc-950 focus:border-zinc-300 dark:focus:border-zinc-700 focus:ring-0 outline-none transition-all placeholder:text-zinc-500 text-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-3">
        <button className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950" />
        </button>

        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

        <ThemeToggle />

        <div className="ml-2 flex items-center gap-3 cursor-pointer p-1 pr-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-300 dark:border-zinc-700">
            {/* Placeholder Profile Picture */}
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
              {userName.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight">{userName}</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">
              {userRole === "OWNER" ? "Administrator" : "Mitra"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
