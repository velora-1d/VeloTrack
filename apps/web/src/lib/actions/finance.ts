"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSystemOwnerId } from "./projects";

// ==========================================
// TYPES
// ==========================================

export type FetchIncomeParams = {
    page: number;
    pageSize: number;
    search?: string;
    projectId?: string;
    paymentType?: string;
    startDate?: string;
    endDate?: string;
};

export type FetchExpenseParams = {
    page: number;
    pageSize: number;
    search?: string;
    projectId?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
};

// ==========================================
// INCOME ACTIONS
// ==========================================

export async function getIncomes(params: FetchIncomeParams) {
    try {
        const { page, pageSize, search, projectId, paymentType, startDate, endDate } = params;
        const skip = (page - 1) * pageSize;

        const where: any = {};

        if (projectId && projectId !== "ALL") {
            where.projectId = projectId;
        }

        if (paymentType && paymentType !== "ALL") {
            where.paymentType = paymentType;
        }

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        if (search) {
            where.notes = { contains: search, mode: "insensitive" };
        }

        const [incomes, totalCount] = await Promise.all([
            prisma.income.findMany({
                where,
                include: {
                    project: {
                        select: { name: true }
                    }
                },
                orderBy: { date: "desc" },
                skip,
                take: pageSize,
            }),
            prisma.income.count({ where }),
        ]);

        return {
            data: incomes,
            meta: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / pageSize),
                totalCount,
            },
        };
    } catch (error) {
        console.error("Error fetching incomes:", error);
        throw new Error("Gagal mengambil data pemasukan.");
    }
}

export async function createIncome(data: {
    projectId: string;
    date: Date;
    paymentType: string;
    amount: number;
    notes?: string;
}) {
    try {
        const ownerId = await getSystemOwnerId();

        const income = await prisma.income.create({
            data: {
                ...data,
            },
            include: { project: true }
        });

        await prisma.auditLog.create({
            data: {
                action: "CREATE_INCOME",
                entityId: income.id,
                entityType: "INCOME",
                details: `Tambah pemasukan ${data.paymentType} senilai ${data.amount} untuk project ${income.project.name}`,
                userId: ownerId,
            },
        });

        revalidatePath("/finance/income");
        revalidatePath("/");
        revalidatePath("/projects");
        return { success: true, data: income };
    } catch (error: any) {
        console.error("Error creating income:", error);
        throw new Error(error.message || "Gagal menambah pemasukan.");
    }
}

export async function updateIncome(id: string, data: {
    projectId: string;
    date: Date;
    paymentType: string;
    amount: number;
    notes?: string;
}) {
    try {
        const ownerId = await getSystemOwnerId();

        const income = await prisma.income.update({
            where: { id },
            data: { ...data },
            include: { project: true }
        });

        await prisma.auditLog.create({
            data: {
                action: "UPDATE_INCOME",
                entityId: id,
                entityType: "INCOME",
                details: `Update pemasukan ${income.project.name} menjadi ${data.amount}`,
                userId: ownerId,
            },
        });

        revalidatePath("/finance/income");
        revalidatePath("/profit");
        return { success: true, data: income };
    } catch (error: any) {
        console.error("Error updating income:", error);
        throw new Error(error.message || "Gagal update pemasukan.");
    }
}

export async function deleteIncome(id: string) {
    try {
        const ownerId = await getSystemOwnerId();

        const income = await prisma.income.delete({
            where: { id },
            include: { project: true }
        });

        await prisma.auditLog.create({
            data: {
                action: "DELETE_INCOME",
                entityId: id,
                entityType: "INCOME",
                details: `Hapus pemasukan ${income.paymentType} senilai ${income.amount} (Project: ${income.project.name})`,
                userId: ownerId,
            },
        });

        revalidatePath("/finance/income");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error deleting income:", error);
        throw new Error("Gagal menghapus pemasukan.");
    }
}

// ==========================================
// EXPENSE ACTIONS
// ==========================================

export async function getExpenses(params: FetchExpenseParams) {
    try {
        const { page, pageSize, search, projectId, category, startDate, endDate } = params;
        const skip = (page - 1) * pageSize;

        const where: any = {};

        if (projectId && projectId !== "ALL") {
            where.projectId = projectId;
        }

        if (category && category !== "ALL") {
            where.category = category;
        }

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        if (search) {
            where.notes = { contains: search, mode: "insensitive" };
        }

        const [expenses, totalCount] = await Promise.all([
            prisma.expense.findMany({
                where,
                include: {
                    project: {
                        select: { name: true }
                    }
                },
                orderBy: { date: "desc" },
                skip,
                take: pageSize,
            }),
            prisma.expense.count({ where }),
        ]);

        return {
            data: expenses,
            meta: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / pageSize),
                totalCount,
            },
        };
    } catch (error) {
        console.error("Error fetching expenses:", error);
        throw new Error("Gagal mengambil data pengeluaran.");
    }
}

export async function createExpense(data: {
    projectId?: string | null;
    date: Date;
    category: string;
    amount: number;
    notes?: string;
}) {
    try {
        const ownerId = await getSystemOwnerId();

        const expense = await prisma.expense.create({
            data: {
                ...data,
                projectId: data.projectId === "NONE" ? null : data.projectId
            },
            include: { project: true }
        });

        await prisma.auditLog.create({
            data: {
                action: "CREATE_EXPENSE",
                entityId: expense.id,
                entityType: "EXPENSE",
                details: `Tambah pengeluaran ${data.category} senilai ${data.amount}${expense.project ? ` untuk project ${expense.project.name}` : " (Operasional)"}`,
                userId: ownerId,
            },
        });

        revalidatePath("/finance/expense");
        revalidatePath("/");
        revalidatePath("/projects");
        return { success: true, data: expense };
    } catch (error: any) {
        console.error("Error creating expense:", error);
        throw new Error(error.message || "Gagal menambah pengeluaran.");
    }
}

export async function updateExpense(id: string, data: {
    projectId?: string | null;
    date: Date;
    category: string;
    amount: number;
    notes?: string;
}) {
    try {
        const ownerId = await getSystemOwnerId();

        const expense = await prisma.expense.update({
            where: { id },
            data: {
                ...data,
                projectId: data.projectId === "NONE" ? null : data.projectId
            },
            include: { project: true }
        });

        await prisma.auditLog.create({
            data: {
                action: "UPDATE_EXPENSE",
                entityId: id,
                entityType: "EXPENSE",
                details: `Update pengeluaran ${data.category} menjadi ${data.amount}`,
                userId: ownerId,
            },
        });

        revalidatePath("/finance/expense");
        revalidatePath("/profit");
        return { success: true, data: expense };
    } catch (error: any) {
        console.error("Error updating expense:", error);
        throw new Error(error.message || "Gagal update pengeluaran.");
    }
}

export async function deleteExpense(id: string) {
    try {
        const ownerId = await getSystemOwnerId();

        const expense = await prisma.expense.delete({
            where: { id },
            include: { project: true }
        });

        await prisma.auditLog.create({
            data: {
                action: "DELETE_EXPENSE",
                entityId: id,
                entityType: "EXPENSE",
                details: `Hapus pengeluaran ${expense.category} senilai ${expense.amount}`,
                userId: ownerId,
            },
        });

        revalidatePath("/finance/expense");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error deleting expense:", error);
        throw new Error("Gagal menghapus pengeluaran.");
    }
}

// ==========================================
// PROFIT ACTIONS
// ==========================================

export async function getProfitData(params: {
    startDate?: string;
    endDate?: string;
    projectId?: string;
}) {
    try {
        const { startDate, endDate, projectId } = params;

        const whereBase: any = {};
        if (startDate || endDate) {
            whereBase.date = {};
            if (startDate) whereBase.date.gte = new Date(startDate);
            if (endDate) whereBase.date.lte = new Date(endDate);
        }

        // 1. Get Summary (Global)
        const [totalIncomes, totalExpenses] = await Promise.all([
            prisma.income.aggregate({
                _sum: { amount: true },
                where: whereBase
            }),
            prisma.expense.aggregate({
                _sum: { amount: true },
                where: whereBase
            })
        ]);

        const incomeSum = totalIncomes._sum.amount || 0;
        const expenseSum = totalExpenses._sum.amount || 0;
        const profit = incomeSum - expenseSum;
        const margin = incomeSum > 0 ? (profit / incomeSum) * 100 : 0;

        // 2. Get Profit per Project
        const projects = await prisma.project.findMany({
            where: projectId && projectId !== "ALL" ? { id: projectId } : {},
            include: {
                incomes: { where: whereBase },
                expenses: { where: whereBase }
            },
            orderBy: { createdAt: "desc" }
        });

        const projectProfits = projects.map(p => {
            const pIncome = p.incomes.reduce((sum, i) => sum + i.amount, 0);
            const pExpense = p.expenses.reduce((sum, e) => sum + e.amount, 0);
            const pProfit = pIncome - pExpense;
            const pMargin = pIncome > 0 ? (pProfit / pIncome) * 100 : 0;

            return {
                id: p.id,
                name: p.name,
                status: p.status,
                income: pIncome,
                expense: pExpense,
                profit: pProfit,
                margin: pMargin
            };
        });

        return {
            summary: {
                totalIncome: incomeSum,
                totalExpense: expenseSum,
                profit,
                margin
            },
            projects: projectProfits
        };
    } catch (error) {
        console.error("Error fetching profit data:", error);
        throw new Error("Gagal memproses data profit.");
    }
}

export async function getAllProjectsList() {
    try {
        const projects = await prisma.project.findMany({
            select: { id: true, name: true, clientName: true },
            orderBy: { createdAt: "desc" }
        });
        return projects;
    } catch (error) {
        console.error("Error fetching project list:", error);
        throw new Error("Gagal mengambil daftar project.");
    }
}
