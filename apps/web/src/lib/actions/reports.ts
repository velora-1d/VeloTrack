"use server";

import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, differenceInDays } from "date-fns";

export type ReportFilterParams = {
    startDate?: string;
    endDate?: string;
};

// ==========================================
// 1. LEADS REPORT
// ==========================================
export async function getLeadsReport(params: ReportFilterParams) {
    const { startDate, endDate } = params;
    const where: any = {};
    if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startOfDay(new Date(startDate));
        if (endDate) where.createdAt.lte = endOfDay(new Date(endDate));
    }

    const leads = await prisma.lead.findMany({
        where,
        include: { mitra: { select: { name: true } } },
        orderBy: { createdAt: "desc" }
    });

    const total = leads.length;
    const deal = leads.filter(l => l.status === "DEAL").length;
    const pending = leads.filter(l => l.status === "PENDING").length;
    const cancel = leads.filter(l => l.status === "CANCEL").length;
    const ratio = total > 0 ? (deal / total) * 100 : 0;

    return {
        summary: { total, deal, pending, cancel, ratio },
        data: leads
    };
}

// ==========================================
// 2. PROJECTS REPORT
// ==========================================
export async function getProjectsReport(params: ReportFilterParams) {
    const { startDate, endDate } = params;
    const where: any = {};
    if (startDate || endDate) {
        where.createdAt = {}; // Or use project timeline? Brief explicitly says "Periode"
        if (startDate) where.createdAt.gte = startOfDay(new Date(startDate));
        if (endDate) where.createdAt.lte = endOfDay(new Date(endDate));
    }

    const projects = await prisma.project.findMany({
        where,
        include: { pic: { select: { name: true } } },
        orderBy: { createdAt: "desc" }
    });

    const total = projects.length;
    const active = projects.filter(p => p.status === "ON_PROGRESS" || p.status === "TODO").length;
    const done = projects.filter(p => p.status === "DONE").length;
    const overdue = projects.filter(p => p.status === "OVERDUE").length;

    // Hitung rata-rata durasi (dari created sampai done/sekarang)
    let totalDays = 0;
    let countedProjects = 0;
    projects.forEach(p => {
        const end = p.status === "DONE" ? p.updatedAt : new Date();
        const days = differenceInDays(end, p.createdAt);
        totalDays += days;
        countedProjects++;
    });
    const avgDuration = countedProjects > 0 ? totalDays / countedProjects : 0;

    return {
        summary: { total, active, done, overdue, avgDuration },
        data: projects
    };
}

// ==========================================
// 3. FINANCE REPORT
// ==========================================
export async function getFinanceReport(params: ReportFilterParams) {
    const { startDate, endDate } = params;
    const where: any = {};
    if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = startOfDay(new Date(startDate));
        if (endDate) where.date.lte = endOfDay(new Date(endDate));
    }

    const [incomes, expenses] = await Promise.all([
        prisma.income.findMany({
            where,
            include: { project: { select: { name: true } } },
            orderBy: { date: "desc" }
        }),
        prisma.expense.findMany({
            where,
            include: { project: { select: { name: true } } },
            orderBy: { date: "desc" }
        })
    ]);

    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    return {
        summary: { totalIncome, totalExpense },
        incomes,
        expenses
    };
}

// ==========================================
// 4. PROFIT REPORT
// ==========================================
export async function getProfitReport(params: ReportFilterParams) {
    const { startDate, endDate } = params;
    const where: any = {};
    if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = startOfDay(new Date(startDate));
        if (endDate) where.date.lte = endOfDay(new Date(endDate));
    }

    // Ambil semua project untuk breakdown
    const projects = await prisma.project.findMany({
        include: {
            incomes: { where },
            expenses: { where }
        }
    });

    const projectData = projects.map(p => {
        const income = p.incomes.reduce((sum, i) => sum + i.amount, 0);
        const expense = p.expenses.reduce((sum, e) => sum + e.amount, 0);
        const profit = income - expense;
        return {
            name: p.name,
            income,
            expense,
            profit,
            margin: income > 0 ? (profit / income) * 100 : 0
        };
    });

    const totalIncome = projectData.reduce((sum, p) => sum + p.income, 0);
    const totalExpense = projectData.reduce((sum, p) => sum + p.expense, 0);
    const totalProfit = totalIncome - totalExpense;

    return {
        summary: { totalIncome, totalExpense, totalProfit },
        data: projectData
    };
}
