"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSystemOwnerId } from "./projects";

export type MitraPayload = {
    name: string;
    email?: string | null;
    username?: string | null;
    password?: string | null;
    whatsapp?: string | null;
    address?: string | null;
    bankName?: string | null;
    bankAccount?: string | null;
    bankHolder?: string | null;
};

export async function getMitraList() {
    return await prisma.user.findMany({
        where: { role: "MITRA" },
        orderBy: { createdAt: "desc" }
    });
}

export async function createMitraAccount(data: MitraPayload) {
    const ownerId = await getSystemOwnerId();

    const mitra = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email as any,
            username: data.username as any,
            password: data.password as any,
            whatsapp: data.whatsapp as any,
            address: data.address as any,
            bankName: data.bankName as any,
            bankAccount: data.bankAccount as any,
            bankHolder: data.bankHolder as any,
            role: "MITRA",
            isActive: true
        } as any
    });

    await prisma.auditLog.create({
        data: {
            action: "CREATE_MITRA",
            entityType: "USER",
            entityId: mitra.id,
            details: `Membuat akun Mitra baru: ${mitra.name}`,
            userId: ownerId
        }
    });

    revalidatePath("/mitra");
    return mitra;
}

export async function updateMitraAccount(id: string, data: MitraPayload) {
    const ownerId = await getSystemOwnerId();

    const updateData: { [key: string]: any } = {};
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
            updateData[key] = value === "" ? null : value;
        }
    });

    const mitra = await prisma.user.update({
        where: { id },
        data: updateData
    });

    await prisma.auditLog.create({
        data: {
            action: "UPDATE_MITRA",
            entityType: "USER",
            entityId: mitra.id,
            details: `Mengupdate data Mitra: ${mitra.name}`,
            userId: ownerId
        }
    });

    revalidatePath("/mitra");
    return mitra;
}

export async function deleteMitraAccount(id: string) {
    const ownerId = await getSystemOwnerId();

    const mitra = await prisma.user.delete({
        where: { id }
    });

    await prisma.auditLog.create({
        data: {
            action: "DELETE_MITRA",
            entityType: "USER",
            entityId: id,
            details: `Menghapus akun Mitra: ${mitra.name}`,
            userId: ownerId
        }
    });

    revalidatePath("/mitra");
    return { success: true };
}

// Untuk Dashboard Mitra
export async function getMitraDashboardStats(mitraId: string) {
    const [totalLeads, pendingLeads, dealLeads, totalProjects] = await Promise.all([
        prisma.lead.count({ where: { mitraId } }),
        prisma.lead.count({ where: { mitraId, status: "PENDING" } }),
        prisma.lead.count({ where: { mitraId, status: "DEAL" } }),
        prisma.project.count({
            where: {
                lead: { mitraId }
            }
        })
    ]);

    return {
        totalLeads,
        pendingLeads,
        dealLeads,
        totalProjects
    };
}
