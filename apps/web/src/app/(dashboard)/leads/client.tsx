"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, Filter, Plus, FileText, ArrowRight, X, MessageSquare, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { LeadsTable, type LeadData } from "@/components/leads/leads-table";
import { updateLeadStatus, convertLeadToProject, createLead, deleteLead, getLeadDetail, addLeadNote } from "@/lib/actions/leads";

export function LeadsClient({
    initialData,
    totalPages,
    initialPage,
    mitraList
}: {
    initialData: LeadData[];
    totalPages: number;
    initialPage: number;
    mitraList: { id: string, name: string }[];
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // URL States
    const currentSearch = searchParams.get("search") || "";
    const currentStatus = searchParams.get("status") || "ALL";

    // Local States for Inputs (Debounced)
    const [searchTerm, setSearchTerm] = useState(currentSearch);
    const [isPendingUrlUpdate, setIsPendingUrlUpdate] = useState(false);

    // States for Modals
    const [addModal, setAddModal] = useState(false);
    const [statusModal, setStatusModal] = useState<{ open: boolean, leadId: string, currentStatus: string, name: string }>({ open: false, leadId: "", currentStatus: "", name: "" });
    const [convertModal, setConvertModal] = useState<{ open: boolean, leadId: string, name: string }>({ open: false, leadId: "", name: "" });
    const [detailModal, setDetailModal] = useState<{ open: boolean, leadId: string, data: any, activeTab: "INFO" | "NOTES" | "AUDIT" }>({ open: false, leadId: "", data: null, activeTab: "INFO" });
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Form States
    const [newNote, setNewNote] = useState("");
    const [newLeadForm, setNewLeadForm] = useState({ name: "", contact: "", source: "", mitraId: "" });
    const [newStatus, setNewStatus] = useState<string>("PENDING");
    const [cancelReason, setCancelReason] = useState("");
    const [projectName, setProjectName] = useState("");

    // Debounced Search Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== currentSearch) {
                updateUrlParams({ search: searchTerm, page: "1" });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const updateUrlParams = (updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleStatusSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newStatus === statusModal.currentStatus) return setStatusModal(prev => ({ ...prev, open: false }));

        setIsProcessing(true);
        try {
            await updateLeadStatus(statusModal.leadId, newStatus as any, cancelReason);
            setStatusModal(prev => ({ ...prev, open: false }));
            setCancelReason("");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConvertSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            await convertLeadToProject(convertModal.leadId, projectName);
            setConvertModal(prev => ({ ...prev, open: false }));
            setProjectName("");
            // Redirect ke projects jika mau, tapi user experience lebih baik tetap di halaman lalu refresh DB
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            await createLead({
                name: newLeadForm.name,
                contact: newLeadForm.contact,
                source: newLeadForm.source,
                mitraId: newLeadForm.mitraId === "" ? undefined : newLeadForm.mitraId
            });
            setAddModal(false);
            setNewLeadForm({ name: "", contact: "", source: "", mitraId: "" });
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteLead = async (leadId: string, name: string) => {
        if (!window.confirm(`Apakah Anda yakin ingin menghapus lead "${name}" secara permanen? Data ini tidak dapat dikembalikan.`)) return;
        try {
            await deleteLead(leadId);
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleViewDetail = async (leadId: string) => {
        setDetailModal({ open: true, leadId, data: null, activeTab: "INFO" });
        setIsDetailLoading(true);
        try {
            const data = await getLeadDetail(leadId);
            setDetailModal(prev => ({ ...prev, data }));
        } catch (error: any) {
            alert(error.message);
            setDetailModal(prev => ({ ...prev, open: false }));
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim() || !detailModal.leadId) return;
        setIsProcessing(true);
        try {
            await addLeadNote(detailModal.leadId, newNote);
            setNewNote("");
            // Refresh detail data
            const data = await getLeadDetail(detailModal.leadId);
            setDetailModal(prev => ({ ...prev, data }));
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6">

            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Leads Management</h1>
                    <p className="text-sm text-zinc-500 mt-1">Kelola data calon klien sebelum dikonversi menjadi proyek.</p>
                </div>
                <button
                    onClick={() => setAddModal(true)}
                    className="h-10 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Lead
                </button>
            </div>

            {/* Filter Bar */}
            <div className="p-2 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Cari nama lead, kontak, atau sumber..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 bg-zinc-100/50 hover:bg-zinc-100 focus:bg-white dark:bg-zinc-800/50 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 border border-transparent focus:border-indigo-500/30 rounded-xl text-[13px] font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                </div>

                {/* Status Filter */}
                <div className="relative shrink-0">
                    <select
                        value={currentStatus}
                        onChange={(e) => updateUrlParams({ status: e.target.value, page: "1" })}
                        className="h-11 pl-4 pr-10 appearance-none bg-zinc-100/50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 border border-transparent rounded-xl text-[13px] font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer min-w-[160px]"
                    >
                        <option value="ALL">Semua Status</option>
                        <option value="PENDING">Pending (Tertunda)</option>
                        <option value="DEAL">Deal (Diterima)</option>
                        <option value="CANCEL">Cancel (Dibatalkan)</option>
                    </select>
                    <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
            </div>

            {/* Main Table Content */}
            <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl">
                <LeadsTable
                    data={initialData}
                    currentPage={initialPage}
                    totalPages={totalPages}
                    onPageChange={(page) => updateUrlParams({ page: page.toString() })}
                    onViewDetail={handleViewDetail}
                    onChangeStatus={(leadId, status, name) => {
                        setNewStatus(status);
                        setStatusModal({ open: true, leadId, currentStatus: status, name });
                    }}
                    onConvertToProject={(leadId, name) => {
                        setProjectName(`Project ${name}`);
                        setConvertModal({ open: true, leadId, name });
                    }}
                    onDeleteLead={handleDeleteLead}
                />
            </div>

            {/* SLIDE-OVER: Tambah Lead */}
            {addModal && (
                <>
                    <div
                        className="fixed inset-0 z-[60] bg-zinc-950/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                        onClick={() => setAddModal(false)}
                    />
                    <div className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl border-l border-zinc-200 dark:border-zinc-800 p-6 overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">Tambah Lead Baru</h3>
                            <button onClick={() => setAddModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="space-y-5 flex-1 flex flex-col">
                            <div className="space-y-4 flex-1">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">Nama Calon Klien</label>
                                    <input
                                        required
                                        type="text"
                                        value={newLeadForm.name}
                                        onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                                        placeholder="Mis. PT Velora Sukses"
                                        className="w-full h-11 px-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">Kontak (Opsional)</label>
                                    <input
                                        type="text"
                                        value={newLeadForm.contact}
                                        onChange={(e) => setNewLeadForm({ ...newLeadForm, contact: e.target.value })}
                                        placeholder="No HP atau Email"
                                        className="w-full h-11 px-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">Sumber Lead (Opsional)</label>
                                    <input
                                        type="text"
                                        value={newLeadForm.source}
                                        onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value })}
                                        placeholder="Mis. Instagram Ads, Referral"
                                        className="w-full h-11 px-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">Pemilik/Asal Lead</label>
                                    <select
                                        value={newLeadForm.mitraId}
                                        onChange={(e) => setNewLeadForm({ ...newLeadForm, mitraId: e.target.value })}
                                        className="w-full h-11 px-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                                    >
                                        <option value="">Saya Sendiri (Owner)</option>
                                        {mitraList.map((mitra) => (
                                            <option key={mitra.id} value={mitra.id}>
                                                Mitra: {mitra.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6 mt-auto border-t border-zinc-200/50 dark:border-zinc-800/50">
                                <button type="button" onClick={() => setAddModal(false)} className="flex-1 h-11 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-xl text-sm font-bold transition-colors">
                                    Batal
                                </button>
                                <button type="submit" disabled={isProcessing || !newLeadForm.name.trim()} className="flex-[2] h-11 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl text-sm font-bold disabled:opacity-50 transition-colors">
                                    {isProcessing ? "Menyimpan..." : "Simpan Lead Baru"}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}

            {/* SLIDE-OVER: Ubah Status */}
            {statusModal.open && (
                <>
                    <div
                        className="fixed inset-0 z-[60] bg-zinc-950/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                        onClick={() => setStatusModal({ ...statusModal, open: false })}
                    />
                    <div className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl border-l border-zinc-200 dark:border-zinc-800 p-6 overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-1">Ubah Status Lead</h3>
                                <p className="text-sm text-zinc-500">Ubah status untuk <strong>{statusModal.name}</strong>.</p>
                            </div>
                            <button onClick={() => setStatusModal({ ...statusModal, open: false })} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleStatusSubmit} className="space-y-5 flex-1 flex flex-col">
                            <div className="space-y-4 flex-1">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">Pilih Status Baru</label>
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        disabled={statusModal.currentStatus === "DEAL"}
                                        className="w-full h-11 px-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="DEAL">Deal</option>
                                        <option value="CANCEL">Cancel</option>
                                    </select>
                                    {statusModal.currentStatus === "DEAL" && (
                                        <p className="text-[11px] text-rose-500 mt-2 font-medium">Lead DEAL telah dikunci dan tidak bisa diubah.</p>
                                    )}
                                </div>

                                {newStatus === "CANCEL" && (
                                    <div>
                                        <label className="block text-xs font-bold text-rose-600 dark:text-rose-400 mb-2">Alasan Batal (Wajib)</label>
                                        <textarea
                                            required
                                            value={cancelReason}
                                            onChange={(e) => setCancelReason(e.target.value)}
                                            placeholder="Mengapa lead ini dibatalkan?"
                                            className="w-full p-3 h-32 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-6 mt-auto border-t border-zinc-200/50 dark:border-zinc-800/50">
                                <button type="button" onClick={() => setStatusModal({ ...statusModal, open: false })} className="flex-1 h-11 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-xl text-sm font-bold transition-colors">
                                    Kembali
                                </button>
                                <button type="submit" disabled={isProcessing || statusModal.currentStatus === "DEAL"} className="flex-[2] h-11 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl text-sm font-bold disabled:opacity-50 transition-colors">
                                    {isProcessing ? "Menyimpan..." : "Simpan Perubahan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}

            {/* SLIDE-OVER: Convert Ke Project */}
            {convertModal.open && (
                <>
                    <div
                        className="fixed inset-0 z-[60] bg-zinc-950/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                        onClick={() => setConvertModal({ ...convertModal, open: false })}
                    />
                    <div className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl border-l border-zinc-200 dark:border-zinc-800 p-6 overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">Konversi ke Proyek</h3>
                            </div>
                            <button onClick={() => setConvertModal({ ...convertModal, open: false })} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                            Selamat! Lead <strong>{convertModal.name}</strong> akan ditutup (Final Deal) dan dipindahkan ke antrean proyek aktif.
                        </p>

                        <form onSubmit={handleConvertSubmit} className="space-y-5 flex-1 flex flex-col">
                            <div className="space-y-4 flex-1">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">Beri Nama Proyek Baru</label>
                                    <input
                                        required
                                        type="text"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        placeholder="Mis. Pembuatan Website Velora"
                                        className="w-full h-11 px-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6 mt-auto border-t border-zinc-200/50 dark:border-zinc-800/50">
                                <button type="button" onClick={() => setConvertModal({ ...convertModal, open: false })} className="flex-1 h-11 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-xl text-sm font-bold transition-colors">
                                    Batal
                                </button>
                                <button type="submit" disabled={isProcessing || !projectName.trim()} className="flex-[2] h-11 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                                    {isProcessing ? "Memproses..." : "Buat Proyek"} <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}

            {/* SLIDE-OVER: Lead Detail (Mega Panel) */}
            {detailModal.open && (
                <>
                    <div
                        className="fixed inset-0 z-[60] bg-zinc-950/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                        onClick={() => setDetailModal(prev => ({ ...prev, open: false }))}
                    />
                    <div className="fixed inset-y-0 right-0 z-[70] w-full max-w-2xl bg-white dark:bg-zinc-900 shadow-2xl border-l border-zinc-200 dark:border-zinc-800 p-6 overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
                        <div className="flex justify-between items-start mb-6 shrink-0">
                            <div>
                                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-1 flex items-center gap-2">
                                    {isDetailLoading || !detailModal.data ? "Memuat Data..." : detailModal.data.name}
                                    {detailModal.data?.status === "DEAL" && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                </h3>
                                {!isDetailLoading && detailModal.data && (
                                    <p className="text-sm font-medium text-zinc-500">
                                        Bergabung pada: {format(new Date(detailModal.data.createdAt), "dd MMM yyyy", { locale: id })}
                                    </p>
                                )}
                            </div>
                            <button onClick={() => setDetailModal(prev => ({ ...prev, open: false }))} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors shrink-0">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* TABS */}
                        {!isDetailLoading && detailModal.data && (
                            <>
                                <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-6 shrink-0 overflow-x-auto hide-scrollbar">
                                    <button
                                        onClick={() => setDetailModal(prev => ({ ...prev, activeTab: "INFO" }))}
                                        className={`px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${detailModal.activeTab === "INFO" ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                                    >
                                        Profil & Aksi
                                    </button>
                                    <button
                                        onClick={() => setDetailModal(prev => ({ ...prev, activeTab: "NOTES" }))}
                                        className={`px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${detailModal.activeTab === "NOTES" ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                                    >
                                        Catatan Internal <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-xs">{detailModal.data.notes?.length || 0}</span>
                                    </button>
                                    <button
                                        onClick={() => setDetailModal(prev => ({ ...prev, activeTab: "AUDIT" }))}
                                        className={`px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${detailModal.activeTab === "AUDIT" ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                                    >
                                        Riwayat Log
                                    </button>
                                </div>

                                {/* TAB CONTENT: INFO */}
                                {detailModal.activeTab === "INFO" && (
                                    <div className="space-y-6 animate-in fade-in">
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-zinc-50/50 dark:bg-zinc-950/20 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                                            <div>
                                                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Kontak</p>
                                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{detailModal.data.contact || "-"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Sumber</p>
                                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{detailModal.data.source || "Manual"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">PIC (Pemilik)</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                                                        {detailModal.data.mitra?.name?.charAt(0) || "O"}
                                                    </span>
                                                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{detailModal.data.mitra ? detailModal.data.mitra.name : "Owner"}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">Status Integrasi</p>
                                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{detailModal.data.project ? "Terkoneksi (Project)" : "Data Lepas"}</p>
                                            </div>
                                        </div>

                                        {detailModal.data.status !== "DEAL" && detailModal.data.status !== "CANCEL" && (
                                            <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 p-5 rounded-xl">
                                                <h4 className="text-sm font-bold text-indigo-900 dark:text-white mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-indigo-500" /> Pengambilan Keputusan</h4>
                                                <p className="text-sm text-indigo-700/80 dark:text-indigo-200 mb-4">Lead ini masih menunggu persetujuan. Segera konversikan menjadi sebuah proyek nyata jika negosiasi sudah deal.</p>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => {
                                                            setProjectName(`Project ${detailModal.data.name}`);
                                                            setConvertModal({ open: true, leadId: detailModal.data.id, name: detailModal.data.name });
                                                        }}
                                                        className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 transition-colors"
                                                    >
                                                        <FileText className="w-4 h-4" /> Final Deal (Buat Project)
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setNewStatus(detailModal.data.status);
                                                            setStatusModal({ open: true, leadId: detailModal.data.id, currentStatus: detailModal.data.status, name: detailModal.data.name });
                                                        }}
                                                        className="h-10 px-5 bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold transition-colors"
                                                    >
                                                        Ubah Status
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {detailModal.data.status === "DEAL" && (
                                            <div className="p-5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-400 mb-1">Lead Sukses</h4>
                                                    <p className="text-sm text-emerald-700 dark:text-emerald-500/80">Data ini telah berhasil dikonversi dan diamankan.</p>
                                                </div>
                                                {detailModal.data.project && (
                                                    <button className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors">Lihat Project</button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TAB CONTENT: NOTES */}
                                {detailModal.activeTab === "NOTES" && (
                                    <div className="flex flex-col h-full animate-in fade-in pb-10">
                                        <form onSubmit={handleAddNote} className="mb-6 shrink-0">
                                            <div className="relative">
                                                <textarea
                                                    required
                                                    value={newNote}
                                                    onChange={(e) => setNewNote(e.target.value)}
                                                    placeholder="Tulis ringkasan hasil meeting atau interaksi dengan klien ini..."
                                                    className="w-full min-h-[100px] p-4 bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y"
                                                ></textarea>
                                                <div className="mt-3 flex justify-end">
                                                    <button
                                                        type="submit"
                                                        disabled={isProcessing || !newNote.trim()}
                                                        className="h-10 px-5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl text-[13px] font-bold shadow-sm transition-colors disabled:opacity-50"
                                                    >
                                                        {isProcessing ? "Menyimpan..." : "Tambah Catatan"}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>

                                        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                                            {detailModal.data.notes?.length === 0 ? (
                                                <div className="text-center py-10 text-zinc-500 text-sm">Belum ada catatan apa pun. Catatan internal bantu merekam alur negosiasi.</div>
                                            ) : (
                                                detailModal.data.notes.map((note: any) => (
                                                    <div key={note.id} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-100 dark:border-zinc-800 flex gap-4 transition-all hover:bg-white dark:hover:bg-zinc-800/40 hover:shadow-sm">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                                                            {note.createdBy?.charAt(0) || "O"}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1.5">
                                                                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{note.createdBy || "Owner"}</span>
                                                                <span className="text-xs text-zinc-500">&bull; {format(new Date(note.createdAt), "dd MMM HH:mm", { locale: id })}</span>
                                                            </div>
                                                            <p className="text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                                                                {note.content}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* TAB CONTENT: AUDIT LOG */}
                                {detailModal.activeTab === "AUDIT" && (
                                    <div className="bg-zinc-50/50 dark:bg-zinc-950/20 rounded-xl border border-zinc-100 dark:border-zinc-800/50 p-6 animate-in fade-in pb-12">
                                        <div className="relative pl-4 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-8">
                                            {detailModal.data.auditLogs?.length === 0 ? (
                                                <p className="text-xs text-zinc-500">Log bersih. Belum ada rekam perubahan.</p>
                                            ) : (
                                                detailModal.data.auditLogs.map((log: any) => (
                                                    <div key={log.id} className="relative group">
                                                        <div className="absolute w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600 group-hover:bg-indigo-500 -left-[21px] top-1 ring-4 ring-white dark:ring-zinc-900 transition-colors"></div>
                                                        <p className="text-xs font-bold text-zinc-500 mb-1 flex items-center gap-1.5">
                                                            <Clock className="w-3.5 h-3.5" /> {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm", { locale: id })}
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
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
