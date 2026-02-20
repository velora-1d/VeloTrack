================================================================================
                              INVOICE
                          PROYEK DIGITALISASI
================================================================================

                            [LOGO VELORA]

────────────────────────────────────────────────────────────────────────────────
INFORMASI INVOICE
────────────────────────────────────────────────────────────────────────────────
Nomor Invoice     : {{nomor_invoice}}
Jenis             : {{jenis_invoice}}  (DP / PELUNASAN / PEMBAYARAN PENUH)
Tanggal           : {{tanggal}}
Jatuh Tempo       : {{jatuh_tempo}}  (7 hari setelah tanggal invoice)
Status            : {{status_bayar}}  (BELUM LUNAS / LUNAS)

────────────────────────────────────────────────────────────────────────────────
DARI (PENERBIT)
────────────────────────────────────────────────────────────────────────────────
Nama Usaha        : Velora ID
NIB               : 3110250097422
Alamat            : Kp. Hegarmanah, Ds. Cikoneng, Kec. Pasirjambu, Kab. Bandung
No. Kontak        : +62 851-1777-6596
Email             : velora.1d@gmail.com

────────────────────────────────────────────────────────────────────────────────
KEPADA (KLIEN)
────────────────────────────────────────────────────────────────────────────────
Nama / Lembaga    : {{nama_client}}
Alamat            : {{alamat_client}}
PIC / Kontak      : {{pic_client}}
No. Telepon       : {{nohp_client}}

================================================================================
DETAIL PROYEK
================================================================================
Nama Proyek       : {{nama_proyek}}
Kategori          : {{kategori_proyek}}
No. Proposal Ref  : {{nomor_proposal}}  (referensi proposal yang disetujui)

================================================================================
RINCIAN PEMBAYARAN
================================================================================
┌─────┬────────────────────────────────────┬─────────────────────────┐
│ No. │ Deskripsi                          │ Jumlah (Rp)             │
├─────┼────────────────────────────────────┼─────────────────────────┤
│  1  │ Total Nilai Proyek                 │ {{total_biaya}}         │
├─────┼────────────────────────────────────┼─────────────────────────┤
│  2  │ {{label_pembayaran}}               │ {{jumlah_tagihan}}      │
│     │ ({{persentase_bayar}}%)            │                         │
└─────┴────────────────────────────────────┴─────────────────────────┘

────────────────────────────────────────────────────────────────────────────────
  TOTAL TAGIHAN SAAT INI :  Rp {{jumlah_tagihan}}
────────────────────────────────────────────────────────────────────────────────

{{#jika_dp}}
Catatan:
Sisa pembayaran sebesar Rp {{sisa_pembayaran}} akan ditagihkan setelah
proyek selesai 100%.
{{/jika_dp}}

{{#jika_pelunasan}}
Catatan:
Pembayaran DP sebelumnya :  Rp {{dp_sudah_bayar}}
Sisa Pelunasan           :  Rp {{jumlah_tagihan}}
Status setelah pelunasan :  LUNAS
{{/jika_pelunasan}}

================================================================================
METODE PEMBAYARAN
================================================================================
Silakan melakukan transfer ke rekening berikut:

Bank          : {{nama_bank}}
No. Rekening  : {{no_rekening}}
Atas Nama     : Mahin Utsman Nawawi

Mohon sertakan nomor invoice pada keterangan transfer untuk
mempermudah proses verifikasi pembayaran.

================================================================================
SYARAT & KETENTUAN
================================================================================
1. Pembayaran dilakukan paling lambat pada tanggal jatuh tempo.
2. Invoice ini sah tanpa tanda tangan basah (diterbitkan secara elektronik).
3. Jika pembayaran telah dilakukan, mohon konfirmasi via WhatsApp
   ke nomor +62 851-1777-6596 dengan melampirkan bukti transfer.
4. Pengerjaan proyek dimulai / dilanjutkan setelah pembayaran diterima
   dan dikonfirmasi.

================================================================================


Diterbitkan oleh,

Velora ID


________________________
Mahin Utsman Nawawi, S.H
Founder & CEO

================================================================================
VARIABEL DINAMIS (untuk sistem PDF generator):
- {{nomor_invoice}}     → Auto: VT/INV/YYYY/NNN
- {{jenis_invoice}}     → "UANG MUKA (DP)" | "PELUNASAN" | "PEMBAYARAN PENUH"
- {{tanggal}}           → Format: DD MMMM YYYY
- {{jatuh_tempo}}       → tanggal + 7 hari
- {{status_bayar}}      → "BELUM LUNAS" | "LUNAS"
- {{nama_client}}       → Dari tabel Lead/Project → companyName / contactName
- {{alamat_client}}     → Dari tabel Lead → address
- {{pic_client}}        → Dari tabel Lead → contactName
- {{nohp_client}}       → Dari tabel Lead → phone
- {{nama_proyek}}       → Dari tabel Project → title
- {{kategori_proyek}}   → Dari tabel Lead → category
- {{nomor_proposal}}    → Referensi proposal yang menjadi dasar invoice
- {{total_biaya}}       → Dari tabel Project → value
- {{label_pembayaran}}  → "Uang Muka (DP 50%)" | "Pelunasan (50%)" | "Pembayaran Penuh"
- {{persentase_bayar}}  → 50 (DP) | 50 (Pelunasan) | 100 (Penuh)
- {{jumlah_tagihan}}    → total_biaya * persentase
- {{sisa_pembayaran}}   → total_biaya - jumlah_tagihan
- {{dp_sudah_bayar}}    → Dari tabel Income (terkait project) → jumlah DP
- {{nama_bank}}         → Dari Settings
- {{no_rekening}}       → Dari Settings
================================================================================
