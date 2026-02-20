"use client";

import React, { useState } from "react";
import {
    FileText,
    Download,
    Calendar,
    Search,
    Users,
    Briefcase,
    Wallet,
    TrendingUp,
    ArrowUpFromLine,
    CheckCircle2,
    Clock,
    AlertCircle,
    X,
    Loader2
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface ReportsClientProps {
    leadsReport: any;
    projectsReport: any;
    financeReport: any;
    profitReport: any;
}

type ReportType = "LEADS" | "PROJECTS" | "FINANCE" | "PROFIT";

export function ReportsClient({ leadsReport, projectsReport, financeReport, profitReport }: ReportsClientProps) {
    const [activeTab, setActiveTab] = useState<ReportType>("LEADS");
    const [isLoading, setIsLoading] = useState(false);

    // Filter local state
    const [dateRange, setDateRange] = useState({
        start: "",
        end: ""
    });

    const formatIDR = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleExport = () => {
        setIsLoading(true);
        try {
            let csvContent = "data:text/csv;charset=utf-8,";

            if (activeTab === "LEADS") {
                csvContent += "Nama,Kontak,Sumber,Status,Mitra,Tanggal\n";
                leadsReport.data.forEach((l: any) => {
                    csvContent += `${l.name},${l.contact},${l.source},${l.status},${l.mitra?.name || "-"},${format(new Date(l.createdAt), "yyyy-MM-dd")}\n`;
                });
            } else if (activeTab === "PROJECTS") {
                csvContent += "Nama Project,Klien,Status,PIC,Deadline\n";
                projectsReport.data.forEach((p: any) => {
                    csvContent += `${p.name},${p.clientName},${p.status},${p.pic?.name || "Owner"},${format(new Date(p.deadline), "yyyy-MM-dd")}\n`;
                });
            } else if (activeTab === "FINANCE") {
                csvContent += "Tipe,Project,Nominal,Tanggal\n";
                financeReport.incomes.forEach((i: any) => {
                    csvContent += `Pemasukan,${i.project.name},${i.amount},${format(new Date(i.date), "yyyy-MM-dd")}\n`;
                });
                financeReport.expenses.forEach((e: any) => {
                    csvContent += `Pengeluaran,${e.project?.name || "Operasional"},${e.amount},${format(new Date(e.date), "yyyy-MM-dd")}\n`;
                });
            } else if (activeTab === "PROFIT") {
                csvContent += "Project,Income,Expense,Profit\n";
                profitReport.data.forEach((p: any) => {
                    csvContent += `${p.name},${p.income},${p.expense},${p.profit}\n`;
                });
            }

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `VeloTrack_Report_${activeTab}_${format(new Date(), "yyyyMMdd")}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Reports Central</h1>
                        <p className="text-sm text-zinc-500">Analisis performa bisnis VeloTrack secara menyeluruh.</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExport}
                        disabled={isLoading}
                        className="h-11 px-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-zinc-900/10"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl w-fit border border-zinc-200 dark:border-zinc-800">
                <button
                    onClick={() => setActiveTab("LEADS")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === "LEADS" ? "bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
                >
                    <Users className="w-3.5 h-3.5" /> Laporan Lead
                </button>
                <button
                    onClick={() => setActiveTab("PROJECTS")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === "PROJECTS" ? "bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
                >
                    <Briefcase className="w-3.5 h-3.5" /> Laporan Project
                </button>
                <button
                    onClick={() => setActiveTab("FINANCE")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === "FINANCE" ? "bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
                >
                    <Wallet className="w-3.5 h-3.5" /> Laporan Keuangan
                </button>
                <button
                    onClick={() => setActiveTab("PROFIT")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === "PROFIT" ? "bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
                >
                    <TrendingUp className="w-3.5 h-3.5" /> Laporan Profit
                </button>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeTab === "LEADS" && (
                    <>
                        <SummaryCard title="Total Leads" value={leadsReport.summary.total} icon={<Users />} color="blue" />
                        <SummaryCard title="Leads Deal" value={leadsReport.summary.deal} icon={<CheckCircle2 />} color="emerald" />
                        <SummaryCard title="Leads Pending" value={leadsReport.summary.pending} icon={<Clock />} color="amber" />
                        <SummaryCard title="Rasio Deal" value={`${leadsReport.summary.ratio.toFixed(1)}%`} icon={<TrendingUp />} color="indigo" />
                    </>
                )}
                {activeTab === "PROJECTS" && (
                    <>
                        <SummaryCard title="Total Project" value={projectsReport.summary.total} icon={<Briefcase />} color="purple" />
                        <SummaryCard title="Project Aktif" value={projectsReport.summary.active} icon={<Clock />} color="blue" />
                        <SummaryCard title="Project Selesai" value={projectsReport.summary.done} icon={<CheckCircle2 />} color="emerald" />
                        <SummaryCard title="Rata Durasi" value={`${projectsReport.summary.avgDuration.toFixed(1)} Hari`} icon={<AlertCircle />} color="orange" />
                    </>
                )}
                {activeTab === "FINANCE" && (
                    <>
                        <SummaryCard title="Total Pemasukan" value={formatIDR(financeReport.summary.totalIncome)} icon={<TrendingUp />} color="emerald" />
                        <SummaryCard title="Total Pengeluaran" value={formatIDR(financeReport.summary.totalExpense)} icon={<Wallet />} color="rose" />
                        <SummaryCard title="Net Flow" value={formatIDR(financeReport.summary.totalIncome - financeReport.summary.totalExpense)} icon={<FileText />} color="indigo" />
                        <SummaryCard title="Total Transaksi" value={financeReport.incomes.length + financeReport.expenses.length} icon={<Search />} color="zinc" />
                    </>
                )}
                {activeTab === "PROFIT" && (
                    <>
                        <SummaryCard title="Total Laba" value={formatIDR(profitReport.summary.totalProfit)} icon={<TrendingUp />} color="emerald" />
                        <SummaryCard title="Margin Bruto" value={formatIDR(profitReport.summary.totalIncome)} icon={<Wallet />} color="zinc" />
                        <SummaryCard title="Total Biaya" value={formatIDR(profitReport.summary.totalExpense)} icon={<ArrowUpFromLine />} color="rose" />
                        <SummaryCard title="Margin Efisiensi" value={`${(profitReport.summary.totalIncome > 0 ? (profitReport.summary.totalProfit / profitReport.summary.totalIncome) * 100 : 0).toFixed(1)}%`} icon={<FileText />} color="indigo" />
                    </>
                )}
            </div>

            {/* List Table Area */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <h3 className="text-lg font-black text-zinc-900 dark:text-white">Detail Data Laporan</h3>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg">
                        Real-time Snapshot
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-zinc-50/50 dark:bg-zinc-800/30 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800/50">
                            {activeTab === "LEADS" && (
                                <tr>
                                    <th className="py-4 px-6">Nama</th>
                                    <th className="py-4 px-6">Kontak</th>
                                    <th className="py-4 px-6">Sumber</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6">Mitra</th>
                                    <th className="py-4 px-6 text-right">Tanggal</th>
                                </tr>
                            )}
                            {activeTab === "PROJECTS" && (
                                <tr>
                                    <th className="py-4 px-6">Nama Project</th>
                                    <th className="py-4 px-6">Klien</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6">PIC</th>
                                    <th className="py-4 px-6 text-right">Deadline</th>
                                </tr>
                            )}
                            {activeTab === "FINANCE" && (
                                <tr>
                                    <th className="py-4 px-6">Tipe</th>
                                    <th className="py-4 px-6">Project / Keperluan</th>
                                    <th className="py-4 px-6">Kategori / Komponen</th>
                                    <th className="py-4 px-6">Nominal</th>
                                    <th className="py-4 px-6 text-right">Tanggal</th>
                                </tr>
                            )}
                            {activeTab === "PROFIT" && (
                                <tr>
                                    <th className="py-4 px-6">Nama Project</th>
                                    <th className="py-4 px-6">Total Income</th>
                                    <th className="py-4 px-6">Total Expense</th>
                                    <th className="py-4 px-6 font-bold text-zinc-900 dark:text-white">Laba Bersih</th>
                                    <th className="py-4 px-6 text-right">Margin (%)</th>
                                </tr>
                            )}
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                            {activeTab === "LEADS" && leadsReport.data.map((l: any) => (
                                <tr key={l.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-800/20 transition-colors">
                                    <td className="py-4 px-6 text-[13px] font-bold text-zinc-900 dark:text-white">{l.name}</td>
                                    <td className="py-4 px-6 text-[13px] text-zinc-500">{l.contact}</td>
                                    <td className="py-4 px-6 text-[13px] text-zinc-500 lowercase">{l.source}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-tight ${l.status === "DEAL" ? "bg-emerald-100 text-emerald-700" : l.status === "CANCEL" ? "bg-rose-100 text-rose-700" : "bg-zinc-100 text-zinc-600"}`}>
                                            {l.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-[13px] text-zinc-600 font-medium">{l.mitra?.name || "-"}</td>
                                    <td className="py-4 px-6 text-[11px] text-zinc-400 text-right">{format(new Date(l.createdAt), "dd/MM/yy")}</td>
                                </tr>
                            ))}
                            {activeTab === "PROJECTS" && projectsReport.data.map((p: any) => (
                                <tr key={p.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-800/20 transition-colors">
                                    <td className="py-4 px-6 text-[13px] font-bold text-zinc-900 dark:text-white">{p.name}</td>
                                    <td className="py-4 px-6 text-[13px] text-zinc-500">{p.clientName}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-tight ${p.status === "DONE" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-[13px] text-zinc-600 font-medium">{p.pic?.name || "Owner"}</td>
                                    <td className="py-4 px-6 text-[11px] text-zinc-400 text-right">{format(new Date(p.deadline), "dd/MM/yy")}</td>
                                </tr>
                            ))}
                            {activeTab === "FINANCE" && (
                                <>
                                    {financeReport.incomes.map((i: any) => (
                                        <tr key={i.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-800/20 transition-colors">
                                            <td className="py-4 px-6 text-[11px] font-black text-emerald-600">INCOME</td>
                                            <td className="py-4 px-6 text-[13px] font-bold text-zinc-900 dark:text-white">{i.project.name}</td>
                                            <td className="py-4 px-6 text-[12px] text-zinc-500">Termin/Pelunasan</td>
                                            <td className="py-4 px-6 text-[13px] font-black text-zinc-900 dark:text-white">{formatIDR(i.amount)}</td>
                                            <td className="py-4 px-6 text-[11px] text-zinc-400 text-right">{format(new Date(i.date), "dd/MM/yy")}</td>
                                        </tr>
                                    ))}
                                    {financeReport.expenses.map((e: any) => (
                                        <tr key={e.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-800/20 transition-colors">
                                            <td className="py-4 px-6 text-[11px] font-black text-rose-600">EXPENSE</td>
                                            <td className="py-4 px-6 text-[13px] font-bold text-zinc-900 dark:text-white">{e.project?.name || "Operasional"}</td>
                                            <td className="py-4 px-6 text-[12px] text-zinc-500 uppercase">{e.category}</td>
                                            <td className="py-4 px-6 text-[13px] font-black text-zinc-900 dark:text-white text-rose-500">({formatIDR(e.amount)})</td>
                                            <td className="py-4 px-6 text-[11px] text-zinc-400 text-right">{format(new Date(e.date), "dd/MM/yy")}</td>
                                        </tr>
                                    ))}
                                </>
                            )}
                            {activeTab === "PROFIT" && profitReport.data.map((p: any, idx: number) => (
                                <tr key={idx} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-800/20 transition-colors">
                                    <td className="py-4 px-6 text-[13px] font-bold text-zinc-900 dark:text-white">{p.name}</td>
                                    <td className="py-4 px-6 text-[13px] font-medium text-emerald-600">{formatIDR(p.income)}</td>
                                    <td className="py-4 px-6 text-[13px] font-medium text-rose-500">{formatIDR(p.expense)}</td>
                                    <td className="py-4 px-6 text-[14px] font-black text-zinc-900 dark:text-white">{formatIDR(p.profit)}</td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-16 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500" style={{ width: `${Math.min(Math.max(p.margin, 0), 100)}%` }} />
                                            </div>
                                            <span className="text-xs font-bold text-zinc-500">{p.margin.toFixed(0)}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) {
    const colors: any = {
        blue: "bg-blue-500 shadow-blue-500/20 text-blue-600",
        emerald: "bg-emerald-500 shadow-emerald-500/20 text-emerald-600",
        rose: "bg-rose-500 shadow-rose-500/20 text-rose-600",
        indigo: "bg-indigo-500 shadow-indigo-500/20 text-indigo-600",
        amber: "bg-amber-500 shadow-amber-500/20 text-amber-600",
        purple: "bg-purple-500 shadow-purple-500/20 text-purple-600",
        orange: "bg-orange-500 shadow-orange-500/20 text-orange-600",
        zinc: "bg-zinc-500 shadow-zinc-500/20 text-zinc-600",
    };

    return (
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:border-zinc-300 dark:hover:border-zinc-700 group">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-zinc-400 group-hover:${colors[color].split(" ")[2]}`}>
                    {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5" }) : icon}
                </div>
            </div>
            <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] mb-0.5">{title}</p>
            <h4 className="text-[18px] font-black text-zinc-900 dark:text-white leading-tight">{value}</h4>
        </div>
    );
}
