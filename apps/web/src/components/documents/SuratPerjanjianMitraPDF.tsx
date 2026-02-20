import React from 'react'
import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { styles, colors } from './pdf-styles'

interface SuratPerjanjianMitraProps {
    nomorSurat: string
    tanggal: string
    hari: string
    kota: string
    namaMitra: string
    alamatMitra: string
    nohpMitra: string
    logoUrl?: string
}

export const SuratPerjanjianMitraPDF: React.FC<SuratPerjanjianMitraProps> = ({
    nomorSurat, tanggal, hari, kota, namaMitra, alamatMitra, nohpMitra, logoUrl,
}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* HEADER */}
            <View style={styles.header}>
                {logoUrl && <Image src={logoUrl} style={styles.logo} />}
                <View style={styles.headerInfo}>
                    <Text style={styles.companyName}>Velora ID</Text>
                    <Text style={styles.companyDetail}>NIB: 3110250097422</Text>
                    <Text style={styles.companyDetail}>Kp. Hegarmanah, Ds. Cikoneng, Kec. Pasirjambu, Kab. Bandung</Text>
                    <Text style={styles.companyDetail}>+62 851-1777-6596 | velora.1d@gmail.com</Text>
                </View>
            </View>

            {/* JUDUL */}
            <Text style={styles.docTitle}>SURAT PERJANJIAN KERJA SAMA</Text>
            <Text style={styles.docSubtitle}>MITRA SALES | PROYEK DIGITALISASI</Text>

            {/* INFO DOKUMEN */}
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Nomor</Text><Text style={styles.infoValue}>: {nomorSurat}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Hari / Tanggal</Text><Text style={styles.infoValue}>: {hari}, {tanggal}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Bertempat di</Text><Text style={styles.infoValue}>: {kota}</Text></View>

            {/* PIHAK PERTAMA */}
            <Text style={styles.sectionTitle}>PIHAK PERTAMA</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Nama</Text><Text style={styles.infoValue}>: Mahin Utsman Nawawi, S.H</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Nama Usaha</Text><Text style={styles.infoValue}>: Velora ID</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>NIB</Text><Text style={styles.infoValue}>: 3110250097422</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Alamat</Text><Text style={styles.infoValue}>: Kp. Hegarmanah, Ds. Cikoneng, Kec. Pasirjambu, Kab. Bandung</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>No. Kontak</Text><Text style={styles.infoValue}>: +62 851-1777-6596</Text></View>
            <Text style={styles.paragraph}>Selanjutnya disebut sebagai "PIHAK PERTAMA"</Text>

            {/* PIHAK KEDUA */}
            <Text style={styles.sectionTitle}>PIHAK KEDUA</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Nama</Text><Text style={styles.infoValue}>: {namaMitra}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Alamat</Text><Text style={styles.infoValue}>: {alamatMitra}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>No. HP</Text><Text style={styles.infoValue}>: {nohpMitra}</Text></View>
            <Text style={styles.paragraph}>Selanjutnya disebut sebagai "PIHAK KEDUA"</Text>

            <Text style={styles.paragraph}>
                PIHAK PERTAMA dan PIHAK KEDUA secara bersama-sama disebut sebagai "Para Pihak".
                Dengan ini Para Pihak sepakat untuk mengikatkan diri dalam kerja sama mitra sales / referral
                dengan ketentuan sebagai berikut:
            </Text>

            {/* PASAL 1 */}
            <Text style={styles.pasalTitle}>PASAL 1 — RUANG LINGKUP KERJA SAMA</Text>
            <Text style={styles.paragraph}>
                PIHAK KEDUA berperan sebagai mitra sales / referral yang membantu menghubungkan,
                mengenalkan, atau merekomendasikan calon klien kepada PIHAK PERTAMA.
                Seluruh proses teknis pengerjaan proyek sepenuhnya menjadi tanggung jawab PIHAK PERTAMA
                melalui usaha Velora.
            </Text>

            {/* PASAL 2 */}
            <Text style={styles.pasalTitle}>PASAL 2 — KATEGORI JENIS PROYEK</Text>
            <Text style={styles.listItem}>1. Proyek Pendidikan — Website sekolah, PPDB, e-rapor, dll.</Text>
            <Text style={styles.listItem}>2. Proyek UMKM dan Bisnis — Company profile, landing page, katalog produk.</Text>
            <Text style={styles.listItem}>3. Proyek Perusahaan & Organisasi — ERP, HRIS, CRM, dashboard.</Text>
            <Text style={styles.listItem}>4. Proyek Custom / Khusus — Aplikasi web/mobile custom.</Text>

            {/* PASAL 3 */}
            <Text style={styles.pasalTitle}>PASAL 3 — DEFINISI PROYEK DEAL</Text>
            <Text style={styles.paragraph}>
                Yang dimaksud dengan proyek DEAL adalah kondisi di mana klien yang direkomendasikan oleh
                PIHAK KEDUA telah menyetujui kerja sama dan melakukan pembayaran kepada PIHAK PERTAMA,
                baik berupa pembayaran penuh maupun uang muka (DP).
            </Text>

            {/* PASAL 4 */}
            <Text style={styles.pasalTitle}>PASAL 4 — KETENTUAN FEE</Text>
            <Text style={styles.listItem}>1. Proyek UMKM — Fee: Rp200.000 – Rp300.000 per proyek DEAL</Text>
            <Text style={styles.listItem}>2. Proyek Pendidikan — Fee: Rp1.000.000 per proyek DEAL</Text>
            <Text style={styles.listItem}>3. Proyek Skala Besar (≥ Rp11.000.000) — Fee: Rp2.000.000 per proyek DEAL</Text>

            {/* PASAL 5 */}
            <Text style={styles.pasalTitle}>PASAL 5 — PEMBAYARAN FEE</Text>
            <Text style={styles.listItem}>1. Fee dibayarkan setelah PIHAK PERTAMA menerima pembayaran dari klien.</Text>
            <Text style={styles.listItem}>2. Pembayaran fee paling lambat 7 hari kerja setelah pembayaran klien diterima.</Text>
            <Text style={styles.listItem}>3. Pembayaran melalui transfer ke rekening PIHAK KEDUA.</Text>

            {/* PASAL 6 */}
            <Text style={styles.pasalTitle}>PASAL 6 — KETENTUAN UMUM</Text>
            <Text style={styles.listItem}>1. Kerja sama ini bersifat tidak eksklusif.</Text>
            <Text style={styles.listItem}>2. Tidak terdapat kewajiban target penjualan bagi PIHAK KEDUA.</Text>
            <Text style={styles.listItem}>3. PIHAK KEDUA tidak diperkenankan menentukan harga atau memberikan komitmen tanpa persetujuan tertulis PIHAK PERTAMA.</Text>
            <Text style={styles.listItem}>4. Perjanjian ini dapat dihentikan oleh salah satu pihak dengan pemberitahuan sebelumnya.</Text>

            {/* PASAL 7 */}
            <Text style={styles.pasalTitle}>PASAL 7 — DASAR HUKUM</Text>
            <Text style={styles.listItem}>1. KUH Perdata Pasal 1320</Text>
            <Text style={styles.listItem}>2. KUH Perdata Pasal 1338</Text>
            <Text style={styles.listItem}>3. UU No. 11 Tahun 2008 jo. UU No. 19 Tahun 2016</Text>

            {/* PASAL 8 */}
            <Text style={styles.pasalTitle}>PASAL 8 — PENUTUP</Text>
            <Text style={styles.paragraph}>
                Surat Perjanjian ini dibuat dengan kesadaran penuh tanpa paksaan dari pihak manapun
                dan berlaku sejak tanggal ditandatangani. Demikian perjanjian ini dibuat untuk dipatuhi
                oleh Para Pihak.
            </Text>

            {/* TANDA TANGAN */}
            <View style={styles.signatureContainer}>
                <View style={styles.signatureBox}>
                    <Text style={styles.signatureLabel}>PIHAK PERTAMA</Text>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureName}>Mahin Utsman Nawawi, S.H</Text>
                </View>
                <View style={styles.signatureBox}>
                    <Text style={styles.signatureLabel}>PIHAK KEDUA</Text>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureName}>{namaMitra}</Text>
                </View>
            </View>

            {/* FOOTER */}
            <Text style={styles.footer}>
                Dokumen ini diterbitkan secara elektronik oleh Velora ID — {nomorSurat}
            </Text>
        </Page>
    </Document>
)

export default SuratPerjanjianMitraPDF
