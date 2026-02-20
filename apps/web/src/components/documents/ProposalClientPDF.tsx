import React from 'react'
import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { styles, colors } from './pdf-styles'

interface Fitur {
    nama: string
    keterangan: string
}

interface ProposalClientProps {
    nomorProposal: string
    tanggal: string
    tanggalBerlaku: string
    namaClient: string
    alamatClient: string
    picClient: string
    nohpClient: string
    namaProyek: string
    kategoriProyek: string
    deskripsiProyek: string
    fiturList: Fitur[]
    durasiProyek: string
    tanggalMulai: string
    tanggalSelesai: string
    totalBiaya: number
    dpAmount: number
    pelunasanAmount: number
    namaBank: string
    noRekening: string
    logoUrl?: string
}

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

export const ProposalClientPDF: React.FC<ProposalClientProps> = (props) => (
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

            <Text style={styles.docTitle}>PROPOSAL PENAWARAN</Text>
            <Text style={styles.docSubtitle}>LAYANAN PROYEK DIGITALISASI</Text>

            {/* INFO DOKUMEN */}
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Nomor Proposal</Text><Text style={styles.infoValue}>: {props.nomorProposal}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Tanggal</Text><Text style={styles.infoValue}>: {props.tanggal}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Berlaku Hingga</Text><Text style={styles.infoValue}>: {props.tanggalBerlaku}</Text></View>

            {/* KEPADA */}
            <Text style={styles.sectionTitle}>KEPADA</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Nama / Lembaga</Text><Text style={styles.infoValue}>: {props.namaClient}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Alamat</Text><Text style={styles.infoValue}>: {props.alamatClient}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>PIC / Kontak</Text><Text style={styles.infoValue}>: {props.picClient}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>No. Telepon</Text><Text style={styles.infoValue}>: {props.nohpClient}</Text></View>

            {/* PENDAHULUAN */}
            <Text style={styles.sectionTitle}>1. PENDAHULUAN</Text>
            <Text style={styles.paragraph}>
                Dengan hormat, terima kasih atas kepercayaan Bapak/Ibu/Saudara kepada Velora ID.
                Berdasarkan diskusi yang telah dilakukan, kami mengajukan proposal penawaran untuk
                proyek digitalisasi sebagai berikut.
            </Text>

            {/* LINGKUP PEKERJAAN */}
            <Text style={styles.sectionTitle}>2. LINGKUP PEKERJAAN</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Nama Proyek</Text><Text style={styles.infoValue}>: {props.namaProyek}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Kategori</Text><Text style={styles.infoValue}>: {props.kategoriProyek}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Deskripsi</Text><Text style={styles.infoValue}>: {props.deskripsiProyek}</Text></View>

            {/* TABEL FITUR */}
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, { width: 30 }]}>No.</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Fitur / Modul</Text>
                    <Text style={[styles.tableHeaderCell, { width: 120 }]}>Keterangan</Text>
                </View>
                {props.fiturList.map((f, i) => (
                    <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                        <Text style={[styles.tableCell, { width: 30 }]}>{i + 1}</Text>
                        <Text style={[styles.tableCell, { flex: 1 }]}>{f.nama}</Text>
                        <Text style={[styles.tableCell, { width: 120 }]}>{f.keterangan}</Text>
                    </View>
                ))}
            </View>

            {/* TIMELINE */}
            <Text style={styles.sectionTitle}>3. TIMELINE PENGERJAAN</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Estimasi Pengerjaan</Text><Text style={styles.infoValue}>: {props.durasiProyek} hari kerja</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Tanggal Mulai</Text><Text style={styles.infoValue}>: {props.tanggalMulai} (setelah DP diterima)</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Estimasi Selesai</Text><Text style={styles.infoValue}>: {props.tanggalSelesai}</Text></View>

            {/* BIAYA */}
            <Text style={styles.sectionTitle}>4. INVESTASI / BIAYA</Text>
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Komponen</Text>
                    <Text style={[styles.tableHeaderCell, { width: 150 }]}>Biaya</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 1 }]}>Total Nilai Proyek</Text>
                    <Text style={[styles.tableCell, { width: 150 }]}>{formatRupiah(props.totalBiaya)}</Text>
                </View>
                <View style={styles.tableRowAlt}>
                    <Text style={[styles.tableCell, { flex: 1 }]}>DP (Uang Muka) — 50%</Text>
                    <Text style={[styles.tableCell, { width: 150 }]}>{formatRupiah(props.dpAmount)}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 1 }]}>Pelunasan — 50%</Text>
                    <Text style={[styles.tableCell, { width: 150 }]}>{formatRupiah(props.pelunasanAmount)}</Text>
                </View>
            </View>

            {/* PEMBAYARAN */}
            <Text style={styles.sectionTitle}>5. METODE PEMBAYARAN</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Bank</Text><Text style={styles.infoValue}>: {props.namaBank}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>No. Rekening</Text><Text style={styles.infoValue}>: {props.noRekening}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Atas Nama</Text><Text style={styles.infoValue}>: Mahin Utsman Nawawi</Text></View>

            {/* KETENTUAN */}
            <Text style={styles.sectionTitle}>6. KETENTUAN TAMBAHAN</Text>
            <Text style={styles.listItem}>1. Proposal berlaku 14 hari sejak diterbitkan.</Text>
            <Text style={styles.listItem}>2. Revisi minor maksimal 3x revisi.</Text>
            <Text style={styles.listItem}>3. Perubahan scope dapat dikenakan biaya tambahan.</Text>
            <Text style={styles.listItem}>4. Proyek dimulai setelah DP diterima dan dikonfirmasi.</Text>
            <Text style={styles.listItem}>5. Source code menjadi milik klien setelah pelunasan penuh.</Text>

            {/* PENUTUP */}
            <Text style={styles.sectionTitle}>7. PENUTUP</Text>
            <Text style={styles.paragraph}>
                Demikian proposal ini kami sampaikan. Kami sangat berharap dapat bekerja sama dalam
                mewujudkan solusi digital yang optimal bagi kebutuhan Bapak/Ibu/Saudara.
            </Text>

            {/* TTD */}
            <View style={{ marginTop: 30, alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 9, marginBottom: 4 }}>Hormat kami,</Text>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>Velora ID</Text>
                <View style={{ width: 150, borderBottomWidth: 1, borderBottomColor: colors.text, marginTop: 40, marginBottom: 4 }} />
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold' }}>Mahin Utsman Nawawi, S.H</Text>
                <Text style={{ fontSize: 8, color: colors.textLight }}>Founder & CEO</Text>
            </View>

            <Text style={styles.footer}>
                Dokumen ini diterbitkan secara elektronik oleh Velora ID — {props.nomorProposal}
            </Text>
        </Page>
    </Document>
)

export default ProposalClientPDF
