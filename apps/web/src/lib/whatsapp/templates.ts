/**
 * Template Pesan WhatsApp
 * Setiap template menerima data dinamis dan mengembalikan string pesan
 */

// ──────────────────────────────────────
// Tipe Data
// ──────────────────────────────────────
interface SuratPerjanjianData {
    namaMitra: string
    nomorSurat: string
    tanggal: string
}

interface ProposalClientData {
    namaClient: string
    namaProyek: string
    nomorProposal: string
    totalBiaya: string // sudah diformat "Rp x.xxx.xxx"
}

interface InvoiceData {
    namaClient: string
    namaProyek: string
    nomorInvoice: string
    jenisInvoice: 'DP' | 'PELUNASAN' | 'FULL'
    jumlahTagihan: string // sudah diformat
    jatuhTempo: string
}

interface ProposalMitraData {
    namaCalonMitra: string
    nomorProposal: string
}

// ──────────────────────────────────────
// Template Pesan
// ──────────────────────────────────────

/**
 * Pesan untuk Surat Perjanjian Mitra
 */
export function templateSuratPerjanjian(data: SuratPerjanjianData): string {
    return `Assalamu'alaikum Kak *${data.namaMitra}* 👋

Terima kasih telah bergabung sebagai Mitra Velora ID! 🤝

Berikut kami lampirkan *Surat Perjanjian Kerja Sama* Anda:

📋 *No. Surat:* ${data.nomorSurat}
📅 *Tanggal:* ${data.tanggal}

Silakan dibaca dan disimpan dengan baik. Jika ada pertanyaan, jangan ragu untuk menghubungi kami.

Terima kasih,
*Velora ID*
_Digitalisasi untuk Kemajuan Bersama_ 🚀`
}

/**
 * Pesan untuk Proposal Client
 */
export function templateProposalClient(data: ProposalClientData): string {
    return `Assalamu'alaikum 👋

Terima kasih atas kepercayaan Bapak/Ibu kepada *Velora ID*.

Berikut kami kirimkan *Proposal Penawaran* untuk proyek:
📌 *Proyek:* ${data.namaProyek}
📄 *No. Proposal:* ${data.nomorProposal}
💰 *Nilai:* ${data.totalBiaya}

Proposal ini berlaku 14 hari sejak diterbitkan. Jika berkenan, kami siap berdiskusi lebih lanjut mengenai detail teknisnya.

Terima kasih,
*Velora ID* 🚀`
}

/**
 * Pesan untuk Invoice Client
 */
export function templateInvoice(data: InvoiceData): string {
    const jenisLabel = {
        DP: 'Uang Muka (DP)',
        PELUNASAN: 'Pelunasan',
        FULL: 'Pembayaran Penuh',
    }

    return `Assalamu'alaikum 👋

Berikut kami kirimkan *Invoice ${jenisLabel[data.jenisInvoice]}* untuk proyek:

📌 *Proyek:* ${data.namaProyek}
🧾 *No. Invoice:* ${data.nomorInvoice}
💰 *Total Tagihan:* ${data.jumlahTagihan}
📅 *Jatuh Tempo:* ${data.jatuhTempo}

Mohon melakukan pembayaran sebelum tanggal jatuh tempo. Setelah transfer, silakan konfirmasi ke nomor ini dengan melampirkan bukti pembayaran.

Terima kasih,
*Velora ID* 🚀`
}

/**
 * Pesan untuk Proposal Mitra
 */
export function templateProposalMitra(data: ProposalMitraData): string {
    return `Assalamu'alaikum Kak *${data.namaCalonMitra}* 👋

Kami dari *Velora ID* ingin menawarkan peluang kerja sama sebagai *Mitra Sales / Referral*.

📄 *No. Proposal:* ${data.nomorProposal}

Berikut kami lampirkan detail kerja sama, skema fee, dan cara bergabung. Silakan dibaca terlebih dahulu.

✅ Tanpa target penjualan
✅ Tanpa biaya pendaftaran
✅ Fee langsung setelah proyek Deal

Jika tertarik, cukup balas pesan ini. Kami siap membantu! 🙌

*Velora ID*
_Digitalisasi untuk Kemajuan Bersama_ 🚀`
}
