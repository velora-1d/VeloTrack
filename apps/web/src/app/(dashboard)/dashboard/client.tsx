"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { DashboardSummary } from "@/components/dashboard/dashboard-summary";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { DashboardDeadlines } from "@/components/dashboard/dashboard-deadlines";
import { DashboardFilter, PeriodFilter } from "@/components/dashboard/dashboard-filter";
import { getDashboardSummary, getDashboardCharts, getUpcomingDeadlines } from "@/lib/actions/dashboard";
import { BarChart3 } from "lucide-react";

interface DashboardClientProps {
    initialSummary: any;
    initialCharts: any;
    initialDeadlines: any;
    projectsList: { id: string, name: string }[];
    userRole?: string;
    mitraId?: string;
}

export function DashboardClient({
    initialSummary,
    initialCharts,
    initialDeadlines,
    projectsList,
    userRole = "OWNER",
    mitraId
}: DashboardClientProps) {

    const [isPending, startTransition] = useTransition();

    const [summary, setSummary] = useState(initialSummary);
    const [charts, setCharts] = useState(initialCharts);
    const [deadlines, setDeadlines] = useState(initialDeadlines);

    const handleFilterChange = async (period: PeriodFilter, projectId?: string) => {
        startTransition(async () => {
            const [newSummary, newCharts, newDeadlines] = await Promise.all([
                getDashboardSummary(period, projectId, mitraId),
                getDashboardCharts(period, projectId, mitraId),
                getUpcomingDeadlines(projectId, mitraId)
            ]);

            setSummary(newSummary);
            setCharts(newCharts);
            setDeadlines(newDeadlines);
        });
    };

    return (
        <div className="space-y-8">
            {/* Filter Bar */}
            <DashboardFilter
                onFilterChange={handleFilterChange}
                projects={projectsList}
                isLoading={isPending}
            />

            {/* KPI Cards — 12 kartu */}
            <DashboardSummary data={summary} isLoading={isPending} />

            {userRole === "OWNER" && (
                <>
                    {/* Charts Section Header — Premium */}
                    <motion.div
                        className="flex items-center gap-3 pt-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                    >
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-500 to-zinc-700 dark:from-zinc-400 dark:to-zinc-600 flex items-center justify-center shadow-lg">
                            <BarChart3 className="w-4 h-4 text-white" strokeWidth={2} />
                        </div>
                        <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                            Analitik & Grafik
                        </h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-zinc-400 to-transparent opacity-10" />
                    </motion.div>

                    {/* Charts Grid — 3×2 (6 chart) */}
                    <DashboardCharts
                        lineChartData={charts.lineChartData}
                        barChartData={charts.barChartData}
                        projectPieData={charts.projectPieData}
                        leadPieData={charts.leadPieData}
                        expenseCategoryData={charts.expenseCategoryData}
                        isLoading={isPending}
                    />
                </>
            )}

            {/* Deadline Section — Full Width */}
            <DashboardDeadlines projects={deadlines} isLoading={isPending} />
        </div>
    );
}
