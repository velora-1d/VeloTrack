/**
 * WhatsApp Client — Fonnte API Wrapper
 * Dokumentasi: https://fonnte.com/api
 *
 * Fonnte menyediakan REST API sederhana untuk mengirim pesan WA,
 * termasuk dukungan untuk mengirim file (PDF, gambar, dll).
 */

import { prisma } from '@/lib/prisma'

const FONNTE_API_URL = 'https://api.fonnte.com/send'

interface SendMessageParams {
    /** Nomor tujuan, format: 628xxxx */
    target: string
    /** Isi pesan teks */
    message: string
    /** URL file yang akan dikirim (opsional) */
    url?: string
    /** Nama file yang tampil di WA (opsional) */
    filename?: string
}

interface FonnteResponse {
    status: boolean
    detail?: string
    id?: string
}

/**
 * Ambil Fonnte token dari tabel Settings
 */
async function getFonnteToken(): Promise<string | null> {
    const setting = await prisma.setting.findUnique({
        where: { key: 'fonnte_token' },
    })
    return setting?.value || null
}

/**
 * Format nomor telepon ke format internasional (628xxx)
 */
export function formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/[\s\-\(\)]/g, '')

    // Ganti awalan 0 jadi 62
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.substring(1)
    }
    // Ganti awalan +62 jadi 62
    if (cleaned.startsWith('+62')) {
        cleaned = '62' + cleaned.substring(3)
    }

    return cleaned
}

/**
 * Kirim pesan WhatsApp via Fonnte API
 */
export async function sendWhatsAppMessage(params: SendMessageParams): Promise<{
    success: boolean
    message: string
    detail?: string
}> {
    const token = await getFonnteToken()
    if (!token) {
        return {
            success: false,
            message: 'Token Fonnte belum dikonfigurasi. Silakan atur di halaman Settings → Integrations.',
        }
    }

    const target = formatPhoneNumber(params.target)

    try {
        const formData = new FormData()
        formData.append('target', target)
        formData.append('message', params.message)
        formData.append('countryCode', '62')

        // Kirim file jika ada URL
        if (params.url) {
            formData.append('url', params.url)
            if (params.filename) {
                formData.append('filename', params.filename)
            }
        }

        const response = await fetch(FONNTE_API_URL, {
            method: 'POST',
            headers: {
                Authorization: token,
            },
            body: formData,
        })

        const result: FonnteResponse = await response.json()

        if (result.status) {
            return {
                success: true,
                message: 'Pesan WhatsApp berhasil dikirim.',
                detail: result.detail,
            }
        }

        return {
            success: false,
            message: `Gagal mengirim: ${result.detail || 'Unknown error'}`,
            detail: result.detail,
        }
    } catch (error: any) {
        return {
            success: false,
            message: `Error: ${error.message}`,
        }
    }
}

/**
 * Kirim pesan WhatsApp teks saja (tanpa file)
 */
export async function sendWhatsAppText(
    target: string,
    message: string
): Promise<{ success: boolean; message: string }> {
    return sendWhatsAppMessage({ target, message })
}

/**
 * Kirim pesan WhatsApp dengan lampiran file (PDF)
 */
export async function sendWhatsAppWithDocument(
    target: string,
    message: string,
    documentUrl: string,
    filename: string
): Promise<{ success: boolean; message: string }> {
    return sendWhatsAppMessage({
        target,
        message,
        url: documentUrl,
        filename,
    })
}
