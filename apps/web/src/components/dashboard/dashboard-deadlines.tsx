"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, AlertTriangle, ArrowRight, CheckCircle2, ExternalLink, PartyPopper } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { id } from "date-fns/locale";

type ProjectDeadline = {
    id: string;
    name: string;
    clientName: string;
    deadline: Date;
    status: "TODO" | "ON_PROGRESS" | "DONE" | "OVERDUE";
}

const listVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export function DashboardDeadlines({ projects, isLoading }: { projects: ProjectDeadline[], isLoading?: boolean }) {

    if (isLoading) {
        return (
            <div className="glass-card rounded-2xl p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                    <div className="w-36 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/30">
                            <div className="w-1 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                            <div className="flex-1 space-y-2">
                                <div className="w-32 h-3.5 bg-zinc-200 dark:bg-zinc-700 rounded" />
                                <div className="w-24 h-3 bg-zinc-200 dark:bg-zinc-700 rounded" />
                            </div>
                            <div className="w-20 h-6 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!projects || projects.length === 0) {
        return (
            <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Clock className="w-4.5 h-4.5 text-white" strokeWidth={2} />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-200 tracking-tight">Deadline Terdekat</h3>
                </div>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold">Tidak ada project mendekati deadline.</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 flex items-center justify-center gap-1.5">
                        Semua berjalan sesuai jadwal <PartyPopper className="w-3.5 h-3.5 text-amber-500" />
                    </p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="glass-card gradient-border rounded-2xl p-5 transition-all duration-300 h-full overflow-hidden relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Background glow */}
            <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-amber-500 blur-3xl opacity-0 group-hover:opacity-10 transition-all duration-700 pointer-events-none" />

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 group-hover:opacity-80 transition-opacity duration-500" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Clock className="w-4.5 h-4.5 text-white" strokeWidth={2} />
                        </div>
                        <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-200 tracking-tight">Deadline Terdekat</h3>
                    </div>
                    <Link
                        href="/projects"
                        className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                        Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <motion.div className="space-y-2" variants={listVariants} initial="hidden" animate="visible">
                    {projects.map((project) => {
                        const daysLeft = differenceInDays(new Date(project.deadline), new Date());
                        const isOverdue = daysLeft < 0 || project.status === "OVERDUE";
                        const isUrgent = daysLeft >= 0 && daysLeft <= 3;

                        const barGradient = isOverdue
                            ? "from-rose-500 to-red-600"
                            : isUrgent
                                ? "from-amber-400 to-orange-500"
                                : "from-blue-500 to-indigo-600";

                        let badge;
                        if (isOverdue) {
                            badge = (
                                <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-500/10 to-red-500/10 text-rose-500 border border-rose-500/20">
                                    <AlertTriangle className="w-3 h-3" />
                                    {Math.abs(daysLeft)}h lalu
                                </span>
                            );
                        } else if (isUrgent) {
                            badge = (
                                <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-500 border border-amber-500/20">
                                    <Clock className="w-3 h-3" />
                                    {daysLeft}h lagi
                                </span>
                            );
                        } else {
                            badge = (
                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50">
                                    {daysLeft}h lagi
                                </span>
                            );
                        }

                        return (
                            <motion.div key={project.id} variants={itemVariants}>
                                <Link
                                    href={`/projects/${project.id}`}
                                    className="group/item flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-all duration-200"
                                >
                                    {/* Urgency bar — gradient */}
                                    <div className={`w-1 h-10 rounded-full bg-gradient-to-b ${barGradient} shrink-0 transition-all group-hover/item:h-12 group-hover/item:shadow-lg`} />

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 truncate group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                                            {project.name}
                                        </p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{project.clientName}</span>
                                            <span className="text-[8px] text-zinc-300 dark:text-zinc-700">•</span>
                                            <span className="text-xs text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                                                {format(new Date(project.deadline), "d MMM yyyy", { locale: id })}
                                            </span>
                                        </div>
                                    </div>

                                    {badge}
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </motion.div>
    );
}
