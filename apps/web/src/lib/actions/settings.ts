"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSystemOwnerId } from "./projects";

// ==========================================
// 1. GENERAL SETTINGS
// ==========================================

export async function getSettings() {
    const settings = await prisma.setting.findMany();
    // Convert to object for easier use
    return settings.reduce((acc, s) => {
        acc[s.key] = s.value;
        return acc;
    }, {} as Record<string, string>);
}

export async function updateSettings(data: Record<string, string>) {
    const ownerId = await getSystemOwnerId();

    // Use transaction for consistency
    await prisma.$transaction(
        Object.entries(data).map(([key, value]) =>
            prisma.setting.upsert({
                where: { key },
                update: { value },
                create: { key, value }
            })
        )
    );

    // Audit Log
    await prisma.auditLog.create({
        data: {
            action: "UPDATE_SETTINGS",
            entityType: "SYSTEM",
            entityId: "GLOBAL",
            details: `Mengupdate konfigurasi sistem: ${Object.keys(data).join(", ")}`,
            userId: ownerId
        }
    });

    revalidatePath("/(dashboard)/settings", "page");
    return { success: true };
}

// ==========================================
// 2. MITRA MANAGEMENT
// ==========================================

export async function getMitraList() {
    return await prisma.user.findMany({
        where: { role: "MITRA" },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
        }
    });
}

export async function createMitraAccount(data: { name: string, email: string }) {
    const ownerId = await getSystemOwnerId();

    const mitra = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            role: "MITRA"
        }
    });

    await prisma.auditLog.create({
        data: {
            action: "CREATE_MITRA",
            entityType: "USER",
            entityId: mitra.id,
            details: `Membuat akun Mitra baru: ${mitra.name} (${mitra.email})`,
            userId: ownerId
        }
    });

    revalidatePath("/(dashboard)/settings", "page");
    return mitra;
}

export async function updateMitraAccount(id: string, data: { name: string, email: string }) {
    const ownerId = await getSystemOwnerId();

    const mitra = await prisma.user.update({
        where: { id },
        data: {
            name: data.name,
            email: data.email
        }
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

    revalidatePath("/(dashboard)/settings", "page");
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

    revalidatePath("/(dashboard)/settings", "page");
    return { success: true };
}

// ==========================================
// 3. AUDIT LOGS
// ==========================================

export async function getSystemAuditLogs(limit = 50) {
    return await prisma.auditLog.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } }
    });
}
