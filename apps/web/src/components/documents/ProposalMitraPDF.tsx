import React from 'react'
import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { styles, colors } from './pdf-styles'

interface ProposalMitraProps {
    nomorProposal: string
    tanggal: string
    tanggalBerlaku: string
    namaCalonMitra: string
    alamatCalonMitra: string
    nohpCalonMitra: string
    logoUrl?: string
}

export const ProposalMitraPDF: React.FC<ProposalMitraProps> = (props) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* HEADER */}
            <View style={styles.header}>
                {props.logoUrl && <Image src={props.logoUrl} style={styles.logo} />}
                <View style={styles.headerInfo}>
                    <Text style={styles.companyName}>Velora ID</Text>
                    <Text style={styles.companyDetail}>NIB: 3110250097422</Text>
                    <Text style={styles.companyDetail}>Kp. Hegarmanah, Ds. Cikoneng, Kec. Pasirjambu, Kab. Bandung</Text>
                    <Text style={styles.companyDetail}>+62 851-1777-6596 | velora.1d@gmail.com | velora.my.id</Text>
                </View>
            </View>

            <Text style={styles.docTitle}>PROPOSAL KERJA SAMA</Text>
            <Text style={styles.docSubtitle}>MITRA SALES / REFERRAL — PROYEK DIGITALISASI</Text>

            {/* INFO DOKUMEN */}
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Nomor Proposal</Text><Text style={styles.infoValue}>: {props.nomorProposal}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Tanggal</Text><Text style={styles.infoValue}>: {props.tanggal}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Berlaku Hingga</Text><Text style={styles.infoValue}>: {props.tanggalBerlaku}</Text></View>

            {/* KEPADA */}
            <Text style={styles.sectionTitle}>KEPADA</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Nama</Text><Text style={styles.infoValue}>: {props.namaCalonMitra}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Alamat</Text><Text style={styles.infoValue}>: {props.alamatCalonMitra}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>No. HP / WA</Text><Text style={styles.infoValue}>: {props.nohpCalonMitra}</Text></View>

            {/* 1. TENTANG */}
            <Text style={styles.sectionTitle}>1. TENTANG VELORA</Text>
            <Text style={styles.paragraph}>
                Velora ID adalah usaha yang bergerak di bidang digitalisasi, mencakup pengembangan website,
                aplikasi web, aplikasi mobile, dan sistem informasi untuk berbagai sektor, termasuk
                pendidikan, UMKM, perusahaan, dan organisasi lainnya. Kami membuka peluang kerja sama
                untuk individu yang ingin menjadi mitra sales / referral tanpa keterikatan target penjualan.
            </Text>

            {/* 2. PERAN */}
            <Text style={styles.sectionTitle}>2. PERAN MITRA</Text>
            <Text style={styles.paragraph}>Sebagai mitra sales / referral, peran Anda meliputi:</Text>
            <Text style={styles.listItem}>1. Menghubungkan atau merekomendasikan calon klien kepada Velora.</Text>
            <Text style={styles.listItem}>2. Meneruskan informasi kontak calon klien kepada tim Velora.</Text>
            <Text style={styles.listItem}>3. Tidak perlu presentasi teknis — cukup referral saja.</Text>

            {/* 3. KATEGORI */}
            <Text style={styles.sectionTitle}>3. KATEGORI PROYEK</Text>
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, { width: 30 }]}>No.</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Kategori</Text>
                    <Text style={[styles.tableHeaderCell, { width: 180 }]}>Contoh</Text>
                </View>
                {[
                    { no: '1', kat: 'Proyek Pendidikan', contoh: 'Website sekolah, PPDB, e-rapor' },
                    { no: '2', kat: 'Proyek UMKM & Bisnis', contoh: 'Company profile, landing page' },
                    { no: '3', kat: 'Proyek Perusahaan', contoh: 'ERP, HRIS, CRM, dashboard' },
                    { no: '4', kat: 'Proyek Custom', contoh: 'Aplikasi web/mobile custom' },
                ].map((item, i) => (
                    <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                        <Text style={[styles.tableCell, { width: 30 }]}>{item.no}</Text>
                        <Text style={[styles.tableCell, { flex: 1 }]}>{item.kat}</Text>
                        <Text style={[styles.tableCell, { width: 180 }]}>{item.contoh}</Text>
                    </View>
                ))}
            </View>

            {/* 4. FEE */}
            <Text style={styles.sectionTitle}>4. SKEMA FEE MITRA</Text>
            <Text style={styles.paragraph}>Fee diberikan untuk setiap proyek yang DEAL:</Text>
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Kategori Proyek</Text>
                    <Text style={[styles.tableHeaderCell, { width: 180 }]}>Fee per Proyek DEAL</Text>
                </View>
                {[
                    { kat: 'Proyek UMKM', fee: 'Rp 200.000 – Rp 300.000' },
                    { kat: 'Proyek Pendidikan', fee: 'Rp 1.000.000' },
                    { kat: 'Proyek Skala Besar (≥ Rp11 juta)', fee: 'Rp 2.000.000' },
                ].map((item, i) => (
                    <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                        <Text style={[styles.tableCell, { flex: 1 }]}>{item.kat}</Text>
                        <Text style={[styles.tableCell, { width: 180 }]}>{item.fee}</Text>
                    </View>
                ))}
            </View>
            <Text style={styles.listItem}>• Fee dibayarkan setelah pembayaran klien diterima Velora.</Text>
            <Text style={styles.listItem}>• Transfer maks. 7 hari kerja setelah pembayaran klien masuk.</Text>

            {/* 5. KEUNGGULAN */}
            <Text style={styles.sectionTitle}>5. KEUNGGULAN MENJADI MITRA</Text>
            <Text style={styles.listItem}>✓ Tidak ada target penjualan</Text>
            <Text style={styles.listItem}>✓ Tidak perlu keahlian teknis</Text>
            <Text style={styles.listItem}>✓ Fee langsung setelah proyek Deal</Text>
            <Text style={styles.listItem}>✓ Akses sistem VeloTrack untuk memantau status lead</Text>
            <Text style={styles.listItem}>✓ Tanpa biaya pendaftaran</Text>
            <Text style={styles.listItem}>✓ Surat Perjanjian resmi disediakan</Text>

            {/* 6. ALUR */}
            <Text style={styles.sectionTitle}>6. ALUR KERJA SAMA</Text>
            <Text style={styles.listItem}>1. Mitra merekomendasikan calon klien ke Velora</Text>
            <Text style={styles.listItem}>2. Velora menghubungi klien & menyiapkan proposal</Text>
            <Text style={styles.listItem}>3. Klien setuju & bayar DP → Status: DEAL</Text>
            <Text style={styles.listItem}>4. Fee ditransfer ke Mitra (maks. 7 hari kerja)</Text>

            {/* 7. CARA BERGABUNG */}
            <Text style={styles.sectionTitle}>7. CARA BERGABUNG</Text>
            <Text style={styles.listItem}>1. Hubungi via WhatsApp di +62 851-1777-6596</Text>
            <Text style={styles.listItem}>2. Kirimkan: Nama Lengkap, Alamat, No. WA</Text>
            <Text style={styles.listItem}>3. Kami kirimkan Surat Perjanjian untuk ditandatangani</Text>
            <Text style={styles.listItem}>4. Anda resmi menjadi Mitra Velora & dapat akses VeloTrack</Text>

            {/* PENUTUP */}
            <Text style={styles.sectionTitle}>8. PENUTUP</Text>
            <Text style={styles.paragraph}>
                Demikian proposal kerja sama ini kami sampaikan. Kami percaya kolaborasi ini
                akan memberikan manfaat bagi kedua belah pihak. Atas perhatiannya, kami ucapkan
                terima kasih.
            </Text>

            {/* TTD */}
            <View style={{ marginTop: 25, alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 9, marginBottom: 4 }}>Hormat kami,</Text>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>Velora ID</Text>
                <View style={{ width: 150, borderBottomWidth: 1, borderBottomColor: colors.text, marginTop: 35, marginBottom: 4 }} />
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold' }}>Mahin Utsman Nawawi, S.H</Text>
                <Text style={{ fontSize: 8, color: colors.textLight }}>Founder & CEO</Text>
            </View>

            <Text style={styles.footer}>
                Dokumen ini diterbitkan secara elektronik oleh Velora ID — {props.nomorProposal}
            </Text>
        </Page>
    </Document>
)

export default ProposalMitraPDF
