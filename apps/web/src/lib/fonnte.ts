'use server'

// ──────────────────────────────────────
// Fonnte WhatsApp API Wrapper
// Docs: https://docs.fonnte.com/api-send-message/
// ──────────────────────────────────────

const FONNTE_API_URL = 'https://api.fonnte.com/send'

interface FonnteResponse {
    status: boolean
    reason?: string
    id?: string
    detail?: string
}

interface SendWhatsAppOptions {
    target: string        // nomor WA tujuan (08xxx atau 628xxx)
    message: string       // isi pesan teks
    fileUrl?: string      // URL file (PDF/gambar) untuk dikirim sebagai attachment
    filename?: string     // nama file (opsional, untuk PDF)
    countryCode?: string  // kode negara, default '62' (Indonesia)
}

/**
 * Mendapatkan token Fonnte dari environment atau database Settings.
 */
async function getFonnteToken(): Promise<string> {
    // Prioritas 1: dari environment variable
    const envToken = process.env.FONNTE_TOKEN
    if (envToken) return envToken

    // Prioritas 2: dari database Settings
    try {
        const { prisma } = await import('@/lib/prisma')
        const setting = await prisma.setting.findUnique({
            where: { key: 'FONNTE_TOKEN' },
        })
        if (setting?.value) return setting.value
    } catch {
        // Jika gagal baca database, skip
    }

    throw new Error('Token Fonnte tidak ditemukan. Silakan atur di Settings > Integrasi.')
}

/**
 * Kirim pesan WhatsApp via Fonnte API.
 * Support teks biasa dan kirim file (PDF/gambar) via URL.
 */
export async function sendWhatsApp(options: SendWhatsAppOptions): Promise<FonnteResponse> {
    const token = await getFonnteToken()

    const formData = new FormData()
    formData.append('target', options.target)
    formData.append('message', options.message)
    formData.append('countryCode', options.countryCode || '62')

    if (options.fileUrl) {
        formData.append('url', options.fileUrl)
    }
    if (options.filename) {
        formData.append('filename', options.filename)
    }

    const response = await fetch(FONNTE_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': token,
        },
        body: formData,
    })

    if (!response.ok) {
        throw new Error(`Fonnte API error: ${response.status} ${response.statusText}`)
    }

    const result: FonnteResponse = await response.json()

    if (!result.status) {
        throw new Error(`Gagal kirim WhatsApp: ${result.reason || 'Unknown error'}`)
    }

    return result
}

/**
 * Test koneksi ke Fonnte API menggunakan token tertentu.
 * Mengirim request validasi tanpa benar-benar mengirim pesan.
 */
export async function testFonnteConnection(token: string): Promise<{ success: boolean; message: string }> {
    try {
        const response = await fetch('https://api.fonnte.com/device', {
            method: 'POST',
            headers: {
                'Authorization': token,
            },
        })

        const result = await response.json()

        if (result.status) {
            return {
                success: true,
                message: `Koneksi berhasil! Device: ${result.device || 'Connected'}`,
            }
        }

        return {
            success: false,
            message: result.reason || 'Token tidak valid atau device tidak terhubung.',
        }
    } catch (error: any) {
        return {
            success: false,
            message: `Gagal terhubung: ${error.message}`,
        }
    }
}
