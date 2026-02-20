import React from 'react'
import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { styles, colors } from './pdf-styles'

type JenisInvoice = 'DP' | 'PELUNASAN' | 'FULL'

interface InvoiceClientProps {
    nomorInvoice: string
    jenisInvoice: JenisInvoice
    tanggal: string
    jatuhTempo: string
    namaClient: string
    alamatClient: string
    picClient: string
    nohpClient: string
    namaProyek: string
    kategoriProyek: string
    nomorProposalRef: string
    totalBiaya: number
    jumlahTagihan: number
    persentaseBayar: number
    dpSudahBayar?: number
    sisaPembayaran?: number
    namaBank: string
    noRekening: string
    logoUrl?: string
}

const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

const getJenisLabel = (jenis: JenisInvoice) => {
    switch (jenis) {
        case 'DP': return 'UANG MUKA (DP)'
        case 'PELUNASAN': return 'PELUNASAN'
        case 'FULL': return 'PEMBAYARAN PENUH'
    }
}

const getBadgeStyle = (jenis: JenisInvoice) => {
    switch (jenis) {
        case 'DP': return styles.badgeDP
        case 'PELUNASAN': return styles.badgeLunas
        case 'FULL': return styles.badgeLunas
    }
}

export const InvoiceClientPDF: React.FC<InvoiceClientProps> = (props) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* HEADER */}
            <View style={styles.header}>
                {props.logoUrl && <Image src={props.logoUrl} style={styles.logo} />}
                <View style={styles.headerInfo}>
                    <Text style={styles.companyName}>Velora ID</Text>
                    <Text style={styles.companyDetail}>NIB: 3110250097422</Text>
                    <Text style={styles.companyDetail}>Kp. Hegarmanah, Ds. Cikoneng, Kec. Pasirjambu, Kab. Bandung</Text>
                    <Text style={styles.companyDetail}>+62 851-1777-6596 | velora.1d@gmail.com</Text>
                </View>
            </View>

            {/* JUDUL */}
            <Text style={styles.docTitle}>INVOICE</Text>
            <View style={{ alignItems: 'center', marginBottom: 15 }}>
                <Text style={[styles.badge, getBadgeStyle(props.jenisInvoice)]}>{getJenisLabel(props.jenisInvoice)}</Text>
            </View>

            {/* INFO INVOICE */}
            <Text style={styles.sectionTitle}>INFORMASI INVOICE</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Nomor Invoice</Text><Text style={styles.infoValue}>: {props.nomorInvoice}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Tanggal</Text><Text style={styles.infoValue}>: {props.tanggal}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Jatuh Tempo</Text><Text style={styles.infoValue}>: {props.jatuhTempo}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Ref. Proposal</Text><Text style={styles.infoValue}>: {props.nomorProposalRef}</Text></View>

            {/* KEPADA */}
            <Text style={styles.sectionTitle}>KEPADA (KLIEN)</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Nama / Lembaga</Text><Text style={styles.infoValue}>: {props.namaClient}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Alamat</Text><Text style={styles.infoValue}>: {props.alamatClient}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>PIC / Kontak</Text><Text style={styles.infoValue}>: {props.picClient}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>No. Telepon</Text><Text style={styles.infoValue}>: {props.nohpClient}</Text></View>

            {/* DETAIL PROYEK */}
            <Text style={styles.sectionTitle}>DETAIL PROYEK</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Nama Proyek</Text><Text style={styles.infoValue}>: {props.namaProyek}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Kategori</Text><Text style={styles.infoValue}>: {props.kategoriProyek}</Text></View>

            {/* RINCIAN PEMBAYARAN */}
            <Text style={styles.sectionTitle}>RINCIAN PEMBAYARAN</Text>
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, { width: 30 }]}>No.</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Deskripsi</Text>
                    <Text style={[styles.tableHeaderCell, { width: 150, textAlign: 'right' }]}>Jumlah (Rp)</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { width: 30 }]}>1</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>Total Nilai Proyek</Text>
                    <Text style={[styles.tableCell, { width: 150, textAlign: 'right' }]}>{formatRupiah(props.totalBiaya)}</Text>
                </View>
                <View style={styles.tableRowAlt}>
                    <Text style={[styles.tableCell, { width: 30 }]}>2</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{getJenisLabel(props.jenisInvoice)} ({props.persentaseBayar}%)</Text>
                    <Text style={[styles.tableCell, { width: 150, textAlign: 'right' }]}>{formatRupiah(props.jumlahTagihan)}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>TOTAL TAGIHAN</Text>
                    <Text style={styles.totalValue}>{formatRupiah(props.jumlahTagihan)}</Text>
                </View>
            </View>

            {/* CATATAN KONDISIONAL */}
            {props.jenisInvoice === 'DP' && props.sisaPembayaran && (
                <View style={styles.noteBox}>
                    <Text style={styles.noteText}>
                        Catatan: Sisa pembayaran sebesar {formatRupiah(props.sisaPembayaran)} akan
                        ditagihkan setelah proyek selesai 100%.
                    </Text>
                </View>
            )}
            {props.jenisInvoice === 'PELUNASAN' && props.dpSudahBayar && (
                <View style={styles.noteBox}>
                    <Text style={styles.noteText}>
                        Pembayaran DP sebelumnya: {formatRupiah(props.dpSudahBayar)}{'\n'}
                        Sisa Pelunasan: {formatRupiah(props.jumlahTagihan)}{'\n'}
                        Status setelah pelunasan: LUNAS
                    </Text>
                </View>
            )}

            {/* METODE PEMBAYARAN */}
            <Text style={styles.sectionTitle}>METODE PEMBAYARAN</Text>
            <Text style={styles.paragraph}>Silakan melakukan transfer ke rekening berikut:</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Bank</Text><Text style={styles.infoValue}>: {props.namaBank}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>No. Rekening</Text><Text style={styles.infoValue}>: {props.noRekening}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Atas Nama</Text><Text style={styles.infoValue}>: Mahin Utsman Nawawi</Text></View>

            <View style={styles.noteBox}>
                <Text style={styles.noteText}>
                    Mohon sertakan nomor invoice pada keterangan transfer. Setelah pembayaran,
                    konfirmasi via WhatsApp ke +62 851-1777-6596 dengan melampirkan bukti transfer.
                </Text>
            </View>

            {/* SYARAT */}
            <Text style={styles.sectionTitle}>SYARAT & KETENTUAN</Text>
            <Text style={styles.listItem}>1. Pembayaran dilakukan paling lambat pada tanggal jatuh tempo.</Text>
            <Text style={styles.listItem}>2. Invoice ini sah tanpa tanda tangan basah (diterbitkan secara elektronik).</Text>
            <Text style={styles.listItem}>3. Pengerjaan proyek dimulai/dilanjutkan setelah pembayaran dikonfirmasi.</Text>

            {/* TTD */}
            <View style={{ marginTop: 25, alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 9, marginBottom: 4 }}>Diterbitkan oleh,</Text>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>Velora ID</Text>
                <View style={{ width: 150, borderBottomWidth: 1, borderBottomColor: colors.text, marginTop: 35, marginBottom: 4 }} />
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold' }}>Mahin Utsman Nawawi, S.H</Text>
                <Text style={{ fontSize: 8, color: colors.textLight }}>Founder & CEO</Text>
            </View>

            <Text style={styles.footer}>
                Dokumen ini diterbitkan secara elektronik oleh Velora ID — {props.nomorInvoice}
            </Text>
        </Page>
    </Document>
)

export default InvoiceClientPDF
