"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Plus,
    Filter,
    Search,
    X,
    Loader2,
    TrendingUp,
    Wallet,
    Calendar,
    Briefcase,
    Tag,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { IncomeTable, IncomeData } from "@/components/finance/income-table";
import { createIncome, updateIncome, deleteIncome } from "@/lib/actions/finance";

interface IncomeClientProps {
    initialData: IncomeData[];
    totalPages: number;
    currentPage: number;
    projects: { id: string; name: string }[];
}

export function IncomeClient({ initialData, totalPages, currentPage, projects }: IncomeClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State for Filter
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [projectFilter, setProjectFilter] = useState(searchParams.get("projectId") || "ALL");
    const [typeFilter, setTypeFilter] = useState(searchParams.get("paymentType") || "ALL");

    // State for Slide-over Panel (Form)
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [editingIncome, setEditingIncome] = useState<IncomeData | null>(null);

    // Form Fields
    const [formData, setFormData] = useState({
        projectId: "",
        date: new Date().toISOString().split("T")[0],
        paymentType: "DP",
        amount: "",
        notes: ""
    });

    const updateQueryParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "ALL") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`?${params.toString()}`);
    };

    const openCreatePanel = () => {
        setEditingIncome(null);
        setFormData({
            projectId: projects.length > 0 ? projects[0].id : "",
            date: new Date().toISOString().split("T")[0],
            paymentType: "DP",
            amount: "",
            notes: ""
        });
        setIsPanelOpen(true);
    };

    const openEditPanel = (income: IncomeData) => {
        setEditingIncome(income);
        setFormData({
            projectId: income.projectId,
            date: new Date(income.date).toISOString().split("T")[0],
            paymentType: income.paymentType,
            amount: income.amount.toString(),
            notes: income.notes || ""
        });
        setIsPanelOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const payload = {
                projectId: formData.projectId,
                date: new Date(formData.date),
                paymentType: formData.paymentType,
                amount: parseFloat(formData.amount),
                notes: formData.notes
            };

            if (editingIncome) {
                await updateIncome(editingIncome.id, payload);
            } else {
                await createIncome(payload);
            }

            setIsPanelOpen(false);
            router.refresh();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Hapus data pemasukan untuk project "${name}"?`)) return;

        try {
            await deleteIncome(id);
            router.refresh();
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Pemasukan</h1>
                        <p className="text-sm text-zinc-500">Kelola arus kas masuk dan termin pembayaran project.</p>
                    </div>
                </div>
                <button
                    onClick={openCreatePanel}
                    className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" /> Tambah Pemasukan
                </button>
            </div>

            {/* Filter Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Cari keterangan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && updateQueryParams("search", search)}
                        className="w-full h-10 pl-10 pr-4 bg-zinc-50 dark:bg-zinc-800/50 border-transparent rounded-xl text-sm focus:bg-white dark:focus:bg-zinc-800 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all"
                    />
                </div>

                {/* Project Filter */}
                <div className="relative">
                    <select
                        value={projectFilter}
                        onChange={(e) => { setProjectFilter(e.target.value); updateQueryParams("projectId", e.target.value); }}
                        className="w-full h-10 px-3 bg-zinc-50 dark:bg-zinc-800/50 border-transparent rounded-xl text-sm focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all appearance-none cursor-pointer"
                    >
                        <option value="ALL">Semua Project</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                {/* Type Filter */}
                <div className="relative">
                    <select
                        value={typeFilter}
                        onChange={(e) => { setTypeFilter(e.target.value); updateQueryParams("paymentType", e.target.value); }}
                        className="w-full h-10 px-3 bg-zinc-50 dark:bg-zinc-800/50 border-transparent rounded-xl text-sm focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all appearance-none cursor-pointer"
                    >
                        <option value="ALL">Semua Jenis</option>
                        <option value="DP">DP (Down Payment)</option>
                        <option value="PELUNASAN">Pelunasan</option>
                        <option value="LAINNYA">Lainnya</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => updateQueryParams("search", search)}
                        className="flex-1 h-10 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
                    >
                        Terapkan Filter
                    </button>
                    {(search || projectFilter !== "ALL" || typeFilter !== "ALL") && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setProjectFilter("ALL");
                                setTypeFilter("ALL");
                                router.push("/finance/income");
                            }}
                            className="w-10 h-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-xl hover:bg-zinc-200"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden p-1">
                <IncomeTable
                    data={initialData}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onEdit={openEditPanel}
                    onDelete={handleDelete}
                />
            </div>

            {/* Slide-over Form Panel */}
            {isPanelOpen && (
                <>
                    <div
                        className="fixed inset-0 z-[60] bg-zinc-950/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                        onClick={() => !isProcessing && setIsPanelOpen(false)}
                    />
                    <div className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl border-l border-zinc-200 dark:border-zinc-800 p-6 overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                                    <Wallet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-zinc-900 dark:text-white">
                                        {editingIncome ? "Edit Pemasukan" : "Input Pemasukan"}
                                    </h2>
                                    <p className="text-xs text-zinc-500">Isi data transaksi dengan teliti.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsPanelOpen(false)}
                                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 flex-1">
                            {/* Project Field */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-zinc-400" /> Project <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    required
                                    value={formData.projectId}
                                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                    className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white"
                                >
                                    {projects.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Field */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-zinc-400" /> Tanggal Transaksi <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white"
                                />
                            </div>

                            {/* Type Field */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-zinc-400" /> Jenis Pembayaran <span className="text-rose-500">*</span>
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {["DP", "PELUNASAN", "LAINNYA"].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, paymentType: type })}
                                            className={`h-10 rounded-xl text-[11px] font-bold border transition-all ${formData.paymentType === type
                                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                                    : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500"
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Amount Field */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-zinc-900 dark:text-white">Nominal (Rp) <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">Rp</span>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        placeholder="0"
                                        className="w-full h-12 pl-12 pr-4 bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-200 dark:border-indigo-500/20 rounded-xl text-lg font-black text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Notes Field */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-zinc-900 dark:text-white">Keterangan Tambahan</label>
                                <textarea
                                    rows={3}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Contoh: Pembayaran termin pertama via Transfer Bank Mandiri"
                                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white resize-none"
                                />
                            </div>

                            <div className="pt-4 mt-auto">
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : editingIncome ? "Update Transaksi" : "Simpan Pemasukan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
