"use client";

import React, { useState } from "react";
import {
    Settings,
    Users,
    Bell,
    Database,
    Key,
    Save,
    Globe,
    Smartphone,
    MessageSquare,
    Zap,
    History,
    CheckCircle2,
    Loader2
} from "lucide-react";

import { updateSettings } from "@/lib/actions/settings";
import { testWhatsAppConnection, saveFonnteToken } from "@/lib/actions/whatsapp";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface SettingsClientProps {
    initialSettings: Record<string, string>;

    auditLogs: any[];
}

export function SettingsClient({ initialSettings, auditLogs }: SettingsClientProps) {
    const [activeTab, setActiveTab] = useState("general");
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState(initialSettings);

    // WhatsApp Integration State
    const [fonnteToken, setFonnteToken] = useState(initialSettings.FONNTE_TOKEN || "");
    const [waStatus, setWaStatus] = useState<{ tested: boolean; success: boolean; message: string }>({ tested: false, success: false, message: "" });
    const [isTesting, setIsTesting] = useState(false);
    const [isSavingToken, setIsSavingToken] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateSettings(settings);
            alert("Pengaturan sistem berhasil disimpan.");
        } catch (e: any) {
            alert(e.message);
        } finally {
            setIsSaving(false);
        }
    };

    const TABS = [
        { id: "general", label: "General", icon: <Settings size={18} /> },
        { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
        { id: "integrations", label: "Integrations", icon: <Zap size={18} /> },
        { id: "audit", label: "Audit Logs", icon: <History size={18} /> },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-8 pb-20">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-72 shrink-0 space-y-2">
                <div className="mb-6 px-2">
                    <h1 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Settings</h1>
                    <p className="text-sm text-zinc-500">Konfigurasi & kontrol akses pusat.</p>
                </div>

                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all ${activeTab === tab.id
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 bg-white dark:bg-zinc-900/50 rounded-[32px] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">

                {activeTab === "general" && (
                    <form onSubmit={handleSave} className="p-8 space-y-8">
                        <SectionHeader title="Aplikasi & Branding" description="Informasi dasar mengenai identitas platform VeloTrack Anda." />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup
                                label="Nama Aplikasi"
                                value={settings.app_name || "VeloTrack"}
                                onChange={(val) => setSettings({ ...settings, app_name: val })}
                                placeholder="VeloTrack Management"
                            />
                            <InputGroup
                                label="Brand Name"
                                value={settings.brand_name || "Velora"}
                                onChange={(val) => setSettings({ ...settings, brand_name: val })}
                                placeholder="Velora Indonesia"
                            />
                            <SelectGroup
                                label="Mata Uang"
                                value={settings.currency || "IDR"}
                                onChange={(val) => setSettings({ ...settings, currency: val })}
                                options={[{ label: "IDR - Rupiah Indonesia", value: "IDR" }]}
                            />
                            <SelectGroup
                                label="Format Tanggal"
                                value={settings.date_format || "DD MMM YYYY"}
                                onChange={(val) => setSettings({ ...settings, date_format: val })}
                                options={[{ label: "25 Feb 2026", value: "DD MMM YYYY" }, { label: "25/02/2026", value: "DD/MM/YYYY" }]}
                            />
                        </div>

                        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                            <button
                                disabled={isSaving}
                                className="h-11 px-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:opacity-90 disabled:opacity-50 transition-all"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                )}



                {activeTab === "notifications" && (
                    <div className="p-8 space-y-8">
                        <SectionHeader title="Notifikasi Sistem" description="Atur kapan dan melalui jalur mana notifikasi akan dikirimkan." />

                        <div className="space-y-4">
                            <ToggleRow label="Notifikasi Pendaftaran Lead (WhatsApp)" active={true} />
                            <ToggleRow label="Notifikasi Pendaftaran Lead (Email)" active={false} />
                            <ToggleRow label="Notifikasi Deadline Project H-1" active={true} />
                            <ToggleRow label="Notifikasi Project Overdue" active={true} />
                        </div>
                    </div>
                )}

                {activeTab === "integrations" && (
                    <div className="p-8 space-y-8">
                        <SectionHeader title="API & Integrasi" description="Hubungkan VeloTrack dengan layanan pihak ketiga." />

                        <div className="grid grid-cols-1 gap-6">
                            {/* WhatsApp Fonnte — Fungsional */}
                            <div className="p-6 bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                                            <MessageSquare className="w-5 h-5 text-emerald-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-[14px] font-bold text-zinc-900 dark:text-white">WhatsApp Gateway (Fonnte)</h4>
                                            <p className="text-xs text-zinc-500">Kirim dokumen & notifikasi otomatis ke WhatsApp.</p>
                                        </div>
                                    </div>
                                    {waStatus.tested && (
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${waStatus.success ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"}`}>
                                            {waStatus.success ? "✓ Terhubung" : "✗ Gagal"}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Fonnte API Token</label>
                                    <input
                                        type="password"
                                        value={fonnteToken}
                                        onChange={(e) => setFonnteToken(e.target.value)}
                                        placeholder="Masukkan token dari dashboard Fonnte..."
                                        className="w-full h-11 px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:text-white"
                                    />
                                </div>

                                {waStatus.tested && (
                                    <div className={`p-3 rounded-xl text-sm ${waStatus.success ? "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20" : "bg-rose-50 dark:bg-rose-900/10 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20"}`}>
                                        {waStatus.message}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        disabled={!fonnteToken.trim() || isTesting}
                                        onClick={async () => {
                                            setIsTesting(true);
                                            setWaStatus({ tested: false, success: false, message: "" });
                                            try {
                                                const result = await testWhatsAppConnection(fonnteToken);
                                                setWaStatus({ tested: true, success: result.success, message: result.message });
                                            } catch (err: any) {
                                                setWaStatus({ tested: true, success: false, message: err.message });
                                            } finally {
                                                setIsTesting(false);
                                            }
                                        }}
                                        className="h-10 px-5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isTesting ? <><Loader2 className="w-4 h-4 animate-spin" /> Testing...</> : "Test Connection"}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!fonnteToken.trim() || isSavingToken}
                                        onClick={async () => {
                                            setIsSavingToken(true);
                                            try {
                                                const result = await saveFonnteToken(fonnteToken);
                                                alert(result.message);
                                            } catch (err: any) {
                                                alert(err.message);
                                            } finally {
                                                setIsSavingToken(false);
                                            }
                                        }}
                                        className="h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isSavingToken ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4" /> Simpan Token</>}
                                    </button>
                                </div>
                            </div>

                            {/* Telegram — Placeholder */}
                            <div className="p-6 bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4 opacity-60">
                                <div className="flex items-center gap-3 mb-2">
                                    <Smartphone className="w-6 h-6 text-blue-500" />
                                    <div>
                                        <h4 className="text-[14px] font-bold text-zinc-900 dark:text-white">Telegram Bot</h4>
                                        <p className="text-xs text-zinc-500">Notifikasi real-time via Telegram Channel. (Coming Soon)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "audit" && (
                    <div className="p-8 space-y-8">
                        <SectionHeader title="Log Aktivitas Sistem" description="Audit jejak digital setiap aksi yang dilakukan oleh pengguna." />

                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 dark:bg-zinc-800/50">
                                    <tr>
                                        <th className="py-3 px-4 rounded-l-lg">User</th>
                                        <th className="py-3 px-4">Action</th>
                                        <th className="py-3 px-4">Details</th>
                                        <th className="py-3 px-4 text-right rounded-r-lg">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                                    {auditLogs.map((log) => (
                                        <tr key={log.id} className="text-[12px]">
                                            <td className="py-4 px-4 font-bold text-zinc-900 dark:text-white">{log.user.name}</td>
                                            <td className="py-4 px-4 font-mono text-xs">{log.action}</td>
                                            <td className="py-4 px-4 text-zinc-500 max-w-[300px] truncate" title={log.details || ""}>{log.details}</td>
                                            <td className="py-4 px-4 text-right text-zinc-400">{format(new Date(log.createdAt), "dd MMM HH:mm")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}

function SectionHeader({ title, description }: { title: string, description: string }) {
    return (
        <div className="mb-6">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">{title}</h3>
            <p className="text-xs text-zinc-500 mt-1">{description}</p>
        </div>
    );
}

function InputGroup({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder: string }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white transition-all"
            />
        </div>
    );
}

function SelectGroup({ label, value, onChange, options }: { label: string, value: string, onChange: (v: string) => void, options: { label: string, value: string }[] }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-[13px] font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white transition-all appearance-none cursor-pointer"
            >
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
    );
}

function ToggleRow({ label, active }: { label: string, active: boolean }) {
    const [isOn, setIsOn] = useState(active);
    return (
        <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <span className="text-[13px] font-bold text-zinc-700 dark:text-zinc-300">{label}</span>
            <button
                onClick={() => setIsOn(!isOn)}
                className={`w-10 h-5 rounded-full transition-colors relative ${isOn ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-700"}`}
            >
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isOn ? "right-1" : "left-1"}`} />
            </button>
        </div>
    );
}
