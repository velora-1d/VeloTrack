"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { ProjectStatus } from "@prisma/client";

export async function getSystemOwnerId() {
    let owner = await prisma.user.findFirst({ where: { role: "OWNER" } });
    if (!owner) {
        owner = await prisma.user.create({
            data: {
                name: "Owner Admin",
                email: "owner@velotrack.local",
                role: "OWNER",
            },
        });
    }
    return owner.id;
}

export type FetchProjectsParams = {
    page?: number;
    pageSize?: number;
    status?: string | "ALL";
    search?: string;
    deadlineFilter?: "ALL" | "TODAY" | "THIS_WEEK" | "OVERDUE";
    picId?: string | "ALL";
};

// ==========================================
// 1. Ambil List Project (dengan Paginasi & Filter)
// ==========================================
export async function getProjects(params: FetchProjectsParams) {
    const {
        page = 1,
        pageSize = 10,
        status = "ALL",
        search,
        deadlineFilter = "ALL",
        picId = "ALL",
    } = params;

    const skip = (page - 1) * pageSize;

    // Build Where Clause
    const whereClause: any = {};

    // Filter by Status
    if (status !== "ALL") {
        whereClause.status = status as ProjectStatus;
    }

    // Filter by PIC (Direct)
    if (picId !== "ALL") {
        whereClause.picId = picId;
    }

    // Filter by Mitra (via Lead)
    // Jika params memiliki mitraId (misal dari dashboard mitra), filter lewat lead
    const mitraId = (params as any).mitraId;
    if (mitraId) {
        whereClause.lead = {
            mitraId: mitraId
        };
    }

    // Filter by Deadline
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const weekEnd = new Date(todayStart);
    weekEnd.setDate(weekEnd.getDate() + (7 - weekEnd.getDay())); // Until end of week

    if (deadlineFilter === "TODAY") {
        whereClause.deadline = {
            gte: todayStart,
            lt: todayEnd,
        };
    } else if (deadlineFilter === "THIS_WEEK") {
        whereClause.deadline = {
            gte: todayStart,
            lte: weekEnd,
        };
    } else if (deadlineFilter === "OVERDUE") {
        whereClause.deadline = {
            lt: todayStart,
        };
        // Opsional: jangan masukkan yang statusnya sudah DONE
        whereClause.status = {
            not: "DONE"
        };
    }

    // Search by Keyword (Project Name or Client Name)
    if (search && search.trim() !== "") {
        whereClause.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { clientName: { contains: search, mode: "insensitive" } },
        ];
    }

    try {
        const [totalCount, projects] = await Promise.all([
            prisma.project.count({ where: whereClause }),
            prisma.project.findMany({
                where: whereClause,
                skip,
                take: pageSize,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    pic: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            }),
        ]);

        return {
            data: projects,
            meta: {
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
                currentPage: page,
                pageSize,
            },
        };
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw new Error("Gagal mengambil daftar project");
    }
}

// ==========================================
// 2. Ambil List User/Mitra untuk Dropdown Assign
// ==========================================
export async function getMitraList() {
    try {
        const mitraList = await prisma.user.findMany({
            where: {
                role: "MITRA",
            },
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: "asc",
            },
        });
        return mitraList;
    } catch (error) {
        console.error("Error fetching mitra list:", error);
        return [];
    }
}

// ==========================================
// 3. Update Status Project
// ==========================================
export async function updateProjectStatus(projectId: string, newStatus: ProjectStatus) {
    try {
        // Cek status saat ini
        const currentProject = await prisma.project.findUnique({
            where: { id: projectId },
            select: { status: true, name: true },
        });

        if (!currentProject) {
            throw new Error("Project tidak ditemukan");
        }

        if (currentProject.status === "DONE") {
            throw new Error("Project yang sudah DONE tidak dapat diubah statusnya.");
        }

        // Jalankan Update dalam satu transaction
        await prisma.$transaction(async (tx) => {
            // Update status
            await tx.project.update({
                where: { id: projectId },
                data: { status: newStatus },
            });

            // Catat Log Audit
            await tx.auditLog.create({
                data: {
                    action: "UPDATE_PROJECT_STATUS",
                    entityType: "PROJECT",
                    entityId: projectId,
                    details: `Status diubah dari ${currentProject.status} menjadi ${newStatus}`,
                    userId: await getSystemOwnerId(),
                },
            });
        });

        revalidatePath("/projects");
        revalidatePath(`/projects/${projectId}`); // Opsional untuk detail nanti
        return { success: true };
    } catch (error: any) {
        console.error("Error updating project status:", error);
        throw new Error(error.message || "Terjadi kesalahan saat mengupdate status project");
    }
}

// ==========================================
// 4. Update PIC Project
// ==========================================
export async function updateProjectPic(projectId: string, newMitraId: string | null) {
    try {
        const currentProject = await prisma.project.findUnique({
            where: { id: projectId },
            select: { status: true, name: true, picId: true },
        });

        if (!currentProject) {
            throw new Error("Project tidak ditemukan");
        }

        if (currentProject.status === "DONE") {
            throw new Error("Tidak dapat mengganti PIC pada project yang sudah DONE.");
        }

        await prisma.$transaction(async (tx) => {
            await tx.project.update({
                where: { id: projectId },
                data: { picId: newMitraId },
            });

            await tx.auditLog.create({
                data: {
                    action: "UPDATE_PROJECT_PIC",
                    entityType: "PROJECT",
                    entityId: projectId,
                    details: `PIC diubah dari ${currentProject.picId || 'Owner'} menjadi ${newMitraId || 'Owner'}`,
                    userId: await getSystemOwnerId(),
                },
            });
        });

        revalidatePath("/projects");
        return { success: true };
    } catch (error: any) {
        console.error("Error updating project PIC:", error);
        throw new Error(error.message || "Terjadi kesalahan saat mengganti PIC");
    }
}

// ==========================================
// 5. Update Deadline Project
// ==========================================
export async function updateProjectDeadline(projectId: string, newDeadline: Date) {
    try {
        const currentProject = await prisma.project.findUnique({
            where: { id: projectId },
            select: { status: true, name: true, deadline: true },
        });

        if (!currentProject) {
            throw new Error("Project tidak ditemukan");
        }

        if (currentProject.status === "DONE") {
            throw new Error("Tidak dapat merubah deadline pada project yang sudah DONE.");
        }

        await prisma.$transaction(async (tx) => {
            await tx.project.update({
                where: { id: projectId },
                data: { deadline: newDeadline },
            });

            await tx.auditLog.create({
                data: {
                    action: "UPDATE_PROJECT_DEADLINE",
                    entityType: "PROJECT",
                    entityId: projectId,
                    details: `Deadline diubah menjadi ${newDeadline.toISOString()}`,
                    userId: await getSystemOwnerId(),
                },
            });
        });

        revalidatePath("/projects");
        return { success: true };
    } catch (error: any) {
        console.error("Error updating project deadline:", error);
        throw new Error(error.message || "Terjadi kesalahan saat merubah deadline");
    }
}

// ==========================================
// 6. Ambil Detail Project (Notes, Finances, History)
// ==========================================
export async function getProjectDetail(projectId: string) {
    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                lead: {
                    select: { id: true, name: true, createdAt: true },
                },
                pic: {
                    select: { id: true, name: true },
                },
                notes: {
                    orderBy: { createdAt: "desc" },
                },
                incomes: {
                    orderBy: { date: "desc" },
                },
                expenses: {
                    orderBy: { date: "desc" },
                },
            },
        });

        if (!project) return null;

        const auditLogs = await prisma.auditLog.findMany({
            where: { entityId: projectId, entityType: "PROJECT" },
            orderBy: { createdAt: "desc" },
        });

        // Hitung Ringkasan Keuangan
        const totalIncome = project.incomes.reduce((sum, inc) => sum + inc.amount, 0);
        const totalExpense = project.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const profit = totalIncome - totalExpense;

        return {
            ...project,
            financialSummary: {
                totalIncome,
                totalExpense,
                profit,
            },
            auditLogs,
        };
    } catch (error) {
        console.error("Error fetching project detail:", error);
        throw new Error("Gagal mengambil detail project.");
    }
}

// ==========================================
// 7. Tambah Catatan Internal (Project Note)
// ==========================================
export async function addProjectNote(projectId: string, content: string) {
    try {
        if (!content || content.trim() === "") throw new Error("Catatan tidak boleh kosong.");
        const ownerId = await getSystemOwnerId();

        const note = await prisma.projectNote.create({
            data: {
                projectId,
                content,
                createdBy: ownerId,
            },
        });

        await prisma.auditLog.create({
            data: {
                action: "ADD_PROJECT_NOTE",
                entityId: projectId,
                entityType: "PROJECT",
                details: "Catatan internal proyek baru ditambahkan",
                userId: ownerId,
            },
        });

        revalidatePath("/projects");
        return { success: true, note };
    } catch (error: any) {
        console.error("Error adding project note:", error);
        throw new Error(error.message || "Gagal menambahkan catatan.");
    }
}
