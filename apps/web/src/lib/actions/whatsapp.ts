'use server'

import { prisma } from '@/lib/prisma'
import { sendWhatsAppWithDocument, formatPhoneNumber } from '@/lib/whatsapp/client'
import {
    templateSuratPerjanjian,
    templateProposalClient,
    templateInvoice,
    templateProposalMitra,
} from '@/lib/whatsapp/templates'
import { markDocumentSent } from './documents'
import { formatRupiah, formatTanggalPendek } from './documents'

// ──────────────────────────────────────
// Kirim Dokumen via WhatsApp
// ──────────────────────────────────────

interface SendDocumentResult {
    success: boolean
    message: string
}

/**
 * Kirim dokumen via WhatsApp
 * Mengambil data dokumen, generate pesan template, kirim via Fonnte, dan update status
 */
export async function sendDocumentViaWhatsApp(
    documentId: string,
    targetPhone: string
): Promise<SendDocumentResult> {
    // 1. Ambil data dokumen
    const doc = await (prisma as any).document.findUnique({
        where: { id: documentId },
        include: {
            lead: true,
            project: true,
            mitra: true,
        },
    })

    if (!doc) {
        return { success: false, message: 'Dokumen tidak ditemukan.' }
    }

    if (!doc.fileUrl) {
        return { success: false, message: 'File PDF belum di-generate. Silakan generate terlebih dahulu.' }
    }

    // 2. Generate pesan berdasarkan tipe dokumen
    let message = ''
    const filename = `${doc.documentNo.replace(/\//g, '-')}.pdf`

    switch (doc.type) {
        case 'SURAT_PERJANJIAN_MITRA':
            message = templateSuratPerjanjian({
                namaMitra: doc.recipientName,
                nomorSurat: doc.documentNo,
                tanggal: formatTanggalPendek(doc.createdAt),
            })
            break

        case 'PROPOSAL_CLIENT':
            message = templateProposalClient({
                namaClient: doc.recipientName,
                namaProyek: doc.project?.name || doc.title,
                nomorProposal: doc.documentNo,
                totalBiaya: doc.project?.value ? formatRupiah(doc.project.value) : '-',
            })
            break

        case 'INVOICE_DP':
        case 'INVOICE_PELUNASAN':
        case 'INVOICE_FULL':
            const jenisMap: Record<string, 'DP' | 'PELUNASAN' | 'FULL'> = {
                INVOICE_DP: 'DP',
                INVOICE_PELUNASAN: 'PELUNASAN',
                INVOICE_FULL: 'FULL',
            }
            message = templateInvoice({
                namaClient: doc.recipientName,
                namaProyek: doc.project?.name || doc.title,
                nomorInvoice: doc.documentNo,
                jenisInvoice: jenisMap[doc.type],
                jumlahTagihan: '-',
                jatuhTempo: formatTanggalPendek(new Date(doc.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000)),
            })
            break

        case 'PROPOSAL_MITRA':
            message = templateProposalMitra({
                namaCalonMitra: doc.recipientName,
                nomorProposal: doc.documentNo,
            })
            break

        default:
            message = `Dokumen ${doc.documentNo} — ${doc.title}`
    }

    // 3. Kirim via WhatsApp
    const result = await sendWhatsAppWithDocument(
        targetPhone,
        message,
        doc.fileUrl,
        filename
    )

    // 4. Update status jika berhasil
    if (result.success) {
        await markDocumentSent(documentId)
    }

    return {
        success: result.success,
        message: result.message,
    }
}

/**
 * Kirim Surat Perjanjian ke Mitra via WhatsApp
 * Shortcut yang otomatis ambil nomor WA dari profil mitra
 */
export async function sendSuratPerjanjianToMitra(
    documentId: string,
    mitraId: string
): Promise<SendDocumentResult> {
    const mitra = await prisma.user.findUnique({
        where: { id: mitraId },
    })

    if (!mitra?.whatsapp) {
        return { success: false, message: 'Nomor WhatsApp mitra belum diisi di profil.' }
    }

    return sendDocumentViaWhatsApp(documentId, mitra.whatsapp)
}

/**
 * Kirim dokumen ke Lead/Client via WhatsApp
 * Shortcut yang otomatis ambil nomor kontak dari data lead
 */
export async function sendDocumentToClient(
    documentId: string,
    leadId: string
): Promise<SendDocumentResult> {
    const lead = await prisma.lead.findUnique({
        where: { id: leadId },
    })

    if (!lead?.contact) {
        return { success: false, message: 'Nomor kontak lead belum diisi.' }
    }

    return sendDocumentViaWhatsApp(documentId, lead.contact)
}
