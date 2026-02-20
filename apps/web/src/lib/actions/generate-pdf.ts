'use server'

import { prisma } from '@/lib/prisma'

type DocumentType = 'PROPOSAL_CLIENT' | 'INVOICE_DP' | 'INVOICE_PELUNASAN' | 'INVOICE_FULL' | 'SURAT_PERJANJIAN_MITRA' | 'PROPOSAL_MITRA'
import { createDocument, formatTanggalIndo, formatTanggalPendek, formatRupiah } from './documents'

// ──────────────────────────────────────
// Data preparation untuk setiap template
// ──────────────────────────────────────

/**
 * Siapkan data untuk Surat Perjanjian Mitra
 */
export async function prepareSuratPerjanjianMitra(mitraId: string) {
    const mitra = await prisma.user.findUnique({
        where: { id: mitraId },
    })
    if (!mitra) throw new Error('Mitra tidak ditemukan')

    const now = new Date()
    return {
        nomorSurat: '', // akan di-generate saat createDocument
        hari: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][now.getDay()],
        tanggal: formatTanggalPendek(now),
        kota: 'Bandung',
        namaMitra: mitra.name,
        alamatMitra: mitra.address || '-',
        nohpMitra: mitra.whatsapp || '-',
    }
}

/**
 * Siapkan data untuk Proposal Client
 */
export async function prepareProposalClient(leadId: string) {
    const lead = await prisma.lead.findUnique({
        where: { id: leadId },
        include: {
            project: true,
        },
    }) as any
    if (!lead) throw new Error('Lead tidak ditemukan')

    // Ambil setting bank
    const bankSettings = await prisma.setting.findMany({
        where: { key: { in: ['bank_name', 'bank_account'] } },
    })
    const namaBank = bankSettings.find(s => s.key === 'bank_name')?.value || 'BCA'
    const noRekening = bankSettings.find(s => s.key === 'bank_account')?.value || '-'

    const now = new Date()
    const berlaku = new Date(now)
    berlaku.setDate(berlaku.getDate() + 14)

    const totalBiaya = lead.value || lead.project?.value || 0

    return {
        nomorProposal: '',
        tanggal: formatTanggalPendek(now),
        tanggalBerlaku: formatTanggalPendek(berlaku),
        namaClient: lead.name,
        alamatClient: lead.address || '-',
        picClient: lead.contact,
        nohpClient: lead.contact,
        namaProyek: lead.project?.name || lead.name,
        kategoriProyek: '-',
        deskripsiProyek: '-',
        fiturList: [] as { nama: string; keterangan: string }[],
        durasiProyek: '30',
        tanggalMulai: '-',
        tanggalSelesai: '-',
        totalBiaya,
        dpAmount: Math.round(totalBiaya * 0.5),
        pelunasanAmount: Math.round(totalBiaya * 0.5),
        namaBank,
        noRekening,
    }
}

/**
 * Siapkan data untuk Invoice Client
 */
export async function prepareInvoiceClient(
    projectId: string,
    jenisInvoice: 'DP' | 'PELUNASAN' | 'FULL'
) {
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            lead: true,
            incomes: true,
        },
    }) as any
    if (!project) throw new Error('Project tidak ditemukan')

    const bankSettings = await prisma.setting.findMany({
        where: { key: { in: ['bank_name', 'bank_account'] } },
    })
    const namaBank = bankSettings.find(s => s.key === 'bank_name')?.value || 'BCA'
    const noRekening = bankSettings.find(s => s.key === 'bank_account')?.value || '-'

    const now = new Date()
    const jatuhTempo = new Date(now)
    jatuhTempo.setDate(jatuhTempo.getDate() + 7)

    const totalBiaya = project.value || project.lead?.value || 0
    const persentase = jenisInvoice === 'FULL' ? 100 : 50
    const jumlahTagihan = Math.round(totalBiaya * (persentase / 100))
    const dpSudahBayar = project.incomes
        .filter((i: { paymentType: string }) => i.paymentType === 'DP')
        .reduce((sum: number, i: { amount: number }) => sum + i.amount, 0)

    // Cari proposal terkait
    const proposalDoc = await (prisma as any).document.findFirst({
        where: { leadId: project.leadId, type: 'PROPOSAL_CLIENT' },
    })

    return {
        nomorInvoice: '',
        jenisInvoice,
        tanggal: formatTanggalPendek(now),
        jatuhTempo: formatTanggalPendek(jatuhTempo),
        namaClient: project.clientName,
        alamatClient: project.lead?.address || '-',
        picClient: project.lead?.contact || '-',
        nohpClient: project.lead?.contact || '-',
        namaProyek: project.name,
        kategoriProyek: '-',
        nomorProposalRef: proposalDoc?.documentNo || '-',
        totalBiaya,
        jumlahTagihan,
        persentaseBayar: persentase,
        dpSudahBayar: jenisInvoice === 'PELUNASAN' ? dpSudahBayar : undefined,
        sisaPembayaran: jenisInvoice === 'DP' ? totalBiaya - jumlahTagihan : undefined,
        namaBank,
        noRekening,
    }
}

/**
 * Siapkan data untuk Proposal Mitra
 */
export async function prepareProposalMitra(mitraId: string) {
    const mitra = await prisma.user.findUnique({
        where: { id: mitraId },
    })
    if (!mitra) throw new Error('Mitra tidak ditemukan')

    const now = new Date()
    const berlaku = new Date(now)
    berlaku.setDate(berlaku.getDate() + 30)

    return {
        nomorProposal: '',
        tanggal: formatTanggalPendek(now),
        tanggalBerlaku: formatTanggalPendek(berlaku),
        namaCalonMitra: mitra.name,
        alamatCalonMitra: mitra.address || '-',
        nohpCalonMitra: mitra.whatsapp || '-',
    }
}

// ──────────────────────────────────────
// Generate & Simpan Dokumen
// ──────────────────────────────────────

/**
 * Buat record dokumen di database
 * PDF akan di-render dan upload di sisi client,
 * lalu fileUrl di-update via updateDocumentFileUrl
 */
export async function generateDocumentRecord(params: {
    type: DocumentType
    recipientName: string
    leadId?: string
    projectId?: string
    mitraId?: string
    createdBy: string
}) {
    const titleMap: Record<DocumentType, string> = {
        SURAT_PERJANJIAN_MITRA: `Surat Perjanjian Mitra — ${params.recipientName}`,
        PROPOSAL_MITRA: `Proposal Mitra — ${params.recipientName}`,
        PROPOSAL_CLIENT: `Proposal Client — ${params.recipientName}`,
        INVOICE_DP: `Invoice DP — ${params.recipientName}`,
        INVOICE_PELUNASAN: `Invoice Pelunasan — ${params.recipientName}`,
        INVOICE_FULL: `Invoice — ${params.recipientName}`,
    }

    const doc = await createDocument({
        type: params.type,
        title: titleMap[params.type],
        recipientName: params.recipientName,
        leadId: params.leadId,
        projectId: params.projectId,
        mitraId: params.mitraId,
        createdBy: params.createdBy,
    })

    return doc
}
