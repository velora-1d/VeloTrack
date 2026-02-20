"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
    TrendingUp,
    BarChart3,
    PieChart as PieChartIcon,
    Layers,
    Activity,
    Target
} from "lucide-react";

type DashboardChartsProps = {
    lineChartData: any[];
    barChartData: any[];
    projectPieData: any[];
    leadPieData: any[];
    expenseCategoryData: any[];
    isLoading?: boolean;
}

// Stagger animation
const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.15 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring" as const, stiffness: 260, damping: 22 }
    }
};

// Custom tooltip — premium
function CustomTooltip({ active, payload, label, formatter }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="glass-card rounded-xl p-3 shadow-2xl !border-zinc-200/60 dark:!border-zinc-700/60">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">{label}</p>
            {payload.map((entry: any, i: number) => (
                <div key={i} className="flex items-center gap-2.5 text-sm py-0.5">
                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                    <span className="text-zinc-500 dark:text-zinc-400 text-xs">{entry.name}:</span>
                    <span className="text-zinc-900 dark:text-white font-bold text-xs">
                        {formatter ? formatter(entry.value) : entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
}

// Chart card wrapper — glassmorphism
function ChartCard({ title, icon: Icon, gradient, glowColor, children }: {
    title: string;
    icon: any;
    gradient: string;
    glowColor: string;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            variants={itemVariants}
            className="group glass-card gradient-border rounded-2xl p-5 transition-all duration-300 overflow-hidden relative"
        >
            {/* Background glow on hover */}
            <div
                className="absolute -right-10 -top-10 w-36 h-36 rounded-full blur-3xl opacity-0 group-hover:opacity-25 transition-all duration-700 pointer-events-none"
                style={{ backgroundColor: glowColor }}
            />

            {/* Glow on hover */}

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
                        style={{ boxShadow: `0 4px 12px ${glowColor}` }}
                    >
                        <Icon className="w-4.5 h-4.5 text-white" strokeWidth={2} />
                    </div>
                    <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200 tracking-tight">{title}</h3>
                </div>
                {children}
            </div>
        </motion.div>
    );
}

// Donut center label
function DonutCenterLabel({ data }: { data: any[] }) {
    const total = data.reduce((sum, d) => sum + (d.name !== "Kosong" ? d.value : 0), 0);
    return (
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-zinc-900 dark:fill-white">
            <tspan x="50%" dy="-6" className="text-2xl font-extrabold">{total}</tspan>
            <tspan x="50%" dy="22" className="text-[10px] font-semibold fill-zinc-400 dark:fill-zinc-500 uppercase tracking-wider">Total</tspan>
        </text>
    );
}

// Custom legend
function CustomLegend({ payload }: any) {
    if (!payload?.length) return null;
    return (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-3">
            {payload.map((entry: any, i: number) => (
                <div key={i} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{entry.value}</span>
                </div>
            ))}
        </div>
    );
}

export function DashboardCharts({
    lineChartData,
    barChartData,
    projectPieData,
    leadPieData,
    expenseCategoryData,
    isLoading
}: DashboardChartsProps) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const gridColor = isDark ? "#1e1e21" : "#f0f0f2";
    const textColor = isDark ? "#71717a" : "#a1a1aa";

    const COLORS = {
        blue: "#3b82f6",
        indigo: "#6366f1",
        emerald: "#10b981",
        rose: "#f43f5e",
        amber: "#f59e0b",
        violet: "#8b5cf6",
        cyan: "#06b6d4",
        teal: "#14b8a6",
    };

    const rupiahFormatter = (val: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);

    // Buat data chart ke-6 — ringkasan performa (income vs expense bar horizontal bisa diganti)
    const performanceData = barChartData.map(item => ({
        name: item.name,
        profit: (item.income || 0) - (item.expense || 0),
    }));

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="glass-card rounded-2xl p-5 animate-pulse" style={{ minHeight: '340px' }}>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                            <div className="w-32 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                        </div>
                        <div className="flex-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 h-[260px]" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={gridVariants}
            initial="hidden"
            animate="visible"
        >
            {/* 1. Area Chart: Leads & Projects */}
            <ChartCard title="Pertumbuhan Leads & Project" icon={TrendingUp} gradient="from-blue-500 to-indigo-600" glowColor="rgba(59,130,246,0.25)">
                <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={lineChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradLeads" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradProjects" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.indigo} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={COLORS.indigo} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                            <XAxis dataKey="name" stroke={textColor} fontSize={10} tickLine={false} axisLine={false} dy={8} />
                            <YAxis stroke={textColor} fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={<CustomLegend />} />
                            <Area type="monotone" name="Leads" dataKey="leads" stroke={COLORS.blue} fill="url(#gradLeads)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: COLORS.blue }} />
                            <Area type="monotone" name="Project" dataKey="projects" stroke={COLORS.indigo} fill="url(#gradProjects)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: COLORS.indigo }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </ChartCard>

            {/* 2. Bar Chart: Pemasukan vs Pengeluaran */}
            <ChartCard title="Arus Kas" icon={BarChart3} gradient="from-emerald-500 to-teal-600" glowColor="rgba(16,185,129,0.25)">
                <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                            <XAxis dataKey="name" stroke={textColor} fontSize={10} tickLine={false} axisLine={false} dy={8} />
                            <YAxis
                                stroke={textColor}
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `${val / 1000000}M`}
                            />
                            <Tooltip content={<CustomTooltip formatter={rupiahFormatter} />} />
                            <Legend content={<CustomLegend />} />
                            <Bar name="Pemasukan" dataKey="income" fill={COLORS.emerald} radius={[6, 6, 2, 2]} maxBarSize={32} />
                            <Bar name="Pengeluaran" dataKey="expense" fill={COLORS.rose} radius={[6, 6, 2, 2]} maxBarSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </ChartCard>

            {/* 3. Donut: Status Project */}
            <ChartCard title="Status Project" icon={PieChartIcon} gradient="from-indigo-500 to-violet-600" glowColor="rgba(99,102,241,0.25)">
                <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={projectPieData}
                                cx="50%" cy="45%"
                                innerRadius={60} outerRadius={85}
                                paddingAngle={4} dataKey="value" stroke="none"
                            >
                                {projectPieData.map((entry, i) => (
                                    <Cell key={`p-${i}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <DonutCenterLabel data={projectPieData} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={<CustomLegend />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </ChartCard>

            {/* 4. Donut: Konversi Leads */}
            <ChartCard title="Konversi Leads" icon={Target} gradient="from-amber-400 to-orange-500" glowColor="rgba(245,158,11,0.25)">
                <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={leadPieData}
                                cx="50%" cy="45%"
                                innerRadius={60} outerRadius={85}
                                paddingAngle={4} dataKey="value" stroke="none"
                            >
                                {leadPieData.map((entry, i) => (
                                    <Cell key={`l-${i}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <DonutCenterLabel data={leadPieData} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={<CustomLegend />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </ChartCard>

            {/* 5. Donut: Pengeluaran per Kategori */}
            <ChartCard title="Pengeluaran per Kategori" icon={Layers} gradient="from-rose-500 to-pink-600" glowColor="rgba(244,63,94,0.25)">
                <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={expenseCategoryData}
                                cx="50%" cy="45%"
                                innerRadius={60} outerRadius={85}
                                paddingAngle={4} dataKey="value" stroke="none"
                            >
                                {expenseCategoryData.map((entry, i) => (
                                    <Cell key={`e-${i}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <DonutCenterLabel data={expenseCategoryData} />
                            <Tooltip content={<CustomTooltip formatter={rupiahFormatter} />} />
                            <Legend content={<CustomLegend />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </ChartCard>

            {/* 6. Area Chart: Tren Profit */}
            <ChartCard title="Tren Profit" icon={Activity} gradient="from-violet-500 to-purple-600" glowColor="rgba(139,92,246,0.25)">
                <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.violet} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={COLORS.violet} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                            <XAxis dataKey="name" stroke={textColor} fontSize={10} tickLine={false} axisLine={false} dy={8} />
                            <YAxis
                                stroke={textColor}
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `${val / 1000000}M`}
                            />
                            <Tooltip content={<CustomTooltip formatter={rupiahFormatter} />} />
                            <Legend content={<CustomLegend />} />
                            <Area type="monotone" name="Profit" dataKey="profit" stroke={COLORS.violet} fill="url(#gradProfit)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: COLORS.violet }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </ChartCard>
        </motion.div>
    );
}
