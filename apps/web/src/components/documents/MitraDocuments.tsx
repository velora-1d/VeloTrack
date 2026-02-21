'use client'

import React, { useState, useEffect } from 'react'
import { getDocumentsByMitra } from '@/lib/actions/documents'
import { sendDocumentViaWA } from '@/lib/actions/whatsapp'

type DocumentType = 'PROPOSAL_CLIENT' | 'INVOICE_DP' | 'INVOICE_PELUNASAN' | 'INVOICE_FULL' | 'SURAT_PERJANJIAN_MITRA' | 'PROPOSAL_MITRA'

// ──────────────────────────────────────
// Tipe
// ──────────────────────────────────────
interface DocumentItem {
    id: string
    documentNo: string
    type: DocumentType
    title: string
    recipientName: string
    fileUrl: string | null
    sentViaWa: boolean
    sentAt: Date | null
    createdAt: Date
    lead?: { id: string; name: string; status: string } | null
    project?: { id: string; name: string; clientName: string } | null
}

interface MitraDocumentsProps {
    mitraId: string
    mitraName: string
    onGenerateSuratPerjanjian: () => void
    onGenerateProposalMitra: () => void
    onGenerateProposalClient: (leadId: string) => void
    onGenerateInvoice: (projectId: string, jenis: 'DP' | 'PELUNASAN' | 'FULL') => void
}

// ──────────────────────────────────────
// Helper
// ──────────────────────────────────────
const typeLabels: Record<DocumentType, string> = {
    SURAT_PERJANJIAN_MITRA: 'Surat Perjanjian',
    PROPOSAL_MITRA: 'Proposal Mitra',
    PROPOSAL_CLIENT: 'Proposal Client',
    INVOICE_DP: 'Invoice DP',
    INVOICE_PELUNASAN: 'Invoice Pelunasan',
    INVOICE_FULL: 'Invoice',
}

const typeColors: Record<DocumentType, string> = {
    SURAT_PERJANJIAN_MITRA: '#6366f1',
    PROPOSAL_MITRA: '#8b5cf6',
    PROPOSAL_CLIENT: '#3b82f6',
    INVOICE_DP: '#f59e0b',
    INVOICE_PELUNASAN: '#22c55e',
    INVOICE_FULL: '#22c55e',
}

const typeIcons: Record<DocumentType, string> = {
    SURAT_PERJANJIAN_MITRA: '📋',
    PROPOSAL_MITRA: '📄',
    PROPOSAL_CLIENT: '📑',
    INVOICE_DP: '🧾',
    INVOICE_PELUNASAN: '✅',
    INVOICE_FULL: '✅',
}

function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
    })
}

// ──────────────────────────────────────
// Komponen Utama
// ──────────────────────────────────────
export default function MitraDocuments({
    mitraId, mitraName,
    onGenerateSuratPerjanjian, onGenerateProposalMitra,
    onGenerateProposalClient, onGenerateInvoice,
}: MitraDocumentsProps) {
    const [documents, setDocuments] = useState<DocumentItem[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<DocumentType | 'ALL'>('ALL')
    const [sendingWaId, setSendingWaId] = useState<string | null>(null)

    useEffect(() => {
        loadDocuments()
    }, [mitraId])

    async function loadDocuments() {
        setLoading(true)
        try {
            const docs = await getDocumentsByMitra(mitraId)
            setDocuments(docs as DocumentItem[])
        } catch (err) {
            console.error('Error loading documents:', err)
        } finally {
            setLoading(false)
        }
    }

    async function handleSendWa(doc: DocumentItem) {
        // Tentukan nomor tujuan berdasarkan tipe dokumen
        const targetPhone = prompt('Masukkan nomor WhatsApp tujuan (contoh: 08xxx):')
        if (!targetPhone) return

        setSendingWaId(doc.id)
        try {
            const result = await sendDocumentViaWA(doc.id, targetPhone)
            if (result.success) {
                alert('✅ Berhasil dikirim via WhatsApp!')
                loadDocuments() // refresh status
            } else {
                alert(`❌ ${result.message}`)
            }
        } catch (err: any) {
            alert(`Error: ${err.message}`)
        } finally {
            setSendingWaId(null)
        }
    }

    // Filter dokumen
    const filteredDocs = filter === 'ALL'
        ? documents
        : documents.filter(d => d.type === filter)

    // Hitung stats
    const stats = {
        total: documents.length,
        suratPerjanjian: documents.filter(d => d.type === 'SURAT_PERJANJIAN_MITRA').length,
        proposalMitra: documents.filter(d => d.type === 'PROPOSAL_MITRA').length,
        proposalClient: documents.filter(d => d.type === 'PROPOSAL_CLIENT').length,
        invoice: documents.filter(d => ['INVOICE_DP', 'INVOICE_PELUNASAN', 'INVOICE_FULL'].includes(d.type)).length,
        sentWa: documents.filter(d => d.sentViaWa).length,
    }

    const hasSuratPerjanjian = stats.suratPerjanjian > 0
    const hasProposalMitra = stats.proposalMitra > 0

    return (
        <div style={{ padding: '24px 0' }}>
            {/* ── Header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                        📁 Dokumen Mitra — {mitraName}
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                        {stats.total} dokumen total • {stats.sentWa} dikirim via WA
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {!hasSuratPerjanjian && (
                        <button onClick={onGenerateSuratPerjanjian} style={buttonStyle('#6366f1')}>
                            + Surat Perjanjian
                        </button>
                    )}
                    {!hasProposalMitra && (
                        <button onClick={onGenerateProposalMitra} style={buttonStyle('#8b5cf6')}>
                            + Proposal Mitra
                        </button>
                    )}
                </div>
            </div>

            {/* ── Stats Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
                {[
                    { label: 'Surat Perjanjian', count: stats.suratPerjanjian, icon: '📋', color: '#6366f1' },
                    { label: 'Proposal Mitra', count: stats.proposalMitra, icon: '📄', color: '#8b5cf6' },
                    { label: 'Proposal Client', count: stats.proposalClient, icon: '📑', color: '#3b82f6' },
                    { label: 'Invoice', count: stats.invoice, icon: '🧾', color: '#f59e0b' },
                ].map((stat) => (
                    <div key={stat.label} style={{
                        background: 'var(--card-bg, #fff)',
                        border: '1px solid var(--border-color, #e2e8f0)',
                        borderRadius: 10,
                        padding: '14px 16px',
                        borderLeft: `4px solid ${stat.color}`,
                    }}>
                        <div style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.count}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Filter Tabs ── */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {[
                    { key: 'ALL' as const, label: 'Semua' },
                    { key: 'SURAT_PERJANJIAN_MITRA' as const, label: 'Surat Perjanjian' },
                    { key: 'PROPOSAL_MITRA' as const, label: 'Proposal Mitra' },
                    { key: 'PROPOSAL_CLIENT' as const, label: 'Proposal Client' },
                    { key: 'INVOICE_DP' as const, label: 'Invoice DP' },
                    { key: 'INVOICE_PELUNASAN' as const, label: 'Invoice Pelunasan' },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        style={{
                            padding: '6px 14px',
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: filter === tab.key ? 600 : 400,
                            border: 'none',
                            background: filter === tab.key ? 'var(--primary, #3b82f6)' : 'var(--card-bg, #f1f5f9)',
                            color: filter === tab.key ? '#fff' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Daftar Dokumen ── */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
                    Memuat dokumen...
                </div>
            ) : filteredDocs.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '40px 20px',
                    background: 'var(--card-bg, #f8fafc)', borderRadius: 12,
                    border: '1px dashed var(--border-color, #e2e8f0)',
                }}>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Belum ada dokumen</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {filteredDocs.map((doc) => (
                        <div key={doc.id} style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            background: 'var(--card-bg, #fff)',
                            border: '1px solid var(--border-color, #e2e8f0)',
                            borderRadius: 10, padding: '14px 18px',
                            transition: 'box-shadow 0.2s',
                        }}>
                            {/* Icon */}
                            <div style={{
                                width: 44, height: 44, borderRadius: 10,
                                background: `${typeColors[doc.type]}15`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 20,
                            }}>
                                {typeIcons[doc.type]}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
                                    {doc.title}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                                    {doc.documentNo} • {formatDate(doc.createdAt)}
                                    {doc.lead && <span> • Lead: {doc.lead.name}</span>}
                                    {doc.project && <span> • Proyek: {doc.project.name}</span>}
                                </div>
                            </div>

                            {/* Badge Jenis */}
                            <span style={{
                                padding: '3px 10px', borderRadius: 20,
                                fontSize: 10, fontWeight: 600,
                                background: `${typeColors[doc.type]}15`,
                                color: typeColors[doc.type],
                            }}>
                                {typeLabels[doc.type]}
                            </span>

                            {/* WA Sent */}
                            {doc.sentViaWa && (
                                <span style={{ fontSize: 16 }} title="Sudah dikirim via WA">✅</span>
                            )}

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 6 }}>
                                {doc.fileUrl && !doc.sentViaWa && (
                                    <button
                                        onClick={() => handleSendWa(doc)}
                                        disabled={sendingWaId === doc.id}
                                        style={{
                                            ...actionBtnStyle,
                                            background: sendingWaId === doc.id ? '#d1d5db' : '#25d366',
                                            color: '#fff',
                                            border: 'none',
                                            opacity: sendingWaId === doc.id ? 0.6 : 1,
                                        }}
                                        title="Kirim via WhatsApp"
                                    >
                                        {sendingWaId === doc.id ? '⏳' : '📲'}
                                    </button>
                                )}
                                {doc.fileUrl && (
                                    <a
                                        href={doc.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={actionBtnStyle}
                                        title="Download PDF"
                                    >
                                        ⬇️
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ──────────────────────────────────────
// Inline Styles
// ──────────────────────────────────────
function buttonStyle(color: string): React.CSSProperties {
    return {
        padding: '8px 16px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        border: 'none',
        background: color,
        color: '#fff',
        cursor: 'pointer',
        transition: 'opacity 0.2s',
    }
}

const actionBtnStyle: React.CSSProperties = {
    width: 32, height: 32, borderRadius: 8,
    border: '1px solid var(--border-color, #e2e8f0)',
    background: 'var(--card-bg, #fff)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontSize: 14,
    textDecoration: 'none',
}
