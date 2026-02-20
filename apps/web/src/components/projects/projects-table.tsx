"use client";

import React from "react";
import { format, isPast, isToday } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
    MoreHorizontal,
    CheckCircle2,
    Clock,
    XCircle,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    CircleDashed,
    AlertCircle,
    CalendarClock,
    UserCircle2
} from "lucide-react";

export type ProjectData = {
    id: string;
    name: string;
    clientName: string;
    status: "TODO" | "ON_PROGRESS" | "DONE" | "OVERDUE";
    deadline: Date;
    createdAt: Date;
    pic?: { id: string; name: string } | null;
};

interface ProjectsTableProps {
    data: ProjectData[];
    currentPage: number;
    totalPages: number;
    isOwner: boolean;
    onPageChange: (page: number) => void;
    onViewDetail: (projectId: string) => void;
    onChangeStatus?: (projectId: string, currentStatus: string, name: string) => void;
    onChangePic?: (projectId: string, currentPicId: string | null, name: string) => void;
    onChangeDeadline?: (projectId: string, currentDeadline: Date, name: string) => void;
}

const statusConfig = {
    TODO: {
        label: "To Do",
        icon: CircleDashed,
        bg: "bg-slate-400/10 dark:bg-slate-500/10",
        text: "text-slate-600 dark:text-slate-400",
        border: "border-slate-400/20 dark:border-slate-500/20",
    },
    ON_PROGRESS: {
        label: "In Progress",
        icon: Clock,
        bg: "bg-amber-400/10 dark:bg-amber-500/10",
        text: "text-amber-600 dark:text-amber-500",
        border: "border-amber-400/20 dark:border-amber-500/20",
    },
    DONE: {
        label: "Done",
        icon: CheckCircle2,
        bg: "bg-emerald-400/10 dark:bg-emerald-500/10",
        text: "text-emerald-600 dark:text-emerald-500",
        border: "border-emerald-400/20 dark:border-emerald-500/20",
    },
    OVERDUE: {
        label: "Overdue",
        icon: AlertCircle,
        bg: "bg-rose-400/10 dark:bg-rose-500/10",
        text: "text-rose-600 dark:text-rose-500",
        border: "border-rose-400/20 dark:border-rose-500/20",
    },
};

export function ProjectsTable({
    data,
    currentPage,
    totalPages,
    isOwner,
    onPageChange,
    onViewDetail,
    onChangeStatus,
    onChangePic,
    onChangeDeadline
}: ProjectsTableProps) {

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                    <XCircle className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Tidak ada Project ditemukan</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-sm">
                    {isOwner
                        ? "Coba sesuaikan filter pencarian, status, PIC, atau convert Lead baru menjadi Project."
                        : "Saat ini Anda belum memiliki project yang ditetapkan (di-assign) kepada Anda."}
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
                            <th className="py-4 px-5">Nama Project</th>
                            <th className="py-4 px-5">Status</th>
                            <th className="py-4 px-5">Deadline</th>
                            <th className="py-4 px-5">PIC</th>
                            <th className="py-4 px-5 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200/30 dark:divide-zinc-800/30">
                        {data.map((project) => {
                            // Hitung Override jika Deadline lewat tapi status bukan DONE/OVERDUE
                            const isLate = isPast(new Date(project.deadline)) && !isToday(new Date(project.deadline));
                            let currentStatus = project.status;
                            if (isLate && project.status !== "DONE" && project.status !== "OVERDUE") {
                                currentStatus = "OVERDUE";
                            }

                            const statusCfg = statusConfig[currentStatus];
                            const StatusIcon = statusCfg.icon;

                            // Hiasi text deadline merah jika telat
                            const isDeadlineWarning = currentStatus === "OVERDUE";

                            return (
                                <tr key={project.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                                    <td className="py-4 px-5">
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-bold text-zinc-900 dark:text-white">{project.name}</span>
                                            <span className="text-[12px] text-zinc-500 mt-0.5">Klien: {project.clientName}</span>
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
                                            <span className={`text-[13px] font-medium ${isDeadlineWarning ? 'text-rose-600 dark:text-rose-500' : 'text-zinc-700 dark:text-zinc-300'}`}>
                                                {format(new Date(project.deadline), "dd MMM yyyy", { locale: localeId })}
                                            </span>
                                            <span className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-1">
                                                <CalendarClock className="w-3 h-3" />
                                                Tenggat Waktu
                                            </span>
                                        </div>
                                    </td>

                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                                                <UserCircle2 className="w-4 h-4 text-zinc-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-bold text-zinc-900 dark:text-white">
                                                    {project.pic ? project.pic.name : "Owner"}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-4 px-5 text-right">
                                        <div className="flex items-center justify-end gap-2">

                                            {/* Tombol Detail (Bisa diakses Owner & Mitra) */}
                                            <button
                                                onClick={() => onViewDetail(project.id)}
                                                className="px-3 py-1.5 min-h-[32px] bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-indigo-500/20 transition-all flex items-center gap-1.5"
                                            >
                                                Detail <ExternalLink className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Dropdown Action - HANYA OWNER & BUKAN STATUS DONE */}
                                            {isOwner && (
                                                <div className="flex items-center gap-1.5 border-l border-zinc-200 dark:border-zinc-800 pl-2 ml-1">
                                                    {onChangeStatus && (
                                                        <button
                                                            onClick={() => onChangeStatus(project.id, currentStatus, project.name)}
                                                            className="px-2.5 py-1.5 min-h-[32px] bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-amber-500/20 transition-all flex items-center gap-1.5"
                                                            title="Ubah Status"
                                                        >
                                                            <MoreHorizontal className="w-3.5 h-3.5" /> Status
                                                        </button>
                                                    )}
                                                    {onChangePic && (
                                                        <button
                                                            onClick={() => onChangePic(project.id, project.pic?.id || null, project.name)}
                                                            className="px-2.5 py-1.5 min-h-[32px] bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-violet-500/20 transition-all flex items-center gap-1.5"
                                                            title="Ganti PIC"
                                                        >
                                                            <UserCircle2 className="w-3.5 h-3.5" /> PIC
                                                        </button>
                                                    )}
                                                    {onChangeDeadline && (
                                                        <button
                                                            onClick={() => onChangeDeadline(project.id, project.deadline, project.name)}
                                                            className="px-2.5 py-1.5 min-h-[32px] bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-rose-500/20 transition-all flex items-center gap-1.5"
                                                            title="Set Deadline"
                                                        >
                                                            <CalendarClock className="w-3.5 h-3.5" /> Deadline
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
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
