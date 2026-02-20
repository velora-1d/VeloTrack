"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

async function getSystemOwnerId() {
    let owner = await prisma.user.findFirst({ where: { role: "OWNER" } });
    if (!owner) {
        owner = await prisma.user.create({
            data: {
                name: "Owner Admin",
                email: "owner@velotrack.local",
                role: "OWNER"
            }
        });
    }
    return owner.id;
}


export type FetchLeadsParams = {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    mitraId?: string;
};

// 1. Ambil List Leads (Server-side Pagination & Filter)
export async function getLeads({ page = 1, pageSize = 10, search, status, mitraId }: FetchLeadsParams) {
    // Validasi & pastikan page min 1
    const currentPage = Math.max(1, page);
    const skip = (currentPage - 1) * pageSize;

    // Buat objek where clause dinamis berdasarkan filter
    const where: any = {};

    if (status && status !== "ALL") {
        where.status = status;
    }

    if (mitraId) {
        where.mitraId = mitraId;
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { contact: { contains: search, mode: "insensitive" } },
            { source: { contains: search, mode: "insensitive" } },
        ];
    }

    try {
        const [totalCount, leads] = await Promise.all([
            prisma.lead.count({ where }),
            prisma.lead.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: "desc" },
                include: {
                    project: {
                        select: { id: true }
                    },
                    mitra: {
                        select: { name: true }
                    }
                }
            })
        ]);

        return {
            leads,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            currentPage,
        };
    } catch (error) {
        console.error("Error fetching leads:", error);
        throw new Error("Gagal mengambil data leads.");
    }
}

// 2. Update Status Lead (Pending, Deal, Cancel)
export async function updateLeadStatus(
    leadId: string,
    newStatus: "PENDING" | "DEAL" | "CANCEL",
    reason?: string,
    actionBy: string = "Owner" // Nanti disesuaikan dengan auth session jika ada
) {
    try {
        // Ambil lead yang ada saat ini
        const currentLead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: { project: true }
        });

        if (!currentLead) throw new Error("Lead tidak ditemukan.");

        // Validasi Aturan VeloTrack Brief:
        // 1. Lead "DEAL" tidak bisa diubah balik
        if (currentLead.status === "DEAL") {
            throw new Error("Lead yang sudah DEAL dikunci dan tidak bisa diubah statusnya.");
        }

        // 2. Jika cancel, reason wajib diisi
        if (newStatus === "CANCEL" && (!reason || reason.trim() === "")) {
            throw new Error("Alasan pembatalan wajib diisi.");
        }

        // Lakukan pembaharuan dalam Transaksi agar konsisten
        await prisma.$transaction(async (tx) => {
            // Update status lead
            await tx.lead.update({
                where: { id: leadId },
                data: { status: newStatus }
            });

            // Jika status baru adalah CANCEL, simpan alasannya sebagai note
            if (newStatus === "CANCEL" && reason) {
                await tx.leadNote.create({
                    data: {
                        content: `[CANCEL REASON]: ${reason}`,
                        leadId: leadId,
                        createdBy: actionBy
                    }
                });
            }

            // Catat di Audit Log
            await tx.auditLog.create({
                data: {
                    action: `UBAH_STATUS_LEAD_${newStatus}`,
                    entityId: leadId,
                    entityType: "LEAD",
                    details: `Status diubah dari ${currentLead.status} menjadi ${newStatus}`,
                    userId: await getSystemOwnerId()
                }
            });
        });

        revalidatePath("/leads");
        return { success: true };

    } catch (error: any) {
        console.error("Error update lead:", error);
        throw new Error(error.message || "Gagal memperbarui status lead.");
    }
}

// 3. Konversi Lead menjadi Project (Otomatis ketika DEAL)
export async function convertLeadToProject(
    leadId: string,
    projectName: string,
    projectDescription?: string,
    deadline?: Date
) {
    try {
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: { project: true }
        });

        if (!lead) throw new Error("Lead tidak ditemukan.");

        // Validasi Aturan VeloTrack Brief:
        // 1. Lead CANCEL tidak bisa diconvert
        if (lead.status === "CANCEL") {
            throw new Error("Lead yang sudah ter-cancel tidak dapat dijadikan project.");
        }

        // 2. Lead harus DEAL sebelum jadi project (atau akan di-DEAL-kan otomatis di sini)
        // 3. Satu lead hanya punya satu project
        if (lead.project) {
            throw new Error("Lead ini sudah terhubung dengan sebuah project.");
        }

        await prisma.$transaction(async (tx) => {
            // 1. Jika lead belum DEAL, paksa ubah jadi DEAL
            if (lead.status !== "DEAL") {
                await tx.lead.update({
                    where: { id: leadId },
                    data: { status: "DEAL" }
                });
            }

            // 2. Bikin project baru yang terhubung ke lead ini
            const newProject = await tx.project.create({
                data: {
                    name: projectName,
                    status: "TODO",
                    leadId: leadId,
                    clientName: lead.name, // Diambil dari nama lead
                    deadline: deadline || new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default 1 bulan deadline
                }
            });

            // 3. Catat di Audit Log (Konversi)
            await tx.auditLog.create({
                data: {
                    action: `CONVERT_LEAD_TO_PROJECT`,
                    entityId: leadId,
                    entityType: "LEAD",
                    details: `Lead ${lead.name} dikonversi menjadi Project bernama ${projectName} (ID: ${newProject.id})`,
                    userId: await getSystemOwnerId()
                }
            });
        });

        revalidatePath("/leads");
        revalidatePath("/projects");
        return { success: true };

    } catch (error: any) {
        console.error("Error converting lead:", error);
        throw new Error(error.message || "Gagal mengkonversi lead ke project.");
    }
}

// 4. Buat Lead Baru (Create)
export async function createLead({
    name, contact, source, mitraId
}: { name: string, contact: string, source: string, mitraId?: string }) {
    try {
        if (!name || name.trim() === "") throw new Error("Nama Lead wajib diisi.");

        const leadData: any = {
            name,
            contact,
            source,
            status: "PENDING"
        };
        if (mitraId) leadData.mitraId = mitraId;

        await prisma.lead.create({
            data: leadData
        });

        // Catat Audit
        await prisma.auditLog.create({
            data: {
                action: "CREATE_LEAD",
                entityId: "NEW", // Idealnya ambil ID setelah create
                entityType: "LEAD",
                details: `Lead baru dibuat: ${name}`,
                userId: await getSystemOwnerId()
            }
        });

        revalidatePath("/leads");
        return { success: true };
    } catch (error: any) {
        console.error("Error creating lead:", error);
        throw new Error(error.message || "Gagal membuat lead baru.");
    }
}

// 5. Hapus Lead (Delete)
export async function deleteLead(leadId: string) {
    try {
        const lead = await prisma.lead.findUnique({ where: { id: leadId }, include: { project: true } });
        if (!lead) throw new Error("Lead tidak ditemukan.");
        if (lead.project) throw new Error("Tidak bisa menghapus lead yang sudah menjadi project.");

        // Hapus catatan (notes) terkait terlebih dahulu jika ada onDelete Cascade belum di-set penuh
        await prisma.leadNote.deleteMany({ where: { leadId } });

        await prisma.lead.delete({
            where: { id: leadId }
        });

        // Audit log (Opsional untuk delete entity)
        await prisma.auditLog.create({
            data: {
                action: "DELETE_LEAD",
                entityId: leadId,
                entityType: "LEAD",
                details: `Lead dihapus: ${lead.name}`,
                userId: await getSystemOwnerId()
            }
        });

        revalidatePath("/leads");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting lead:", error);
        throw new Error(error.message || "Gagal menghapus lead.");
    }
}

// 6. Ambil Detail Lead (Termasuk Notes & History)
export async function getLeadDetail(leadId: string) {
    try {
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: {
                project: {
                    select: { id: true, name: true, status: true }
                },
                mitra: {
                    select: { id: true, name: true }
                },
                notes: {
                    orderBy: { createdAt: "desc" }
                }
            }
        });

        if (!lead) return null;

        // Ambil riwayat / log audit khusus untuk Lead ini
        const auditLogs = await prisma.auditLog.findMany({
            where: { entityId: leadId, entityType: "LEAD" },
            orderBy: { createdAt: "desc" }
        });

        // Kembalikan data utuh
        return {
            ...lead,
            auditLogs
        };
    } catch (error) {
        console.error("Error fetching lead detail:", error);
        throw new Error("Gagal mengambil detail lead.");
    }
}

// 7. Tambah Catatan Internal (Lead Note)
export async function addLeadNote(leadId: string, content: string) {
    try {
        if (!content || content.trim() === "") throw new Error("Catatan tidak boleh kosong.");
        const ownerId = await getSystemOwnerId();

        const note = await prisma.leadNote.create({
            data: {
                leadId,
                content,
                createdBy: ownerId
            }
        });

        // Opsi: Catat penambahan note ke audit log jika diperlukan transparansi ketat
        await prisma.auditLog.create({
            data: {
                action: "ADD_LEAD_NOTE",
                entityId: leadId,
                entityType: "LEAD",
                details: `Catatan baru ditambahkan`,
                userId: ownerId
            }
        });

        revalidatePath(`/leads/${leadId}`);
        return { success: true, note };
    } catch (error: any) {
        console.error("Error adding lead note:", error);
        throw new Error(error.message || "Gagal menambahkan catatan.");
    }
}
