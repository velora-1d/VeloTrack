"use client";

import React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
    MoreVertical,
    CheckCircle2,
    Clock,
    XCircle,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal
} from "lucide-react";

export type LeadData = {
    id: string;
    name: string;
    contact: string;
    source: string | null;
    status: "PENDING" | "DEAL" | "CANCEL";
    createdAt: Date;
    updatedAt: Date;
    project?: { id: string } | null;
    mitra?: { name: string } | null;
};

interface LeadsTableProps {
    data: LeadData[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onViewDetail: (leadId: string) => void;
    onChangeStatus: (leadId: string, currentStatus: string, currentName: string) => void;
    onConvertToProject: (leadId: string, currentName: string) => void;
    onDeleteLead: (leadId: string, name: string) => void;
}

const statusConfig = {
    PENDING: {
        label: "Pending",
        icon: Clock,
        bg: "bg-amber-400/10 dark:bg-amber-500/10",
        text: "text-amber-600 dark:text-amber-500",
        border: "border-amber-400/20 dark:border-amber-500/20",
    },
    DEAL: {
        label: "Deal",
        icon: CheckCircle2,
        bg: "bg-emerald-400/10 dark:bg-emerald-500/10",
        text: "text-emerald-600 dark:text-emerald-500",
        border: "border-emerald-400/20 dark:border-emerald-500/20",
    },
    CANCEL: {
        label: "Cancel",
        icon: XCircle,
        bg: "bg-rose-400/10 dark:bg-rose-500/10",
        text: "text-rose-600 dark:text-rose-500",
        border: "border-rose-400/20 dark:border-rose-500/20",
    },
};

export function LeadsTable({
    data,
    currentPage,
    totalPages,
    onPageChange,
    onViewDetail,
    onChangeStatus,
    onConvertToProject,
    onDeleteLead
}: LeadsTableProps) {

    // Jika tidak ada data
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                    <XCircle className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Tidak ada Lead ditemukan</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-sm">
                    Coba sesuaikan filter pencarian, status, atau tambah data lead baru.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                    <thead>
                        <tr className="border-b border-zinc-200/50 dark:border-zinc-800/50 uppercase text-[10px] font-extrabold tracking-widest text-zinc-500 dark:text-zinc-400">
                            <th className="py-4 px-5">Nama / Kontak</th>
                            <th className="py-4 px-5 min-w-[120px]">Sumber</th>
                            <th className="py-4 px-5">Status</th>
                            <th className="py-4 px-5">Terakhir Update</th>
                            <th className="py-4 px-5 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200/30 dark:divide-zinc-800/30">
                        {data.map((lead) => {
                            const statusCfg = statusConfig[lead.status];
                            const StatusIcon = statusCfg.icon;

                            return (
                                <tr key={lead.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                                    <td className="py-4 px-5">
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-bold text-zinc-900 dark:text-white">{lead.name}</span>
                                            <span className="text-[12px] text-zinc-500 mt-0.5">{lead.contact || "Tidak ada kontak"}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5">
                                        <div className="flex flex-col gap-1.5 items-start">
                                            <span className="inline-flex px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg text-xs font-medium border border-zinc-200/50 dark:border-zinc-700/50">
                                                {lead.source || "Manual"}
                                            </span>
                                            {lead.mitra ? (
                                                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">
                                                    PIC: {lead.mitra.name}
                                                </span>
                                            ) : (
                                                <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                                                    PIC: Owner
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-5">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${statusCfg.bg} ${statusCfg.border} ${statusCfg.text}`}>
                                            <StatusIcon className="w-3.5 h-3.5" />
                                            <span className="text-xs font-bold uppercase tracking-wider">{statusCfg.label}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5">
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                                                {format(new Date(lead.updatedAt), "dd MMM yyyy", { locale: id })}
                                            </span>
                                            <span className="text-[11px] text-zinc-500 mt-0.5">
                                                {format(new Date(lead.updatedAt), "HH:mm")} WIB
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5 text-right">
                                        <div className="flex items-center justify-end gap-2">

                                            {/* Konversi Project (Khusus DEAL & belum ada project) */}
                                            {lead.status === "DEAL" && !lead.project && (
                                                <button
                                                    onClick={() => onConvertToProject(lead.id, lead.name)}
                                                    className="px-3 py-1.5 min-h-[32px] bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                                                    title="Jadikan Project"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Konversi
                                                </button>
                                            )}

                                            {/* Info Button jika sudah punya project */}
                                            {lead.status === "DEAL" && lead.project && (
                                                <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-lg text-xs font-medium flex items-center gap-1.5">
                                                    Telah Dikonversi
                                                </span>
                                            )}

                                            {/* Tombol Lihat Detail (Baru) */}
                                            <button
                                                onClick={() => onViewDetail(lead.id)}
                                                className="px-3 py-1.5 min-h-[32px] bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-indigo-500/20 transition-all flex items-center gap-1.5"
                                            >
                                                Detail <ExternalLink className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Dropdown Menu Stand-in (Untuk Ubah Status) */}
                                            <button
                                                onClick={() => onChangeStatus(lead.id, lead.status, lead.name)}
                                                className="px-3 py-1.5 min-h-[32px] bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-amber-500/20 transition-all flex items-center gap-1.5"
                                                title="Ubah Status"
                                            >
                                                <MoreHorizontal className="w-3.5 h-3.5" /> Status
                                            </button>

                                            {/* Tombol Hapus */}
                                            <button
                                                onClick={() => onDeleteLead(lead.id, lead.name)}
                                                className="px-3 py-1.5 min-h-[32px] bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-rose-500/20 transition-all flex items-center gap-1.5"
                                                title="Hapus Lead"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Server-Side Pagination Controller */}
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
