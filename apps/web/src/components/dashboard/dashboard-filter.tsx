"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ChevronDown, Filter } from "lucide-react";

export type PeriodFilter = "today" | "week" | "month" | "year" | "all";

interface DashboardFilterProps {
    onFilterChange: (period: PeriodFilter, projectId?: string) => void;
    projects?: { id: string; name: string }[];
    isLoading?: boolean;
}

const PERIOD_OPTIONS: { value: PeriodFilter; label: string }[] = [
    { value: "today", label: "Hari Ini" },
    { value: "week", label: "Minggu Ini" },
    { value: "month", label: "Bulan Ini" },
    { value: "year", label: "Tahun Ini" },
    { value: "all", label: "Semua" },
];

export function DashboardFilter({ onFilterChange, projects = [], isLoading }: DashboardFilterProps) {
    const [period, setPeriod] = useState<PeriodFilter>("month");
    const [projectId, setProjectId] = useState<string>("all");

    const handlePeriodChange = (newPeriod: PeriodFilter) => {
        setPeriod(newPeriod);
        onFilterChange(newPeriod, projectId === "all" ? undefined : projectId);
    };

    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newProjectId = e.target.value;
        setProjectId(newProjectId);
        onFilterChange(period, newProjectId === "all" ? undefined : newProjectId);
    };

    return (
        <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {/* Pill Tabs — Glassmorphism */}
            <div className="glass-card flex items-center gap-1 p-1.5 rounded-2xl">
                {PERIOD_OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => handlePeriodChange(opt.value)}
                        disabled={isLoading}
                        className={`
                            relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 whitespace-nowrap
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${period === opt.value
                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60"
                            }
                        `}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Project Dropdown — Glassmorphism */}
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Filter className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                </div>
                <select
                    title="Filter Project"
                    value={projectId}
                    onChange={handleProjectChange}
                    disabled={isLoading}
                    className="glass-card appearance-none pl-9 pr-9 py-2.5 text-sm font-semibold rounded-xl text-zinc-700 dark:text-zinc-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 outline-none disabled:opacity-50 min-w-[180px] transition-all cursor-pointer"
                >
                    <option value="all">Semua Project</option>
                    {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                </div>
            </div>
        </motion.div>
    );
}
