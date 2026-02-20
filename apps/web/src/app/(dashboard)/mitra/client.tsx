"use client";

import React, { useState } from "react";
import {
    Plus,
    UserPlus,
    Pencil,
    Trash2,
    X,
    Loader2,
    UserCircle2,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    ShieldCheck,
    Search
} from "lucide-react";
import { createMitraAccount, updateMitraAccount, deleteMitraAccount, MitraPayload } from "@/lib/actions/mitra";

interface Mitra {
    id: string;
    name: string;
    email: string | null;
    username: string | null;
    whatsapp: string | null;
    address: string | null;
    bankName: string | null;
    bankAccount: string | null;
    bankHolder: string | null;
    createdAt: Date;
}

interface MitraClientProps {
    initialData: Mitra[];
}

export function MitraClient({ initialData }: MitraClientProps) {
    const [mitras, setMitras] = useState(initialData);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [editingMitra, setEditingMitra] = useState<Mitra | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [formData, setFormData] = useState<MitraPayload>({
        name: "",
        email: "",
        username: "",
        password: "",
        whatsapp: "",
        address: "",
        bankName: "",
        bankAccount: "",
        bankHolder: ""
    });

    const openCreatePanel = () => {
        setEditingMitra(null);
        setFormData({
            name: "", email: "", username: "", password: "",
            whatsapp: "", address: "", bankName: "", bankAccount: "", bankHolder: ""
        });
        setIsPanelOpen(true);
    };

    const openEditPanel = (mitra: Mitra) => {
        setEditingMitra(mitra);
        setFormData({
            name: mitra.name,
            email: mitra.email || "",
            username: mitra.username || "",
            whatsapp: mitra.whatsapp || "",
            address: mitra.address || "",
            bankName: mitra.bankName || "",
            bankAccount: mitra.bankAccount || "",
            bankHolder: mitra.bankHolder || ""
        });
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
            window.location.reload();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Hapus akun Mitra "${name}"? Seluruh data relasi akan tetap ada namun mitra tidak bisa login.`)) return;
        try {
            await deleteMitraAccount(id);
            window.location.reload();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const filteredMitras = mitras.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">Daftar Mitra</h1>
                    <p className="text-sm text-zinc-500 mt-1">Kelola data profesional dan akses login seluruh mitra VeloTrack.</p>
                </div>
                <button
                    onClick={openCreatePanel}
                    className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[13px] font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Tambah Mitra Baru
                </button>
            </div>

            {/* toolbar */}
            <div className="relative group max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Cari nama atau username mitra..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[13px] outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMitras.length === 0 ? (
                    <div className="col-span-full py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-[40px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                            <UserCircle2 className="w-10 h-10 text-zinc-300" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Tidak ada mitra ditemukan</h3>
                        <p className="text-sm text-zinc-500 max-w-xs mt-1">Coba gunakan kata kunci pencarian lain atau tambahkan mitra baru.</p>
                    </div>
                ) : (
                    filteredMitras.map((mitra) => (
                        <div key={mitra.id} className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                            {/* Card Top: Identity */}
                            <div className="p-6 pb-4 border-b border-zinc-50 dark:border-zinc-800/50">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <UserCircle2 className="w-6 h-6" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => openEditPanel(mitra)} className="p-2.5 text-zinc-400 hover:text-amber-500 transition-colors bg-zinc-50 dark:bg-zinc-800 rounded-xl"><Pencil className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(mitra.id, mitra.name)} className="p-2.5 text-zinc-400 hover:text-rose-500 transition-colors bg-zinc-50 dark:bg-zinc-800 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-black text-zinc-900 dark:text-white leading-tight uppercase tracking-tight">{mitra.name}</h3>
                                <div className="flex flex-wrap gap-3 mt-3">
                                    <div className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                        @{mitra.username || "unset"}
                                    </div>
                                    <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                        Aktif
                                    </div>
                                </div>
                            </div>

                            {/* Card Middle: Contact Info */}
                            <div className="p-6 space-y-3">
                                <InfoRow icon={<Phone />} label="WhatsApp" value={mitra.whatsapp || "-"} />
                                <InfoRow icon={<Mail />} label="Email" value={mitra.email || "-"} />
                                <InfoRow icon={<MapPin />} label="Alamat" value={mitra.address || "-"} className="line-clamp-1" />
                            </div>

                            {/* Card Bottom: Bank Info */}
                            <div className="mx-6 px-4 py-3 bg-zinc-50 dark:bg-zinc-800+30 rounded-2xl flex items-center gap-4 mb-6">
                                <CreditCard className="w-5 h-5 text-indigo-500 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Pencairan Dana</p>
                                    <p className="text-[12px] font-bold text-zinc-900 dark:text-zinc-200 mt-1 truncate">
                                        {mitra.bankName ? `${mitra.bankName} - ${mitra.bankAccount}` : "Belum diatur"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Panel Form Slide-over */}
            {isPanelOpen && (
                <>
                    <div className="fixed inset-0 z-[60] bg-zinc-950/40 backdrop-blur-sm transition-opacity" onClick={() => !isProcessing && setIsPanelOpen(false)} />
                    <div className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl p-8 overflow-y-auto animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
                                {editingMitra ? "Edit Profil Mitra" : "Mitra Baru"}
                            </h2>
                            <button onClick={() => setIsPanelOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-50 dark:bg-zinc-800 rounded-xl"><X /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Section: Identitas Dasar */}
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest border-b border-indigo-500/10 pb-2">Informasi Dasar</h4>
                                <FormInput label="Nama Lengkap" required value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} placeholder="Ahmad Suherman" />
                                <FormInput label="WhatsApp" value={formData.whatsapp || ""} onChange={(v) => setFormData({ ...formData, whatsapp: v })} placeholder="0812xxxx" />
                                <FormInput label="Email (Opsional)" type="email" value={formData.email || ""} onChange={(v) => setFormData({ ...formData, email: v })} placeholder="ahmad@velotrack.id" />
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Alamat Lengkap</label>
                                    <textarea
                                        className="w-full h-24 p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white transition-all resize-none"
                                        value={formData.address || ""}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Jl. Merdeka No. 12..."
                                    />
                                </div>
                            </div>

                            {/* Section: Akses Login */}
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-bold text-sky-500 uppercase tracking-widest border-b border-sky-500/10 pb-2">Kredensial Akses</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput label="Username" required={!editingMitra} value={formData.username || ""} onChange={(v) => setFormData({ ...formData, username: v })} placeholder="ahmad_mitra" />
                                    <FormInput label="Password" type="password" required={!editingMitra} value={formData.password || ""} onChange={(v) => setFormData({ ...formData, password: v })} placeholder="••••••••" />
                                </div>
                                <p className="text-[10px] text-zinc-500 flex items-center gap-2 px-1"><ShieldCheck size={14} className="text-emerald-500" /> Username digunakan untuk login mitra di dashboard.</p>
                            </div>

                            {/* Section: Perbankan */}
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-bold text-amber-500 uppercase tracking-widest border-b border-amber-500/10 pb-2">Informasi Pembayaran</h4>
                                <FormInput label="Nama Bank" value={formData.bankName || ""} onChange={(v) => setFormData({ ...formData, bankName: v })} placeholder="BCA / Mandiri / BNI" />
                                <FormInput label="Nomor Rekening" value={formData.bankAccount || ""} onChange={(v) => setFormData({ ...formData, bankAccount: v })} placeholder="1234567890" />
                                <FormInput label="Pemilik Rekening" value={formData.bankHolder || ""} onChange={(v) => setFormData({ ...formData, bankHolder: v })} placeholder="Atas Nama Siapa" />
                            </div>

                            <div className="pt-8">
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full h-12 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-2xl font-bold shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? <Loader2 className="animate-spin" /> : editingMitra ? "Simpan Perubahan" : "Daftarkan Mitra Baru"}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}

function InfoRow({ icon, label, value, className = "" }: { icon: React.ReactNode, label: string, value: string, className?: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                {React.cloneElement(icon as React.ReactElement<any>, { size: 14 })}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className={cn("text-[13px] font-medium text-zinc-700 dark:text-zinc-300", className)}>{value}</p>
            </div>
        </div>
    );
}

function FormInput({ label, value, onChange, placeholder, type = "text", required = false }: { label: string, value: string, onChange: (v: string) => void, placeholder: string, type?: string, required?: boolean }) {
    return (
        <div className="space-y-1.5 text-left">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{label} {required && <span className="text-rose-500">*</span>}</label>
            <input
                type={type}
                required={required}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white transition-all font-medium"
            />
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
