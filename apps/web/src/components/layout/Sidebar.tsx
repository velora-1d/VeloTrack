"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Briefcase,
  FolderOpen,
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  FileText,
  Settings,
  LogOut,
  Zap,
  ChevronRight
} from "lucide-react";
import { logoutUser } from "@/app/login/actions";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const OWNER_MENU = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, gradient: "from-blue-500 to-indigo-500", glow: "59,130,246" },
    ]
  },
  {
    title: "Leads & Mitra",
    items: [
      { name: "Semua Leads", href: "/leads", icon: Users, gradient: "from-amber-400 to-orange-500", glow: "245,158,11" },
      { name: "Daftar Mitra", href: "/mitra", icon: UserCheck, gradient: "from-sky-400 to-cyan-500", glow: "14,165,233" },
    ]
  },
  {
    title: "Projects",
    items: [
      { name: "Semua Project", href: "/projects", icon: Briefcase, gradient: "from-violet-500 to-purple-600", glow: "139,92,246" },
    ]
  },
  {
    title: "Keuangan",
    items: [
      { name: "Pemasukan", href: "/finance/income", icon: ArrowDownToLine, gradient: "from-emerald-500 to-green-600", glow: "16,185,129" },
      { name: "Pengeluaran", href: "/finance/expense", icon: ArrowUpFromLine, gradient: "from-rose-500 to-pink-600", glow: "244,63,94" },
      { name: "Profit", href: "/profit", icon: TrendingUp, gradient: "from-violet-500 to-indigo-600", glow: "139,92,246" },
    ]
  },
  {
    title: "Sistem",
    items: [
      { name: "Laporan", href: "/reports", icon: FileText, gradient: "from-sky-500 to-blue-600", glow: "14,165,233" },
      { name: "Pengaturan", href: "/settings", icon: Settings, gradient: "from-zinc-400 to-zinc-600", glow: "161,161,170" },
    ]
  }
];

const MITRA_MENU = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, gradient: "from-blue-500 to-indigo-500", glow: "59,130,246" },
    ]
  },
  {
    title: "Pekerjaan",
    items: [
      { name: "Leads Saya", href: "/leads", icon: Users, gradient: "from-amber-400 to-orange-500", glow: "245,158,11" },
      { name: "Project Saya", href: "/projects", icon: Briefcase, gradient: "from-violet-500 to-purple-600", glow: "139,92,246" },
    ]
  }
];

interface SidebarProps {
  userRole: string;
  userName: string;
  userEmail: string | null;
}

export function Sidebar({ userRole, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();

  const menuGroups = userRole === "OWNER" ? OWNER_MENU : MITRA_MENU;

  return (
    <aside className="w-[260px] h-screen flex flex-col fixed left-0 top-0 z-40 bg-[#0c0c0f] dark:bg-[#0c0c0f] border-r border-white/[0.04]">

      {/* ═══ Brand Logo ═══ */}
      <div className="h-[68px] flex items-center px-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[14px] flex items-center justify-center mr-3 shadow-lg shadow-blue-500/25">
          <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-[17px] text-white tracking-tight leading-tight">
            Velo<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Track</span>
          </span>
          <span className="text-[10px] text-zinc-600 font-medium tracking-wider uppercase">Management</span>
        </div>
      </div>

      {/* ═══ Divider subtle ═══ */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* ═══ Navigation ═══ */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
        {menuGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            {/* Category Header */}
            <div className="px-3 mb-2.5">
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.18em]">
                {group.title}
              </span>
            </div>

            {/* Menu Items */}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group relative focus:outline-none focus:ring-0 outline-none hover:no-underline no-underline decoration-transparent border-none",
                      isActive
                        ? "text-white"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]"
                    )}
                  >
                    {/* Active background glow */}
                    {isActive && (
                      <div
                        className="absolute inset-0 rounded-xl opacity-100"
                        style={{
                          background: `linear-gradient(135deg, rgba(${item.glow}, 0.12) 0%, rgba(${item.glow}, 0.04) 100%)`,
                          border: `1px solid rgba(${item.glow}, 0.15)`,
                        }}
                      />
                    )}

                    {/* Active left bar */}
                    {isActive && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                        style={{
                          background: `linear-gradient(to bottom, rgba(${item.glow}, 1), rgba(${item.glow}, 0.5))`,
                          boxShadow: `0 0 8px rgba(${item.glow}, 0.4)`,
                        }}
                      />
                    )}

                    {/* Icon */}
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center mr-3 shrink-0 transition-all duration-200 relative z-10",
                      isActive
                        ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                        : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                    )}
                      style={isActive ? { boxShadow: `0 4px 12px rgba(${item.glow}, 0.3)` } : {}}
                    >
                      <Icon className={cn(
                        "w-[15px] h-[15px] transition-colors relative z-10",
                        isActive
                          ? "text-white"
                          : "text-zinc-500 group-hover:text-zinc-400"
                      )} strokeWidth={isActive ? 2.2 : 1.8} />
                    </div>

                    {/* Label */}
                    <span className="relative z-10 flex-1">{item.name}</span>

                    {/* Arrow on hover (tidak aktif) */}
                    {!isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-700 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1 group-hover:translate-x-0 relative z-10" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Divider ═══ */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* ═══ User Profile + Logout ═══ */}
      <div className="p-4 space-y-3">
        {/* User Info */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/20">
            {userName.substring(0, 1).toUpperCase()}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[13px] font-semibold text-zinc-200 truncate">{userName}</span>
            <span className="text-[11px] text-zinc-600 truncate">{userEmail || "Tamu"}</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            if (window.confirm("Apakah Anda yakin ingin keluar?")) {
              logoutUser();
            }
          }}
          className="flex items-center w-full px-3 py-2 rounded-xl text-[13px] font-medium text-zinc-600 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-200 group"
        >
          <div className="w-7 h-7 rounded-lg bg-white/[0.03] group-hover:bg-red-500/10 flex items-center justify-center mr-3 transition-all">
            <LogOut className="w-3.5 h-3.5 text-zinc-600 group-hover:text-red-400" strokeWidth={2} />
          </div>
          Keluar
        </button>
      </div>
    </aside>
  );
}
