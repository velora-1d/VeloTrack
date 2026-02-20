"use client";

import React from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
    Pencil,
    Trash2,
    Calendar,
    Briefcase,
    ChevronLeft,
    ChevronRight,
    SearchX,
    Building2
} from "lucide-react";

export type ExpenseData = {
    id: string;
    date: Date;
    category: string;
    amount: number;
    notes: string | null;
    projectId: string | null;
    createdAt: Date;
    project?: {
        name: string;
    } | null;
};

interface ExpenseTableProps {
    data: ExpenseData[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onEdit: (expense: ExpenseData) => void;
    onDelete: (id: string, category: string) => void;
}

export function ExpenseTable({
    data,
    currentPage,
    totalPages,
    onPageChange,
    onEdit,
    onDelete
}: ExpenseTableProps) {

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                    <SearchX className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Tidak ada data ditemukan</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-sm">
                    Belum ada data pengeluaran yang tercatat atau coba sesuaikan filter Anda.
                </p>
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                    <thead>
                        <tr className="border-b border-zinc-200/50 dark:border-zinc-800/50 uppercase text-[10px] font-extrabold tracking-widest text-zinc-500 dark:text-zinc-400">
                            <th className="py-4 px-5">Tanggal</th>
                            <th className="py-4 px-5">Kategori</th>
                            <th className="py-4 px-5">Project / Keperluan</th>
                            <th className="py-4 px-5">Nominal</th>
                            <th className="py-4 px-5">Keterangan</th>
                            <th className="py-4 px-5 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200/30 dark:divide-zinc-800/30">
                        {data.map((expense) => (
                            <tr key={expense.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                                <td className="py-4 px-5">
                                    <div className="flex flex-col">
                                        <span className="text-[14px] font-bold text-zinc-900 dark:text-white">
                                            {format(new Date(expense.date), "dd MMM yyyy", { locale: localeId })}
                                        </span>
                                        <span className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> Input: {format(new Date(expense.createdAt), "dd/MM/yy")}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 px-5">
                                    <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-400/10 border border-rose-400/20 text-rose-600 dark:text-rose-500 uppercase tracking-tight">
                                        {expense.category}
                                    </span>
                                </td>
                                <td className="py-4 px-5">
                                    {expense.project ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                                                <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <span className="text-[13px] font-bold text-zinc-900 dark:text-white truncate max-w-[150px]">
                                                {expense.project.name}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                                                <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                                            </div>
                                            <span className="text-[13px] font-medium text-zinc-500">
                                                Operasional Umum
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 px-5">
                                    <span className="text-[14px] font-black text-rose-600 dark:text-rose-400">
                                        {formatCurrency(expense.amount)}
                                    </span>
                                </td>
                                <td className="py-4 px-5">
                                    <p className="text-[12px] text-zinc-500 max-w-[200px] truncate" title={expense.notes || ""}>
                                        {expense.notes || "-"}
                                    </p>
                                </td>
                                <td className="py-4 px-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(expense)}
                                            className="px-2.5 py-1.5 min-h-[32px] bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-amber-500/20 transition-all flex items-center gap-1.5"
                                        >
                                            <Pencil className="w-3.5 h-3.5" /> Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(expense.id, expense.category)}
                                            className="px-2.5 py-1.5 min-h-[32px] bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-rose-500/20 transition-all flex items-center gap-1.5"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 px-2">
                    <span className="text-xs text-zinc-500 font-medium">
                        Halaman {currentPage} dari {totalPages}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
