import { StyleSheet, Font } from '@react-pdf/renderer'

// ──────────────────────────────────────
// Styles dasar untuk semua template PDF
// ──────────────────────────────────────
export const colors = {
    primary: '#1a365d',
    secondary: '#2d5aa0',
    accent: '#e67e22',
    text: '#1a202c',
    textLight: '#4a5568',
    border: '#cbd5e0',
    bgLight: '#f7fafc',
    white: '#ffffff',
}

export const styles = StyleSheet.create({
    page: {
        paddingTop: 40,
        paddingBottom: 60,
        paddingHorizontal: 50,
        fontSize: 10,
        fontFamily: 'Helvetica',
        color: colors.text,
        lineHeight: 1.6,
    },
    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
    },
    logo: {
        width: 80,
        height: 80,
    },
    headerInfo: {
        textAlign: 'right',
    },
    companyName: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        color: colors.primary,
    },
    companyDetail: {
        fontSize: 8,
        color: colors.textLight,
        marginTop: 2,
    },
    // Judul Dokumen
    docTitle: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
        color: colors.primary,
        marginVertical: 15,
    },
    docSubtitle: {
        fontSize: 11,
        textAlign: 'center',
        color: colors.secondary,
        marginBottom: 20,
    },
    // Section
    sectionTitle: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: colors.primary,
        marginTop: 15,
        marginBottom: 8,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    // Label-Value pairs
    infoRow: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    infoLabel: {
        width: 130,
        fontFamily: 'Helvetica-Bold',
        fontSize: 9,
        color: colors.textLight,
    },
    infoValue: {
        flex: 1,
        fontSize: 9,
    },
    // Tabel
    table: {
        marginVertical: 10,
        borderWidth: 1,
        borderColor: colors.border,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
    },
    tableHeaderCell: {
        paddingVertical: 6,
        paddingHorizontal: 8,
        fontFamily: 'Helvetica-Bold',
        fontSize: 8,
        color: colors.white,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    tableRowAlt: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.bgLight,
    },
    tableCell: {
        paddingVertical: 5,
        paddingHorizontal: 8,
        fontSize: 9,
    },
    // Total
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 8,
        paddingHorizontal: 8,
        backgroundColor: colors.primary,
    },
    totalLabel: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 10,
        color: colors.white,
        marginRight: 20,
    },
    totalValue: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 10,
        color: colors.white,
        width: 120,
        textAlign: 'right',
    },
    // Paragraf
    paragraph: {
        fontSize: 9,
        marginBottom: 6,
        textAlign: 'justify',
    },
    paragraphBold: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 6,
    },
    // Pasal
    pasalTitle: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: colors.primary,
        marginTop: 12,
        marginBottom: 6,
    },
    listItem: {
        fontSize: 9,
        marginBottom: 3,
        paddingLeft: 15,
    },
    // Tanda Tangan
    signatureContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40,
    },
    signatureBox: {
        width: 200,
        alignItems: 'center',
    },
    signatureLabel: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 50,
    },
    signatureLine: {
        width: 150,
        borderBottomWidth: 1,
        borderBottomColor: colors.text,
        marginBottom: 4,
    },
    signatureName: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 25,
        left: 50,
        right: 50,
        textAlign: 'center',
        fontSize: 7,
        color: colors.textLight,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 8,
    },
    // Badge/Status
    badge: {
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 4,
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: colors.white,
        alignSelf: 'flex-start',
    },
    badgeDP: { backgroundColor: '#e67e22' },
    badgeLunas: { backgroundColor: '#27ae60' },
    badgePending: { backgroundColor: '#7f8c8d' },
    // Catatan
    noteBox: {
        backgroundColor: colors.bgLight,
        padding: 10,
        marginVertical: 10,
        borderLeftWidth: 3,
        borderLeftColor: colors.accent,
    },
    noteText: {
        fontSize: 8,
        color: colors.textLight,
        fontStyle: 'italic',
    },
})
