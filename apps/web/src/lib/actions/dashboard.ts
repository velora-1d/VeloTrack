"use server";

import { prisma } from "@/lib/prisma";
import { subDays, subMonths, startOfDay, endOfDay, startOfMonth, startOfYear, endOfYear, startOfWeek, endOfWeek } from "date-fns";
import type { PeriodFilter } from "@/components/dashboard/dashboard-filter";

// Helper to get date range from period string
function getDateRange(period: PeriodFilter = "month") {
    const now = new Date();

    switch (period) {
        case "today":
            return { start: startOfDay(now), end: endOfDay(now) };
        case "week":
            return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
        case "month":
            return { start: startOfMonth(now), end: now };
        case "year":
            return { start: startOfYear(now), end: endOfYear(now) };
        case "all":
        default:
            return { start: new Date(2020, 0, 1), end: endOfDay(now) };
    }
}

// 1. Get Dashboard Summary (Cards)
export async function getDashboardSummary(period: PeriodFilter = "month", projectId?: string, mitraId?: string) {
    const { start, end } = getDateRange(period);

    // Date filter condition
    const dateFilter = {
        createdAt: { gte: start, lte: end }
    };

    try {
        const [
            totalLeads,
            leadsPending,
            leadsDeal,
            leadsCancel,
            totalProjects,
            projectOverdue,
            projectDone,
            totalMitra,
            totalIncomeObj,
            totalExpenseObj,
            totalFeeObj
        ] = await Promise.all([
            // Leads
            prisma.lead.count({ where: { ...dateFilter, ...(projectId ? { project: { id: projectId } } : {}), ...(mitraId ? { mitraId } : {}) } }),
            prisma.lead.count({ where: { status: "PENDING", ...dateFilter, ...(projectId ? { project: { id: projectId } } : {}), ...(mitraId ? { mitraId } : {}) } }),
            prisma.lead.count({ where: { status: "DEAL", ...dateFilter, ...(projectId ? { project: { id: projectId } } : {}), ...(mitraId ? { mitraId } : {}) } }),
            prisma.lead.count({ where: { status: "CANCEL", ...dateFilter, ...(projectId ? { project: { id: projectId } } : {}), ...(mitraId ? { mitraId } : {}) } }),

            // Projects
            prisma.project.count({
                where: {
                    ...(projectId ? { id: projectId } : {}),
                    ...(mitraId ? { lead: { mitraId } } : {}),
                    createdAt: { gte: start, lte: end }
                }
            }),
            prisma.project.count({
                where: {
                    status: "OVERDUE",
                    ...(projectId ? { id: projectId } : {}),
                    ...(mitraId ? { lead: { mitraId } } : {})
                }
            }),
            prisma.project.count({
                where: {
                    status: "DONE",
                    ...(projectId ? { id: projectId } : {}),
                    ...(mitraId ? { lead: { mitraId } } : {}),
                    createdAt: { gte: start, lte: end }
                }
            }),

            // Mitra (Global only for Owner)
            mitraId ? Promise.resolve(0) : prisma.user.count({ where: { role: "MITRA", isActive: true } }),

            // Finance
            prisma.income.aggregate({
                _sum: { amount: true },
                where: { date: { gte: start, lte: end }, ...(projectId ? { projectId } : {}) }
            }),
            prisma.expense.aggregate({
                _sum: { amount: true },
                where: { date: { gte: start, lte: end }, ...(projectId ? { projectId } : {}) }
            }),
            // Fee (income dengan paymentType 'Fee')
            prisma.income.aggregate({
                _sum: { amount: true },
                where: { paymentType: "Fee", date: { gte: start, lte: end }, ...(projectId ? { projectId } : {}) }
            })
        ]);

        const totalIncome = totalIncomeObj._sum.amount || 0;
        const totalExpense = totalExpenseObj._sum.amount || 0;
        const totalFee = totalFeeObj._sum.amount || 0;
        const netProfit = totalIncome - totalExpense;

        return {
            totalLeads,
            leadsPending,
            leadsDeal,
            leadsCancel,
            totalProjects,
            projectOverdue,
            projectDone,
            totalMitra,
            totalIncome,
            totalExpense,
            totalFee,
            netProfit,
        };
    } catch (error) {
        console.error("Dashboard Summary Error:", error);
        // Return empty fallback instead of crashing
        return {
            totalLeads: 0, leadsPending: 0, leadsDeal: 0, leadsCancel: 0,
            totalProjects: 0, projectOverdue: 0, projectDone: 0, totalMitra: 0,
            totalIncome: 0, totalExpense: 0, totalFee: 0, netProfit: 0
        };
    }
}

// 2. Get Dashboard Charts Data
export async function getDashboardCharts(period: PeriodFilter = "month", projectId?: string, mitraId?: string) {
    const { start, end } = getDateRange(period);

    try {
        // A. Chart Line: Pertumbuhan (Mocked 6 titik based on period - Simplifikasi untuk visual)
        // In real prod, ini harus group by DATE(createdAt). Untuk VeloTrack, kita buat agregasi dinamis atau basic
        const lineChartData = [
            { name: "P1", leads: 4, projects: 2 },
            { name: "P2", leads: 7, projects: 3 },
            { name: "P3", leads: 5, projects: 4 },
            { name: "P4", leads: 12, projects: 6 },
            { name: "P5", leads: 9, projects: 7 },
            { name: "P6", leads: 15, projects: 8 },
        ];

        // B. Bar Chart: Pemasukan vs Pengeluaran
        // Get actual sum
        const incomeAgg = await prisma.income.aggregate({
            _sum: { amount: true },
            where: { date: { gte: start, lte: end }, ...(projectId ? { projectId } : {}) }
        });
        const expenseAgg = await prisma.expense.aggregate({
            _sum: { amount: true },
            where: { date: { gte: start, lte: end }, ...(projectId ? { projectId } : {}) }
        });

        const barChartData = [
            {
                name: "Total",
                income: incomeAgg._sum.amount || 0,
                expense: expenseAgg._sum.amount || 0
            }
        ];

        // C. Pie Chart Distribution
        const projectStatuses = await prisma.project.groupBy({
            by: ['status'],
            _count: { status: true },
            where: { ...(projectId ? { id: projectId } : {}), createdAt: { gte: start, lte: end } }
        });

        const leadStatuses = await prisma.lead.groupBy({
            by: ['status'],
            _count: { status: true },
            where: { ...(projectId ? { project: { id: projectId } } : {}), createdAt: { gte: start, lte: end } }
        });

        const statusColors: Record<string, string> = {
            TODO: "#f59e0b", ON_PROGRESS: "#3b82f6", DONE: "#10b981", OVERDUE: "#f43f5e",
            PENDING: "#f59e0b", DEAL: "#10b981", CANCEL: "#f43f5e"
        };

        const projectPieData = projectStatuses.map((s: any) => ({
            name: s.status,
            value: s._count.status,
            color: statusColors[s.status] || "#94a3b8"
        }));

        const leadPieData = leadStatuses.map((s: any) => ({
            name: s.status,
            value: s._count.status,
            color: statusColors[s.status] || "#94a3b8"
        }));


        // D. Donut: Komposisi Pengeluaran per Kategori (dari Finance Dashboard)
        const expenseCategories = await prisma.expense.groupBy({
            by: ['category'],
            _sum: { amount: true },
            where: { date: { gte: start, lte: end }, ...(projectId ? { projectId } : {}) }
        });

        const categoryColors: Record<string, string> = {
            Server: "#3b82f6", Domain: "#6366f1", Operasional: "#f59e0b",
            Marketing: "#10b981", Gaji: "#f43f5e", Lainnya: "#94a3b8"
        };

        const expenseCategoryData = expenseCategories.map((c: any) => ({
            name: c.category,
            value: c._sum.amount || 0,
            color: categoryColors[c.category] || "#94a3b8"
        }));

        return {
            lineChartData,
            barChartData,
            projectPieData: projectPieData.length > 0 ? projectPieData : [{ name: "Kosong", value: 1, color: "#e2e8f0" }],
            leadPieData: leadPieData.length > 0 ? leadPieData : [{ name: "Kosong", value: 1, color: "#e2e8f0" }],
            expenseCategoryData: expenseCategoryData.length > 0 ? expenseCategoryData : [{ name: "Kosong", value: 1, color: "#e2e8f0" }],
        };

    } catch (error) {
        console.error("Dashboard Charts Error:", error);
        return {
            lineChartData: [], barChartData: [], projectPieData: [], leadPieData: [], expenseCategoryData: []
        }
    }
}

// 3. Get Upcoming Deadlines
export async function getUpcomingDeadlines(projectId?: string, mitraId?: string) {
    try {
        const deadlines = await prisma.project.findMany({
            where: {
                ...(projectId ? { id: projectId } : {}),
                ...(mitraId ? { lead: { mitraId } } : {}),
                status: {
                    notIn: ["DONE"] // Jangan tampilkan yang sudah selesai
                }
            },
            select: {
                id: true,
                name: true,
                clientName: true,
                deadline: true,
                status: true
            },
            orderBy: {
                deadline: 'asc'
            },
            take: 5 // Batasi hanya 5 project teratas dengan deadline terdekat
        });

        return deadlines;
    } catch (error) {
        console.error("Dashboard Deadlines Error:", error);
        return [];
    }
}

// 4. Get Project List for Filter
export async function getProjectsList() {
    try {
        return await prisma.project.findMany({
            select: { id: true, name: true },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        return [];
    }
}
