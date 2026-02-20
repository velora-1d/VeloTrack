"use client";

import React, { useState } from "react";
import {
    Plus,
    UserPlus,
    Pencil,
    Trash2,
    X,
    Loader2,
    CheckCircle2,
    AlertCircle,
    UserCircle2,
    Mail,
    ShieldCheck
} from "lucide-react";
import { createMitraAccount, updateMitraAccount, deleteMitraAccount } from "@/lib/actions/settings";

interface Mitra {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
}

interface MitraManagementProps {
    initialData: Mitra[];
}

export function MitraManagement({ initialData }: MitraManagementProps) {
    const [mitras, setMitras] = useState(initialData);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [editingMitra, setEditingMitra] = useState<Mitra | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: ""
    });

    const openCreatePanel = () => {
        setEditingMitra(null);
        setFormData({ name: "", email: "" });
        setIsPanelOpen(true);
    };

    const openEditPanel = (mitra: Mitra) => {
        setEditingMitra(mitra);
        setFormData({ name: mitra.name, email: mitra.email });
        setIsPanelOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            if (editingMitra) {
                await updateMitraAccount(editingMitra.id, formData);
            } else {
                await createMitraAccount(formData);
            }

            // Re-fetch or simplistic update (actually revalidate handle by router.refresh, but here in same page context)
            window.location.reload(); // Quickest way to sync all
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Hapus akun Mitra "${name}"? Access Mitra tersebut akan otomatis terhenti.`)) return;

        try {
            await deleteMitraAccount(id);
            window.location.reload();
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-zinc-900 dark:text-white">Manajemen Akun Mitra</h3>
                    <p className="text-xs text-zinc-500 mt-1">Kelola akses mitra yang bekerja sama dengan VeloTrack.</p>
                </div>
                <button
                    onClick={openCreatePanel}
                    className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" /> Tambah Mitra
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mitras.length === 0 ? (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                        <UserCircle2 className="w-12 h-12 text-zinc-300 mb-2" />
                        <p className="text-sm text-zinc-500 font-medium">Belum ada akun Mitra terdaftar.</p>
                    </div>
                ) : (
                    mitras.map((mitra) => (
                        <div key={mitra.id} className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm group hover:border-indigo-500/30 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                                    <UserCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => openEditPanel(mitra)}
                                        className="p-2 text-zinc-400 hover:text-amber-500 transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(mitra.id, mitra.name)}
                                        className="p-2 text-zinc-400 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h4 className="text-[15px] font-black text-zinc-900 dark:text-white transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{mitra.name}</h4>
                            <p className="text-[12px] text-zinc-500 flex items-center gap-1.5 mt-1">
                                <Mail className="w-3.5 h-3.5" /> {mitra.email}
                            </p>

                            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Akses: MITRA</span>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Panel Form */}
            {isPanelOpen && (
                <>
                    <div
                        className="fixed inset-0 z-[60] bg-zinc-950/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                        onClick={() => !isProcessing && setIsPanelOpen(false)}
                    />
                    <div className="fixed inset-y-0 right-0 z-[70] w-full max-w-sm bg-white dark:bg-zinc-900 shadow-2xl border-l border-zinc-200 dark:border-zinc-800 p-8 overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                                    <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                                    {editingMitra ? "Edit Mitra" : "Mitra Baru"}
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsPanelOpen(false)}
                                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: Ahmad Mitra"
                                    className="w-full h-12 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white font-medium"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Alamat Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="mitra@velotrack.id"
                                    className="w-full h-12 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white font-medium"
                                />
                                <p className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Email ini akan digunakan untuk login sistem.
                                </p>
                            </div>

                            <div className="pt-8 mt-auto">
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : editingMitra ? "Update Akun" : "Daftarkan Mitra"}
                                </button>
                                <p className="text-[10px] text-zinc-400 text-center mt-4 italic">Password default akan di-generate otomatis oleh sistem.</p>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
