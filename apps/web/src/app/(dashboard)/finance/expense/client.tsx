"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Plus,
    Filter,
    Search,
    X,
    Loader2,
    ArrowUpFromLine,
    Calendar,
    Briefcase,
    Tag,
    Receipt,
    Building2,
} from "lucide-react";
import { ExpenseTable, ExpenseData } from "@/components/finance/expense-table";
import { createExpense, updateExpense, deleteExpense } from "@/lib/actions/finance";

interface ExpenseClientProps {
    initialData: ExpenseData[];
    totalPages: number;
    currentPage: number;
    projects: { id: string; name: string }[];
}

const CATEGORIES = ["SERVER", "DOMAIN", "TOOLS", "OPERASIONAL", "LAINNYA"];

export function ExpenseClient({ initialData, totalPages, currentPage, projects }: ExpenseClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State for Filter
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [projectFilter, setProjectFilter] = useState(searchParams.get("projectId") || "ALL");
    const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "ALL");

    // State for Slide-over Panel (Form)
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [editingExpense, setEditingExpense] = useState<ExpenseData | null>(null);

    // Form Fields
    const [formData, setFormData] = useState({
        projectId: "NONE",
        date: new Date().toISOString().split("T")[0],
        category: "OPERASIONAL",
        amount: "",
        notes: ""
    });

    const updateQueryParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "ALL" && value !== "NONE") {
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
        setEditingExpense(null);
        setFormData({
            projectId: "NONE",
            date: new Date().toISOString().split("T")[0],
            category: "OPERASIONAL",
            amount: "",
            notes: ""
        });
        setIsPanelOpen(true);
    };

    const openEditPanel = (expense: ExpenseData) => {
        setEditingExpense(expense);
        setFormData({
            projectId: expense.projectId || "NONE",
            date: new Date(expense.date).toISOString().split("T")[0],
            category: expense.category,
            amount: expense.amount.toString(),
            notes: expense.notes || ""
        });
        setIsPanelOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const payload = {
                projectId: formData.projectId === "NONE" ? null : formData.projectId,
                date: new Date(formData.date),
                category: formData.category,
                amount: parseFloat(formData.amount),
                notes: formData.notes
            };

            if (editingExpense) {
                await updateExpense(editingExpense.id, payload);
            } else {
                await createExpense(payload);
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
        if (!confirm(`Hapus data pengeluaran "${name}"?`)) return;

        try {
            await deleteExpense(id);
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
                    <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                        <ArrowUpFromLine className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Pengeluaran</h1>
                        <p className="text-sm text-zinc-500">Catat biaya operasional dan pengeluaran per project.</p>
                    </div>
                </div>
                <button
                    onClick={openCreatePanel}
                    className="h-11 px-6 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" /> Tambah Pengeluaran
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
                        className="w-full h-10 pl-10 pr-4 bg-zinc-50 dark:bg-zinc-800/50 border-transparent rounded-xl text-sm focus:bg-white dark:focus:bg-zinc-800 focus:ring-1 focus:ring-rose-500/30 outline-none transition-all"
                    />
                </div>

                {/* Project Filter */}
                <div className="relative">
                    <select
                        value={projectFilter}
                        onChange={(e) => { setProjectFilter(e.target.value); updateQueryParams("projectId", e.target.value); }}
                        className="w-full h-10 px-3 bg-zinc-50 dark:bg-zinc-800/50 border-transparent rounded-xl text-sm focus:ring-1 focus:ring-rose-500/30 outline-none transition-all appearance-none cursor-pointer"
                    >
                        <option value="ALL">Semua Keperluan</option>
                        <option value="NONE">Hanya Operasional</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                {/* Category Filter */}
                <div className="relative">
                    <select
                        value={categoryFilter}
                        onChange={(e) => { setCategoryFilter(e.target.value); updateQueryParams("category", e.target.value); }}
                        className="w-full h-10 px-3 bg-zinc-50 dark:bg-zinc-800/50 border-transparent rounded-xl text-sm focus:ring-1 focus:ring-rose-500/30 outline-none transition-all appearance-none cursor-pointer"
                    >
                        <option value="ALL">Semua Kategori</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => updateQueryParams("search", search)}
                        className="flex-1 h-10 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
                    >
                        Terapkan Filter
                    </button>
                    {(search || projectFilter !== "ALL" || categoryFilter !== "ALL") && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setProjectFilter("ALL");
                                setCategoryFilter("ALL");
                                router.push("/finance/expense");
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
                <ExpenseTable
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
                                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                                    <Receipt className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-zinc-900 dark:text-white">
                                        {editingExpense ? "Edit Pengeluaran" : "Input Pengeluaran"}
                                    </h2>
                                    <p className="text-xs text-zinc-500">Pisahkan biaya project & operasional.</p>
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
                                    <Briefcase className="w-4 h-4 text-zinc-400" /> Terkait Project?
                                </label>
                                <select
                                    value={formData.projectId}
                                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                    className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 outline-none dark:text-white"
                                >
                                    <option value="NONE">Tidak (Operasional Umum)</option>
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
                                    className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 outline-none dark:text-white"
                                />
                            </div>

                            {/* Category Field */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-zinc-400" /> Kategori Biaya <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 outline-none dark:text-white uppercase"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Amount Field */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-zinc-900 dark:text-white">Nominal Pengeluaran (Rp) <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">Rp</span>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        placeholder="0"
                                        className="w-full h-12 pl-12 pr-4 bg-rose-50/50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 rounded-xl text-lg font-black text-rose-600 dark:text-rose-400 focus:ring-2 focus:ring-rose-500/20 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Notes Field */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-zinc-900 dark:text-white">Keterangan / Deskripsi</label>
                                <textarea
                                    rows={3}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Contoh: Perpanjangan domain velotrack.io 1 tahun"
                                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 outline-none dark:text-white resize-none"
                                />
                            </div>

                            <div className="pt-4 mt-auto">
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : editingExpense ? "Update Transaksi" : "Simpan Pengeluaran"}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
