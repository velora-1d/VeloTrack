"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Users,
    Clock,
    CheckCircle2,
    XCircle,
    FolderKanban,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    UserCheck,
    Receipt,
    FolderCheck,
    Target,
    Briefcase,
    Coins
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface DashboardSummaryProps {
    data?: {
        totalLeads: number;
        leadsPending: number;
        leadsDeal: number;
        leadsCancel: number;
        totalProjects: number;
        projectOverdue: number;
        projectDone: number;
        totalMitra: number;
        totalIncome: number;
        totalExpense: number;
        totalFee: number;
        netProfit: number;
    };
    isLoading?: boolean;
}

type CardConfig = {
    title: string;
    value: string | number;
    icon: any;
    gradient: string;
    iconColor: string;
    glowColor: string;
    href?: string;
};

type GroupConfig = {
    label: string;
    groupIcon: any;
    accentGradient: string;
    cards: CardConfig[];
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.1 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring" as const, stiffness: 300, damping: 24 }
    }
};

export function DashboardSummary({ data, isLoading }: DashboardSummaryProps) {

    if (isLoading || !data) {
        return (
            <div className="space-y-8">
                {[1, 2, 3].map(g => (
                    <div key={g} className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                            <div className="w-20 h-4 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="rounded-2xl p-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/40 animate-pulse">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-11 h-11 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="w-20 h-3 rounded bg-zinc-200 dark:bg-zinc-800" />
                                        <div className="w-28 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const groups: GroupConfig[] = [
        {
            label: "Leads",
            groupIcon: Target,
            accentGradient: "from-blue-500 to-cyan-500",
            cards: [
                { title: "Total Leads", value: data.totalLeads, icon: Users, gradient: "from-blue-500 to-blue-600", iconColor: "text-white", glowColor: "rgba(59,130,246,0.15)", href: "/leads" },
                { title: "Pending", value: data.leadsPending, icon: Clock, gradient: "from-amber-400 to-orange-500", iconColor: "text-white", glowColor: "rgba(245,158,11,0.15)", href: "/leads?status=PENDING" },
                { title: "Deal", value: data.leadsDeal, icon: CheckCircle2, gradient: "from-emerald-400 to-emerald-600", iconColor: "text-white", glowColor: "rgba(16,185,129,0.15)", href: "/leads?status=DEAL" },
                { title: "Cancel", value: data.leadsCancel, icon: XCircle, gradient: "from-rose-400 to-rose-600", iconColor: "text-white", glowColor: "rgba(244,63,94,0.15)", href: "/leads?status=CANCEL" },
            ]
        },
        {
            label: "Projects",
            groupIcon: Briefcase,
            accentGradient: "from-indigo-500 to-violet-500",
            cards: [
                { title: "Total Aktif", value: data.totalProjects, icon: FolderKanban, gradient: "from-indigo-500 to-indigo-600", iconColor: "text-white", glowColor: "rgba(99,102,241,0.15)", href: "/projects" },
                { title: "Overdue", value: data.projectOverdue, icon: AlertTriangle, gradient: "from-red-400 to-rose-600", iconColor: "text-white", glowColor: "rgba(239,68,68,0.15)", href: "/projects?status=OVERDUE" },
                { title: "Selesai", value: data.projectDone, icon: FolderCheck, gradient: "from-teal-400 to-teal-600", iconColor: "text-white", glowColor: "rgba(20,184,166,0.15)", href: "/projects?status=DONE" },
                { title: "Total Mitra", value: data.totalMitra, icon: UserCheck, gradient: "from-cyan-400 to-cyan-600", iconColor: "text-white", glowColor: "rgba(6,182,212,0.15)", href: "/settings" },
            ]
        },
        {
            label: "Keuangan",
            groupIcon: Coins,
            accentGradient: "from-emerald-500 to-green-500",
            cards: [
                { title: "Pemasukan", value: formatRupiah(data.totalIncome), icon: ArrowUpRight, gradient: "from-emerald-500 to-green-600", iconColor: "text-white", glowColor: "rgba(16,185,129,0.15)", href: "/finance/income" },
                { title: "Pengeluaran", value: formatRupiah(data.totalExpense), icon: ArrowDownRight, gradient: "from-rose-500 to-pink-600", iconColor: "text-white", glowColor: "rgba(244,63,94,0.15)", href: "/finance/expense" },
                { title: "Total Fee", value: formatRupiah(data.totalFee), icon: Receipt, gradient: "from-violet-500 to-purple-600", iconColor: "text-white", glowColor: "rgba(139,92,246,0.15)" },
                { title: "Profit Bersih", value: formatRupiah(data.netProfit), icon: Wallet, gradient: data.netProfit >= 0 ? "from-emerald-500 to-teal-600" : "from-rose-500 to-red-600", iconColor: "text-white", glowColor: data.netProfit >= 0 ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)", href: "/profit" },
            ]
        }
    ];

    return (
        <div className="space-y-8">
            {groups.map((group, groupIndex) => (
                <div key={group.label} className="space-y-4">
                    {/* Group Header */}
                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: groupIndex * 0.1, duration: 0.4 }}
                    >
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${group.accentGradient} flex items-center justify-center text-sm shadow-lg`}>
                            <group.groupIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-sm font-extrabold uppercase tracking-[0.15em] text-zinc-600 dark:text-zinc-400">
                            {group.label}
                        </h3>
                    </motion.div>

                    {/* Cards Grid */}
                    <motion.div
                        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {group.cards.map((card) => {
                            const Icon = card.icon;
                            const isLink = !!card.href;

                            const cardContent = (
                                <motion.div
                                    variants={cardVariants}
                                    whileHover={{ y: -3, transition: { duration: 0.25 } }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative rounded-2xl p-5 cursor-pointer transition-all duration-300 overflow-hidden bg-white/60 dark:bg-zinc-900/50 border border-zinc-200/40 dark:border-zinc-800/40 hover:bg-white/90 dark:hover:bg-zinc-900/70 hover:border-zinc-200/70 dark:hover:border-zinc-700/50 hover:shadow-xl hover:shadow-zinc-200/30 dark:hover:shadow-black/20"
                                >
                                    {/* Subtle corner glow */}
                                    <div
                                        className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-500 pointer-events-none"
                                        style={{ backgroundColor: card.glowColor }}
                                    />

                                    <div className="relative z-10">
                                        {/* Icon + Label — horizontal (sama seperti chart card) */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg shrink-0 transition-transform duration-300 group-hover:scale-105`}
                                                style={{ boxShadow: `0 4px 12px ${card.glowColor}` }}
                                            >
                                                <Icon className={`w-4 h-4 ${card.iconColor}`} strokeWidth={2} />
                                            </div>
                                            <span className="text-[14px] font-bold text-zinc-600 dark:text-zinc-300 tracking-tight leading-tight">
                                                {card.title}
                                            </span>

                                            {isLink && (
                                                <div className="ml-auto w-6 h-6 rounded-md bg-zinc-100/60 dark:bg-zinc-800/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0">
                                                    <ArrowUpRight className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Value */}
                                        <p className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-none mt-1">
                                            {card.value}
                                        </p>
                                    </div>
                                </motion.div>
                            );

                            if (isLink) {
                                return (
                                    <Link key={card.title} href={card.href!} className="block focus:outline-none focus:ring-0 outline-none hover:no-underline no-underline decoration-transparent border-none">
                                        {cardContent}
                                    </Link>
                                );
                            }

                            return <div key={card.title}>{cardContent}</div>;
                        })}
                    </motion.div>
                </div>
            ))}
        </div>
    );
}
