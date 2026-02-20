"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, Loader2, UserCircle2, CalendarClock, MoreHorizontal, X, AlertCircle, CheckCircle2, Clock, FileText, DollarSign, TrendingUp, TrendingDown, ArrowUpRight, Link2 } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { ProjectsTable, ProjectData } from "@/components/projects/projects-table";
import {
    updateProjectStatus,
    updateProjectPic,
    updateProjectDeadline,
    getProjectDetail,
    addProjectNote
} from "@/lib/actions/projects";

const CURRENT_USER_ROLE = "OWNER";

interface ProjectsClientProps {
    initialData: ProjectData[];
    totalPages: number;
    currentPage: number;
    mitraList: { id: string; name: string }[];
}

type DetailTab = "MANAGE" | "FINANCE" | "NOTES" | "AUDIT";

export function ProjectsClient({ initialData, totalPages, currentPage, mitraList }: ProjectsClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isProcessing, setIsProcessing] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "ALL");
    const [deadlineFilter, setDeadlineFilter] = useState(searchParams.get("deadlineFilter") || "ALL");
    const [picFilter, setPicFilter] = useState(searchParams.get("picId") || "ALL");

    // Modal / Slide-Over states (aksi cepat)
    const [statusModal, setStatusModal] = useState(false);
    const [picModal, setPicModal] = useState(false);
    const [deadlineModal, setDeadlineModal] = useState(false);

    const [selectedProject, setSelectedProject] = useState<{ id: string; name: string; currentVal?: any } | null>(null);

    // Form states (aksi cepat)
    const [newStatus, setNewStatus] = useState<string>("");
    const [newPicId, setNewPicId] = useState<string>("OWNER");
    const [newDeadline, setNewDeadline] = useState<string>("");

    // ===================== DETAIL PANEL STATE =====================
    const [detailPanel, setDetailPanel] = useState<{ open: boolean; projectId: string; data: any; activeTab: DetailTab }>({ open: false, projectId: "", data: null, activeTab: "MANAGE" });
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [newNote, setNewNote] = useState("");

    const isOwner = CURRENT_USER_ROLE === "OWNER";

    // --- URL Helpers ---
    const updateQueryParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "ALL") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateQueryParams("search", searchQuery);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    // --- Trigger Aksi Cepat ---
    const triggerStatusChange = (id: string, currentStatus: string, name: string) => {
        setSelectedProject({ id, name, currentVal: currentStatus });
        setNewStatus(currentStatus);
        setStatusModal(true);
    };

    const triggerPicChange = (id: string, currentPicId: string | null, name: string) => {
        setSelectedProject({ id, name, currentVal: currentPicId });
        setNewPicId(currentPicId || "OWNER");
        setPicModal(true);
    };

    const triggerDeadlineChange = (id: string, currentDeadline: Date, name: string) => {
        setSelectedProject({ id, name, currentVal: currentDeadline });
        const d = new Date(currentDeadline);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        setNewDeadline(`${yyyy}-${mm}-${dd}`);
        setDeadlineModal(true);
    };

    // --- Submit Aksi Cepat ---
    const submitStatusChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProject || isProcessing) return;
        setIsProcessing(true);
        try {
            await updateProjectStatus(selectedProject.id, newStatus as any);
            setStatusModal(false);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const submitPicChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProject || isProcessing) return;
        setIsProcessing(true);
        try {
            const finalPicId = newPicId === "OWNER" ? null : newPicId;
            await updateProjectPic(selectedProject.id, finalPicId);
            setPicModal(false);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const submitDeadlineChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProject || !newDeadline || isProcessing) return;
        setIsProcessing(true);
        try {
            const dateObj = new Date(newDeadline);
            await updateProjectDeadline(selectedProject.id, dateObj);
            setDeadlineModal(false);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    // ===================== DETAIL PANEL HANDLERS =====================
    const handleViewDetail = async (projectId: string) => {
        setDetailPanel({ open: true, projectId, data: null, activeTab: "MANAGE" });
        setIsDetailLoading(true);
        try {
            const data = await getProjectDetail(projectId);
            setDetailPanel(prev => ({ ...prev, data }));
        } catch (error: any) {
            alert(error.message);
            setDetailPanel(prev => ({ ...prev, open: false }));
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim() || !detailPanel.projectId) return;
        setIsProcessing(true);
        try {
            await addProjectNote(detailPanel.projectId, newNote);
            setNewNote("");
            const data = await getProjectDetail(detailPanel.projectId);
            setDetailPanel(prev => ({ ...prev, data }));
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const closeDetail = () => setDetailPanel(prev => ({ ...prev, open: false }));

    // ===================== STATUS HELPERS =====================
    const statusBadge = (status: string) => {
        const map: Record<string, { bg: string; text: string; label: string }> = {
            TODO: { bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-600 dark:text-zinc-400", label: "To Do" },
            ON_PROGRESS: { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", label: "On Progress" },
            DONE: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", label: "Done" },
            OVERDUE: { bg: "bg-rose-50 dark:bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", label: "Overdue" },
        };
        const s = map[status] || map.TODO;
        return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>{s.label}</span>;
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Projects Management</h1>
                <p className="text-sm text-zinc-500 mt-1">Kelola timeline, status, dan penugasan mitra pada semua proyek aktif.</p>
            </div>

            {/* Toolbar Filters */}
            <div className="flex flex-col xl:flex-row gap-4 lg:items-center justify-between bg-white/50 dark:bg-zinc-900/30 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm">

                <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Cari nama project atau klien..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white placeholder:text-zinc-400"
                    />
                    {searchQuery !== (searchParams.get("search") || "") && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <button type="submit" className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded group transition-colors">
                                <Search className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                            </button>
                            <button type="button" onClick={() => { setSearchQuery(""); updateQueryParams("search", ""); }} className="p-1 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded group transition-colors">
                                <X className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                            </button>
                        </div>
                    )}
                </form>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider hidden sm:block">Status:</span>
                        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); updateQueryParams("status", e.target.value); }} className="h-10 px-3 pr-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white cursor-pointer appearance-none">
                            <option value="ALL">Semua Status</option>
                            <option value="TODO">To Do</option>
                            <option value="ON_PROGRESS">On Progress</option>
                            <option value="DONE">Done</option>
                            <option value="OVERDUE">Overdue</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider hidden sm:block">Deadline:</span>
                        <select value={deadlineFilter} onChange={(e) => { setDeadlineFilter(e.target.value); updateQueryParams("deadlineFilter", e.target.value); }} className="h-10 px-3 pr-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white cursor-pointer appearance-none">
                            <option value="ALL">Kapanpun</option>
                            <option value="TODAY">Hari ini</option>
                            <option value="THIS_WEEK">Minggu ini</option>
                            <option value="OVERDUE">Terlewat</option>
                        </select>
                    </div>

                    {isOwner && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider hidden sm:block">PIC:</span>
                            <select value={picFilter} onChange={(e) => { setPicFilter(e.target.value); updateQueryParams("picId", e.target.value); }} className="h-10 px-3 pr-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white cursor-pointer appearance-none w-36 truncate">
                                <option value="ALL">Semua Mitra</option>
                                <option value="OWNER">Owner (Diri Sendiri)</option>
                                {mitraList.map(mitra => (
                                    <option key={mitra.id} value={mitra.id}>{mitra.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Table Content */}
            <ProjectsTable
                data={initialData}
                currentPage={currentPage}
                totalPages={totalPages}
                isOwner={isOwner}
                onPageChange={handlePageChange}
                onViewDetail={handleViewDetail}
                onChangeStatus={triggerStatusChange}
                onChangePic={triggerPicChange}
                onChangeDeadline={triggerDeadlineChange}
            />

            {/* ========================================================== */}
            {/* SLIDE-OVER PANELS (Aksi Cepat) */}
            {/* ========================================================== */}

            {/* Slide-over Overlay */}
            {(statusModal || picModal || deadlineModal) && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
                    onClick={() => {
                        setStatusModal(false);
                        setPicModal(false);
                        setDeadlineModal(false);
                    }}
                />
            )}

            {/* 1. Modal: Ganti Status */}
            <div className={`fixed inset-y-0 right-0 w-full md:w-[480px] bg-white dark:bg-zinc-950 shadow-2xl z-[70] transform transition-transform duration-300 ease-out border-l border-zinc-200 dark:border-zinc-800 flex flex-col ${statusModal ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                            <MoreHorizontal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white leading-none">Ubah Status</h2>
                            <p className="text-sm text-zinc-500 mt-1">Ganti status project</p>
                        </div>
                    </div>
                    <button onClick={() => setStatusModal(false)} className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {statusModal && selectedProject && (
                    <form onSubmit={submitStatusChange} className="flex-1 overflow-y-auto p-6 flex flex-col">
                        <div className="space-y-5 flex-1">
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-6">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Project</label>
                                <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{selectedProject.name}</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-zinc-900 dark:text-white">Status Baru <span className="text-rose-500">*</span></label>
                                <select required value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full h-11 px-4 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white appearance-none cursor-pointer">
                                    <option value="TODO">To Do (Menunggu)</option>
                                    <option value="ON_PROGRESS">On Progress (Sedang Dikerjakan)</option>
                                    <option value="DONE">Done (Selesai/Terkunci)</option>
                                </select>
                            </div>
                            {newStatus === "DONE" && (
                                <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-200/50 dark:border-amber-500/20 flex gap-3 items-start mt-4">
                                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-1">Perhatian!</h4>
                                        <p className="text-[13px] text-amber-700 dark:text-amber-400/90 leading-relaxed">
                                            Status <b>DONE</b> akan mengunci timeline project secara permanen.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 mt-8">
                            <button type="submit" disabled={isProcessing} className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : "Simpan Status Baru"}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* 2. Modal: Ganti PIC */}
            <div className={`fixed inset-y-0 right-0 w-full md:w-[480px] bg-white dark:bg-zinc-950 shadow-2xl z-[70] transform transition-transform duration-300 ease-out border-l border-zinc-200 dark:border-zinc-800 flex flex-col ${picModal ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                            <UserCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white leading-none">Assign PIC</h2>
                            <p className="text-sm text-zinc-500 mt-1">Alihkan project ke owner / mitra lain</p>
                        </div>
                    </div>
                    <button onClick={() => setPicModal(false)} className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {picModal && selectedProject && (
                    <form onSubmit={submitPicChange} className="flex-1 overflow-y-auto p-6 flex flex-col">
                        <div className="space-y-5 flex-1">
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-6">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Project</label>
                                <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{selectedProject.name}</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-zinc-900 dark:text-white">Pilih PIC Baru <span className="text-rose-500">*</span></label>
                                <select required value={newPicId} onChange={(e) => setNewPicId(e.target.value)} className="w-full h-11 px-4 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white appearance-none cursor-pointer">
                                    <option value="OWNER">Owner / Tanpa Mitra</option>
                                    {mitraList.map(mitra => (
                                        <option key={mitra.id} value={mitra.id}>{mitra.name}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-zinc-500 mt-1">Mengganti PIC akan memindahkan hak panel akses project ini.</p>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 mt-8">
                            <button type="submit" disabled={isProcessing} className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Assigning...</> : "Terapkan PIC"}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* 3. Modal: Ganti Deadline */}
            <div className={`fixed inset-y-0 right-0 w-full md:w-[480px] bg-white dark:bg-zinc-950 shadow-2xl z-[70] transform transition-transform duration-300 ease-out border-l border-zinc-200 dark:border-zinc-800 flex flex-col ${deadlineModal ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                            <CalendarClock className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white leading-none">Tetapkan Tenggat Waktu</h2>
                            <p className="text-sm text-zinc-500 mt-1">Perbarui batas akhir project ini</p>
                        </div>
                    </div>
                    <button onClick={() => setDeadlineModal(false)} className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {deadlineModal && selectedProject && (
                    <form onSubmit={submitDeadlineChange} className="flex-1 overflow-y-auto p-6 flex flex-col">
                        <div className="space-y-5 flex-1">
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-6">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Project</label>
                                <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{selectedProject.name}</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-zinc-900 dark:text-white">Tanggal Deadline <span className="text-rose-500">*</span></label>
                                <input
                                    type="date"
                                    required
                                    value={newDeadline}
                                    onChange={(e) => setNewDeadline(e.target.value)}
                                    className="w-full h-11 px-4 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                                />
                                <p className="text-xs text-zinc-500 mt-1">Pilih tanggal spesifik bulan dan hari.</p>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 mt-8">
                            <button type="submit" disabled={isProcessing} className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : "Ubah Deadline"}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* ========================================================== */}
            {/* MEGA SLIDE-OVER: PROJECT DETAIL */}
            {/* ========================================================== */}
            {detailPanel.open && (
                <>
                    <div
                        className="fixed inset-0 z-[60] bg-zinc-950/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                        onClick={closeDetail}
                    />
                    <div className="fixed inset-y-0 right-0 z-[70] w-full max-w-2xl bg-white dark:bg-zinc-900 shadow-2xl border-l border-zinc-200 dark:border-zinc-800 overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
                        {/* Header */}
                        <div className="px-6 pt-6 pb-4 shrink-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-1 flex items-center gap-2">
                                        {isDetailLoading || !detailPanel.data ? "Memuat Data..." : detailPanel.data.name}
                                        {detailPanel.data?.status === "DONE" && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                    </h3>
                                    {!isDetailLoading && detailPanel.data && (
                                        <div className="flex items-center gap-3 mt-1">
                                            <p className="text-sm text-zinc-500">
                                                Klien: <strong className="text-zinc-700 dark:text-zinc-300">{detailPanel.data.clientName}</strong>
                                            </p>
                                            <span className="text-zinc-300 dark:text-zinc-700">•</span>
                                            {statusBadge(detailPanel.data.status)}
                                        </div>
                                    )}
                                </div>
                                <button onClick={closeDetail} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors shrink-0">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        {!isDetailLoading && detailPanel.data && (
                            <>
                                <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-6 shrink-0 overflow-x-auto">
                                    {([
                                        { key: "MANAGE" as DetailTab, label: "Manajemen" },
                                        { key: "FINANCE" as DetailTab, label: "Keuangan" },
                                        { key: "NOTES" as DetailTab, label: `Catatan (${detailPanel.data.notes?.length || 0})` },
                                        { key: "AUDIT" as DetailTab, label: "Riwayat" },
                                    ]).map(tab => (
                                        <button
                                            key={tab.key}
                                            onClick={() => setDetailPanel(prev => ({ ...prev, activeTab: tab.key }))}
                                            className={`px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${detailPanel.activeTab === tab.key ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex-1 overflow-y-auto p-6">

                                    {/* ===== TAB: MANAJEMEN ===== */}
                                    {detailPanel.activeTab === "MANAGE" && (
                                        <div className="space-y-6 animate-in fade-in">
                                            {/* Info Grid */}
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 bg-zinc-50/50 dark:bg-zinc-950/20 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                                                <div>
                                                    <p className="text-xs font-bold text-zinc-500 mb-1">PIC</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                                                            {detailPanel.data.pic?.name?.charAt(0) || "O"}
                                                        </span>
                                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{detailPanel.data.pic?.name || "Owner"}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-zinc-500 mb-1">Deadline</p>
                                                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{format(new Date(detailPanel.data.deadline), "dd MMM yyyy", { locale: idLocale })}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-zinc-500 mb-1">Dibuat</p>
                                                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{format(new Date(detailPanel.data.createdAt), "dd MMM yyyy", { locale: idLocale })}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-zinc-500 mb-1">Mulai</p>
                                                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{format(new Date(detailPanel.data.startDate), "dd MMM yyyy", { locale: idLocale })}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-zinc-500 mb-1">Status</p>
                                                    {statusBadge(detailPanel.data.status)}
                                                </div>
                                            </div>

                                            {/* Relasi ke Lead */}
                                            {detailPanel.data.lead && (
                                                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Link2 className="w-4 h-4 text-indigo-500" />
                                                        <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Asal Lead</h4>
                                                    </div>
                                                    <p className="text-sm text-indigo-700 dark:text-indigo-400">
                                                        <strong>{detailPanel.data.lead.name}</strong> — dikonversi pada {format(new Date(detailPanel.data.lead.createdAt), "dd MMM yyyy", { locale: idLocale })}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Aksi Cepat (hanya jika belum DONE) */}
                                            {detailPanel.data.status !== "DONE" && isOwner && (
                                                <div className="bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-zinc-800/50 p-5 rounded-xl">
                                                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-indigo-500" /> Aksi Cepat</h4>
                                                    <div className="flex flex-wrap gap-3">
                                                        <button
                                                            onClick={() => triggerStatusChange(detailPanel.data.id, detailPanel.data.status, detailPanel.data.name)}
                                                            className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-colors"
                                                        >
                                                            Ubah Status
                                                        </button>
                                                        <button
                                                            onClick={() => triggerPicChange(detailPanel.data.id, detailPanel.data.picId, detailPanel.data.name)}
                                                            className="h-9 px-4 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-bold transition-colors"
                                                        >
                                                            Ganti PIC
                                                        </button>
                                                        <button
                                                            onClick={() => triggerDeadlineChange(detailPanel.data.id, detailPanel.data.deadline, detailPanel.data.name)}
                                                            className="h-9 px-4 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-bold transition-colors"
                                                        >
                                                            Ubah Deadline
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {detailPanel.data.status === "DONE" && (
                                                <div className="p-5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl flex items-center gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                                    <div>
                                                        <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-400">Project Selesai</h4>
                                                        <p className="text-sm text-emerald-700 dark:text-emerald-500/80">Project ini telah ditandai selesai dan dikunci dari perubahan.</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* ===== TAB: KEUANGAN ===== */}
                                    {detailPanel.activeTab === "FINANCE" && (
                                        <div className="space-y-6 animate-in fade-in">
                                            {/* Summary Cards */}
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Pemasukan</p>
                                                    </div>
                                                    <p className="text-lg font-extrabold text-emerald-900 dark:text-emerald-300">{formatCurrency(detailPanel.data.financialSummary.totalIncome)}</p>
                                                </div>
                                                <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                                        <p className="text-xs font-bold text-rose-600 dark:text-rose-400">Pengeluaran</p>
                                                    </div>
                                                    <p className="text-lg font-extrabold text-rose-900 dark:text-rose-300">{formatCurrency(detailPanel.data.financialSummary.totalExpense)}</p>
                                                </div>
                                                <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <DollarSign className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Profit</p>
                                                    </div>
                                                    <p className={`text-lg font-extrabold ${detailPanel.data.financialSummary.profit >= 0 ? "text-indigo-900 dark:text-indigo-300" : "text-rose-700 dark:text-rose-400"}`}>{formatCurrency(detailPanel.data.financialSummary.profit)}</p>
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="p-4 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl">
                                                <p className="text-sm text-zinc-500 flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4" />
                                                    Detail input pemasukan dan pengeluaran tersedia di menu <strong>Finance</strong>. Halaman ini hanya menampilkan ringkasan.
                                                </p>
                                            </div>

                                            {/* Recent Incomes */}
                                            {detailPanel.data.incomes?.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2"><ArrowUpRight className="w-4 h-4 text-emerald-500" /> Pemasukan Terakhir</h4>
                                                    <div className="space-y-2">
                                                        {detailPanel.data.incomes.slice(0, 5).map((inc: any) => (
                                                            <div key={inc.id} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 rounded-lg">
                                                                <div>
                                                                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{inc.paymentType}</p>
                                                                    <p className="text-xs text-zinc-500">{format(new Date(inc.date), "dd MMM yyyy", { locale: idLocale })}</p>
                                                                </div>
                                                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+{formatCurrency(inc.amount)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Recent Expenses */}
                                            {detailPanel.data.expenses?.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-rose-500" /> Pengeluaran Terakhir</h4>
                                                    <div className="space-y-2">
                                                        {detailPanel.data.expenses.slice(0, 5).map((exp: any) => (
                                                            <div key={exp.id} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 rounded-lg">
                                                                <div>
                                                                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{exp.category}</p>
                                                                    <p className="text-xs text-zinc-500">{format(new Date(exp.date), "dd MMM yyyy", { locale: idLocale })}</p>
                                                                </div>
                                                                <span className="text-sm font-bold text-rose-600 dark:text-rose-400">-{formatCurrency(exp.amount)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {detailPanel.data.incomes?.length === 0 && detailPanel.data.expenses?.length === 0 && (
                                                <div className="text-center py-10 text-zinc-500 text-sm">Belum ada data keuangan untuk project ini.</div>
                                            )}
                                        </div>
                                    )}

                                    {/* ===== TAB: CATATAN INTERNAL ===== */}
                                    {detailPanel.activeTab === "NOTES" && (
                                        <div className="space-y-6 animate-in fade-in">
                                            <form onSubmit={handleAddNote}>
                                                <textarea
                                                    required
                                                    value={newNote}
                                                    onChange={(e) => setNewNote(e.target.value)}
                                                    placeholder="Tulis catatan meeting, follow up, atau keputusan penting..."
                                                    className="w-full min-h-[100px] p-4 bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y"
                                                ></textarea>
                                                <div className="mt-3 flex justify-end">
                                                    <button type="submit" disabled={isProcessing || !newNote.trim()} className="h-10 px-5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl text-[13px] font-bold shadow-sm transition-colors disabled:opacity-50">
                                                        {isProcessing ? "Menyimpan..." : "Tambah Catatan"}
                                                    </button>
                                                </div>
                                            </form>

                                            <div className="space-y-4">
                                                {detailPanel.data.notes?.length === 0 ? (
                                                    <div className="text-center py-10 text-zinc-500 text-sm">Belum ada catatan. Catatan membantu mendokumentasikan konteks proyek.</div>
                                                ) : (
                                                    detailPanel.data.notes.map((note: any) => (
                                                        <div key={note.id} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-100 dark:border-zinc-800 flex gap-4 transition-all hover:bg-white dark:hover:bg-zinc-800/40 hover:shadow-sm">
                                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                                                                {note.createdBy?.charAt(0) || "O"}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1.5">
                                                                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{note.createdBy || "Owner"}</span>
                                                                    <span className="text-xs text-zinc-500">&bull; {format(new Date(note.createdAt), "dd MMM HH:mm", { locale: idLocale })}</span>
                                                                </div>
                                                                <p className="text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{note.content}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* ===== TAB: AUDIT LOG ===== */}
                                    {detailPanel.activeTab === "AUDIT" && (
                                        <div className="bg-zinc-50/50 dark:bg-zinc-950/20 rounded-xl border border-zinc-100 dark:border-zinc-800/50 p-6 animate-in fade-in">
                                            <div className="relative pl-4 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-8">
                                                {detailPanel.data.auditLogs?.length === 0 ? (
                                                    <p className="text-sm text-zinc-500">Log bersih. Belum ada rekam perubahan.</p>
                                                ) : (
                                                    detailPanel.data.auditLogs.map((log: any) => (
                                                        <div key={log.id} className="relative group">
                                                            <div className="absolute w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600 group-hover:bg-indigo-500 -left-[21px] top-1 ring-4 ring-white dark:ring-zinc-900 transition-colors"></div>
                                                            <p className="text-xs font-bold text-zinc-500 mb-1 flex items-center gap-1.5">
                                                                <Clock className="w-3.5 h-3.5" /> {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm", { locale: idLocale })}
                                                            </p>
                                                            <p className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
                                                                {log.details}
                                                            </p>
                                                            <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-zinc-200/50 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                                                                Aksi: {log.action}
                                                            </span>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

        </div>
    );
}
