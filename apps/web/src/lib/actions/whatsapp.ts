'use server'

import { prisma } from '@/lib/prisma'
import { sendWhatsApp, testFonnteConnection } from '@/lib/fonnte'
import { revalidatePath } from 'next/cache'

async function getSystemOwnerId() {
    let owner = await prisma.user.findFirst({ where: { role: "OWNER" } });
    if (!owner) {
        owner = await prisma.user.create({
            data: { name: "Owner Admin", email: "owner@velotrack.local", role: "OWNER" }
        });
    }
    return owner.id;
}

// ──────────────────────────────────────
// 1. Kirim Dokumen via WhatsApp
// ──────────────────────────────────────
export async function sendDocumentViaWA(documentId: string, targetNumber: string) {
    try {
        // Ambil data dokumen
        const doc = await (prisma as any).document.findUnique({
            where: { id: documentId },
            include: {
                lead: { select: { name: true } },
                project: { select: { name: true, clientName: true } },
                mitra: { select: { name: true } },
            },
        })

        if (!doc) throw new Error('Dokumen tidak ditemukan.')
        if (!doc.fileUrl) throw new Error('Dokumen belum memiliki file PDF. Generate terlebih dahulu.')

        // Siapkan pesan
        const recipientName = doc.recipientName || doc.lead?.name || doc.project?.clientName || 'Bapak/Ibu'
        const message = buildDocumentMessage(doc.type, doc.documentNo, recipientName, doc.title)

        // Kirim via Fonnte
        await sendWhatsApp({
            target: normalizePhone(targetNumber),
            message,
            fileUrl: doc.fileUrl,
            filename: `${doc.documentNo.replace(/\//g, '-')}.pdf`,
        })

        // Update status dokumen
        await (prisma as any).document.update({
            where: { id: documentId },
            data: {
                sentViaWa: true,
                sentAt: new Date(),
            },
        })

        // Log audit
        await prisma.auditLog.create({
            data: {
                action: 'SEND_WA',
                entityType: 'DOCUMENT',
                entityId: documentId,
                details: `Dokumen ${doc.documentNo} dikirim via WhatsApp ke ${targetNumber}`,
                userId: await getSystemOwnerId(),
            },
        })

        revalidatePath('/documents')
        revalidatePath('/mitra')

        return { success: true, message: `Dokumen berhasil dikirim ke ${targetNumber}` }
    } catch (error: any) {
        console.error('Error sending document via WA:', error)
        throw new Error(error.message || 'Gagal mengirim dokumen via WhatsApp.')
    }
}

// ──────────────────────────────────────
// 2. Kirim Notifikasi Teks via WhatsApp
// ──────────────────────────────────────
export async function sendNotificationWA(targetNumber: string, message: string) {
    try {
        await sendWhatsApp({
            target: normalizePhone(targetNumber),
            message,
        })

        return { success: true }
    } catch (error: any) {
        console.error('Error sending WA notification:', error)
        throw new Error(error.message || 'Gagal mengirim notifikasi WhatsApp.')
    }
}

// ──────────────────────────────────────
// 3. Test Koneksi WhatsApp (Settings)
// ──────────────────────────────────────
export async function testWhatsAppConnection(token?: string) {
    try {
        let tokenToTest = token

        if (!tokenToTest) {
            tokenToTest = process.env.FONNTE_TOKEN || ''

            if (!tokenToTest) {
                const setting = await prisma.setting.findUnique({
                    where: { key: 'FONNTE_TOKEN' },
                })
                tokenToTest = setting?.value || ''
            }
        }

        if (!tokenToTest) {
            return { success: false, message: 'Token Fonnte belum diatur.' }
        }

        const result = await testFonnteConnection(tokenToTest)
        return result
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

// ──────────────────────────────────────
// 4. Simpan Token Fonnte ke Database
// ──────────────────────────────────────
export async function saveFonnteToken(token: string) {
    try {
        await prisma.setting.upsert({
            where: { key: 'FONNTE_TOKEN' },
            update: { value: token },
            create: { key: 'FONNTE_TOKEN', value: token },
        })

        await prisma.auditLog.create({
            data: {
                action: 'UPDATE_SETTING',
                entityType: 'SETTING',
                entityId: 'FONNTE_TOKEN',
                details: 'Token Fonnte WhatsApp API diperbarui.',
                userId: await getSystemOwnerId(),
            },
        })

        revalidatePath('/settings')
        return { success: true, message: 'Token Fonnte berhasil disimpan.' }
    } catch (error: any) {
        throw new Error('Gagal menyimpan token: ' + error.message)
    }
}

// ──────────────────────────────────────
// Helper: Normalisasi Nomor Telepon
// ──────────────────────────────────────
function normalizePhone(phone: string): string {
    let normalized = phone.replace(/\s+/g, '').replace(/-/g, '')
    if (normalized.startsWith('0')) normalized = '62' + normalized.substring(1)
    if (normalized.startsWith('+')) normalized = normalized.substring(1)
    return normalized
}

// ──────────────────────────────────────
// Helper: Buat Pesan Berdasarkan Tipe Dokumen
// ──────────────────────────────────────
function buildDocumentMessage(type: string, documentNo: string, recipientName: string, title: string): string {
    const greetings = `Halo ${recipientName},`
    const footer = `\n\n— *VeloTrack by Velora*\n_Dokumen ini dikirim secara otomatis._`

    switch (type) {
        case 'PROPOSAL_CLIENT':
            return `${greetings}\n\nBerikut kami kirimkan *Proposal* untuk Anda.\n\n📄 *${title}*\nNo: ${documentNo}\n\nSilakan ditinjau. Jika ada pertanyaan, jangan ragu untuk menghubungi kami.${footer}`
        case 'INVOICE_DP':
            return `${greetings}\n\nBerikut *Invoice Down Payment* untuk project Anda.\n\n📄 *${title}*\nNo: ${documentNo}\n\nMohon dapat dilakukan pembayaran sesuai tenggat yang tertera. Terima kasih!${footer}`
        case 'INVOICE_PELUNASAN':
            return `${greetings}\n\nBerikut *Invoice Pelunasan* untuk project Anda.\n\n📄 *${title}*\nNo: ${documentNo}\n\nMohon dapat segera dilakukan pelunasan. Terima kasih atas kerjasamanya!${footer}`
        case 'INVOICE_FULL':
            return `${greetings}\n\nBerikut *Invoice* tagihan penuh untuk project Anda.\n\n📄 *${title}*\nNo: ${documentNo}\n\nMohon dapat dilakukan pembayaran sesuai tenggat. Terima kasih!${footer}`
        case 'SURAT_PERJANJIAN_MITRA':
            return `${greetings}\n\nBerikut *Surat Perjanjian Kerjasama* untuk Anda.\n\n📄 *${title}*\nNo: ${documentNo}\n\nSilakan dibaca dan ditandatangani. Hubungi kami jika ada yang perlu didiskusikan.${footer}`
        case 'PROPOSAL_MITRA':
            return `${greetings}\n\nBerikut *Proposal Kerjasama Mitra* untuk Anda.\n\n📄 *${title}*\nNo: ${documentNo}\n\nSilakan ditinjau. Kami menantikan kerjasama yang baik!${footer}`
        default:
            return `${greetings}\n\nBerikut dokumen *${title}* (No: ${documentNo}) untuk Anda.\n\nSilakan ditinjau.${footer}`
    }
}
