'use server'

import prisma from '@/lib/prisma'
import { DocumentType } from '@prisma/client'

// ──────────────────────────────────────
// Helper: Generate Nomor Dokumen Otomatis
// ──────────────────────────────────────
const PREFIX_MAP: Record<DocumentType, string> = {
    PROPOSAL_CLIENT: 'VT/PRP',
    INVOICE_DP: 'VT/INV',
    INVOICE_PELUNASAN: 'VT/INV',
    INVOICE_FULL: 'VT/INV',
    SURAT_PERJANJIAN_MITRA: 'VT/SPM',
    PROPOSAL_MITRA: 'VT/PRM',
}

async function generateDocumentNo(type: DocumentType): Promise<string> {
    const prefix = PREFIX_MAP[type]
    const year = new Date().getFullYear()
    const count = await prisma.document.count({
        where: {
            type,
            createdAt: {
                gte: new Date(`${year}-01-01`),
                lt: new Date(`${year + 1}-01-01`),
            },
        },
    })
    const number = String(count + 1).padStart(3, '0')
    return `${prefix}/${year}/${number}`
}

// ──────────────────────────────────────
// CRUD: Buat Dokumen Baru
// ──────────────────────────────────────
export async function createDocument(data: {
    type: DocumentType
    title: string
    recipientName: string
    fileUrl?: string
    leadId?: string
    projectId?: string
    mitraId?: string
    createdBy: string
}) {
    const documentNo = await generateDocumentNo(data.type)

    const document = await prisma.document.create({
        data: {
            documentNo,
            type: data.type,
            title: data.title,
            recipientName: data.recipientName,
            fileUrl: data.fileUrl || null,
            leadId: data.leadId || null,
            projectId: data.projectId || null,
            mitraId: data.mitraId || null,
            createdBy: data.createdBy,
        },
    })

    return document
}

// ──────────────────────────────────────
// READ: Ambil Dokumen Berdasarkan Mitra
// ──────────────────────────────────────
export async function getDocumentsByMitra(mitraId: string) {
    const documents = await prisma.document.findMany({
        where: {
            OR: [
                { mitraId }, // Dokumen mitra itu sendiri (Surat Perjanjian, Proposal Mitra)
                {
                    lead: {
                        mitraId, // Dokumen dari lead milik mitra (Proposal Client, Invoice)
                    },
                },
            ],
        },
        include: {
            lead: { select: { id: true, name: true, status: true } },
            project: { select: { id: true, name: true, clientName: true } },
        },
        orderBy: { createdAt: 'desc' },
    })

    return documents
}

// ──────────────────────────────────────
// READ: Ambil Dokumen Berdasarkan Lead
// ──────────────────────────────────────
export async function getDocumentsByLead(leadId: string) {
    return prisma.document.findMany({
        where: { leadId },
        orderBy: { createdAt: 'desc' },
    })
}

// ──────────────────────────────────────
// READ: Ambil Dokumen Berdasarkan Project
// ──────────────────────────────────────
export async function getDocumentsByProject(projectId: string) {
    return prisma.document.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' },
    })
}

// ──────────────────────────────────────
// READ: Ambil Semua Dokumen (Owner)
// ──────────────────────────────────────
export async function getAllDocuments(filters?: {
    type?: DocumentType
    search?: string
    page?: number
    limit?: number
}) {
    const page = filters?.page || 1
    const limit = filters?.limit || 20
    const skip = (page - 1) * limit

    const where: any = {}
    if (filters?.type) where.type = filters.type
    if (filters?.search) {
        where.OR = [
            { documentNo: { contains: filters.search, mode: 'insensitive' } },
            { title: { contains: filters.search, mode: 'insensitive' } },
            { recipientName: { contains: filters.search, mode: 'insensitive' } },
        ]
    }

    const [documents, total] = await Promise.all([
        prisma.document.findMany({
            where,
            include: {
                lead: { select: { id: true, name: true } },
                project: { select: { id: true, name: true } },
                mitra: { select: { id: true, name: true } },
                creator: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.document.count({ where }),
    ])

    return { documents, total, page, totalPages: Math.ceil(total / limit) }
}

// ──────────────────────────────────────
// UPDATE: Tandai Dokumen Sudah Dikirim via WA
// ──────────────────────────────────────
export async function markDocumentSent(documentId: string) {
    return prisma.document.update({
        where: { id: documentId },
        data: {
            sentViaWa: true,
            sentAt: new Date(),
        },
    })
}

// ──────────────────────────────────────
// UPDATE: Update File URL (setelah upload PDF)
// ──────────────────────────────────────
export async function updateDocumentFileUrl(documentId: string, fileUrl: string) {
    return prisma.document.update({
        where: { id: documentId },
        data: { fileUrl },
    })
}

// ──────────────────────────────────────
// DELETE: Hapus Dokumen
// ──────────────────────────────────────
export async function deleteDocument(documentId: string) {
    return prisma.document.delete({
        where: { id: documentId },
    })
}

// ──────────────────────────────────────
// Helper: Format Rupiah
// ──────────────────────────────────────
export function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount)
}

// ──────────────────────────────────────
// Helper: Format Tanggal Indonesia
// ──────────────────────────────────────
export function formatTanggalIndo(date: Date): string {
    const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const bulan = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ]
    return `${hari[date.getDay()]}, ${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`
}

export function formatTanggalPendek(date: Date): string {
    const bulan = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ]
    return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`
}
