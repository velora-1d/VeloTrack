"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    TrendingUp,
    ArrowDownToLine,
    ArrowUpFromLine,
    Percent,
    Search,
    X,
    Briefcase,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    SearchX
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface ProfitClientProps {
    summary: {
        totalIncome: number;
        totalExpense: number;
        profit: number;
        margin: number;
    };
    projects: {
        id: string;
        name: string;
        status: string;
        income: number;
        expense: number;
        profit: number;
        margin: number;
    }[];
}

export function ProfitClient({ summary, projects }: ProfitClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State for Filter
    const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
    const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

    const updateQueryParams = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (startDate) params.set("startDate", startDate); else params.delete("startDate");
        if (endDate) params.set("endDate", endDate); else params.delete("endDate");
        router.push(`?${params.toString()}`);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/20">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Analisis Profit</h1>
                        <p className="text-sm text-zinc-500">Evaluasi margin keuntungan bersih per proyek dan periode.</p>
                    </div>
                </div>

                {/* Date Filter */}
                <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-2 px-2">
                        <Calendar className="w-4 h-4 text-zinc-400" />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-transparent border-none text-xs focus:ring-0 dark:text-white outline-none"
                        />
                        <span className="text-zinc-300">-</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-transparent border-none text-xs focus:ring-0 dark:text-white outline-none"
                        />
                    </div>
                    <button
                        onClick={updateQueryParams}
                        className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-xs font-bold hover:opacity-90"
                    >
                        Filter
                    </button>
                    {(startDate || endDate) && (
                        <button
                            onClick={() => {
                                setStartDate("");
                                setEndDate("");
                                router.push("/profit");
                            }}
                            className="p-2 text-zinc-400 hover:text-rose-500"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Income */}
                <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-[42px] h-[42px] rounded-[14px] bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                            <ArrowDownToLine className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                        </div>
                    </div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Pemasukan</p>
                    <h2 className="text-xl font-black text-zinc-900 dark:text-white">{formatCurrency(summary.totalIncome)}</h2>
                </div>

                {/* Total Expense */}
                <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-[42px] h-[42px] rounded-[14px] bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                            <ArrowUpFromLine className="w-5 h-5 text-rose-600 dark:text-rose-500" />
                        </div>
                    </div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Pengeluaran</p>
                    <h2 className="text-xl font-black text-zinc-900 dark:text-white">{formatCurrency(summary.totalExpense)}</h2>
                </div>

                {/* Net Profit */}
                <div className="bg-zinc-900 dark:bg-white p-6 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-none">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-[42px] h-[42px] rounded-[14px] bg-white/10 dark:bg-zinc-100 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white dark:text-zinc-900" />
                        </div>
                        <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${summary.profit >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                            {summary.profit >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {summary.profit >= 0 ? "SURPLUS" : "DEFISIT"}
                        </div>
                    </div>
                    <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Laba Bersih</p>
                    <h2 className="text-xl font-black text-white dark:text-zinc-900">{formatCurrency(summary.profit)}</h2>
                </div>

                {/* Margin */}
                <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-[42px] h-[42px] rounded-[14px] bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
                            <Percent className="w-5 h-5 text-violet-600 dark:text-violet-500" />
                        </div>
                    </div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Margin Keuntungan</p>
                    <h2 className="text-xl font-black text-zinc-900 dark:text-white">{summary.margin.toFixed(1)}%</h2>
                </div>
            </div>

            {/* Profit per Project Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-zinc-900 dark:text-white">Performa per Project</h3>
                        <p className="text-xs text-zinc-500 mt-1">Daftar kontribusi laba dari setiap proyek aktif.</p>
                    </div>
                </div>

                {projects.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <SearchX className="w-12 h-12 text-zinc-300 mb-3" />
                        <p className="text-sm text-zinc-500 font-medium">Belum ada data project untuk periode ini.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead>
                                <tr className="bg-zinc-50/50 dark:bg-zinc-800/30 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800">
                                    <th className="py-4 px-6">Nama Project</th>
                                    <th className="py-4 px-6">Income</th>
                                    <th className="py-4 px-6">Expense</th>
                                    <th className="py-4 px-6">Profit Project</th>
                                    <th className="py-4 px-6">Margin</th>
                                    <th className="py-4 px-6 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
                                {projects.map((p) => (
                                    <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors group">
                                        <td className="py-5 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
                                                    <Briefcase className="w-4 h-4 text-violet-600 dark:text-violet-500" />
                                                </div>
                                                <span className="text-[14px] font-bold text-zinc-900 dark:text-white">{p.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 text-[14px] text-zinc-600 dark:text-zinc-400 font-medium">{formatCurrency(p.income)}</td>
                                        <td className="py-5 px-6 text-[14px] text-zinc-600 dark:text-zinc-400 font-medium">{formatCurrency(p.expense)}</td>
                                        <td className="py-5 px-6">
                                            <span className={`text-[15px] font-black ${p.profit >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"}`}>
                                                {formatCurrency(p.profit)}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 w-16 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${p.margin >= 30 ? "bg-emerald-500" : p.margin >= 10 ? "bg-amber-500" : "bg-rose-500"}`}
                                                        style={{ width: `${Math.min(Math.max(p.margin, 0), 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-zinc-500">{p.margin.toFixed(0)}%</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <span className={`px-2 py-1 rounded-lg text-[10px] font-black tracking-tight border uppercase ${p.status === "DONE"
                                                    ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-600 dark:text-emerald-500"
                                                    : p.status === "ON_PROGRESS"
                                                        ? "bg-blue-400/10 border-blue-400/20 text-blue-600 dark:text-blue-500"
                                                        : "bg-zinc-100 border-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:border-zinc-700"
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
