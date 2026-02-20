================================================================================
                         PROPOSAL PENAWARAN
                      LAYANAN PROYEK DIGITALISASI
================================================================================

                            [LOGO VELORA]

────────────────────────────────────────────────────────────────────────────────
INFORMASI DOKUMEN
────────────────────────────────────────────────────────────────────────────────
Nomor Proposal    : {{nomor_proposal}}
Tanggal           : {{tanggal}}
Berlaku Hingga    : {{tanggal_berlaku}}  (14 hari sejak tanggal proposal)

────────────────────────────────────────────────────────────────────────────────
KEPADA
────────────────────────────────────────────────────────────────────────────────
Nama / Lembaga    : {{nama_client}}
Alamat            : {{alamat_client}}
PIC / Kontak      : {{pic_client}}
No. Telepon       : {{nohp_client}}

────────────────────────────────────────────────────────────────────────────────
DARI
────────────────────────────────────────────────────────────────────────────────
Nama Usaha        : Velora ID
NIB               : 3110250097422
Alamat            : Kp. Hegarmanah, Ds. Cikoneng, Kec. Pasirjambu, Kab. Bandung
No. Kontak        : +62 851-1777-6596
Email             : velora.1d@gmail.com
Website           : velora.my.id

================================================================================
1. PENDAHULUAN
================================================================================
Dengan hormat,

Terima kasih atas kepercayaan Bapak/Ibu/Saudara kepada Velora ID.
Berdasarkan diskusi yang telah dilakukan, kami mengajukan proposal
penawaran untuk proyek digitalisasi sebagai berikut.

================================================================================
2. LINGKUP PEKERJAAN
================================================================================
Nama Proyek       : {{nama_proyek}}
Kategori          : {{kategori_proyek}}
Deskripsi         : {{deskripsi_proyek}}

Rincian fitur/modul yang termasuk dalam proyek ini:

┌─────┬────────────────────────────────────┬───────────────┐
│ No. │ Fitur / Modul                      │ Keterangan    │
├─────┼────────────────────────────────────┼───────────────┤
│  1  │ {{fitur_1}}                        │ {{ket_1}}     │
│  2  │ {{fitur_2}}                        │ {{ket_2}}     │
│  3  │ {{fitur_3}}                        │ {{ket_3}}     │
│  4  │ {{fitur_4}}                        │ {{ket_4}}     │
│  5  │ {{fitur_5}}                        │ {{ket_5}}     │
└─────┴────────────────────────────────────┴───────────────┘
(Baris ditambahkan secara dinamis sesuai jumlah fitur)

================================================================================
3. TIMELINE PENGERJAAN
================================================================================
Estimasi pengerjaan : {{durasi_proyek}} hari kerja
Tanggal mulai       : {{tanggal_mulai}} (setelah DP diterima)
Estimasi selesai    : {{tanggal_selesai}}

================================================================================
4. INVESTASI / BIAYA
================================================================================
┌─────────────────────────────────┬─────────────────────────┐
│ Komponen                        │ Biaya                   │
├─────────────────────────────────┼─────────────────────────┤
│ Total Nilai Proyek              │ Rp {{total_biaya}}      │
├─────────────────────────────────┼─────────────────────────┤
│ DP (Uang Muka) — 50%            │ Rp {{dp_amount}}        │
│ Pelunasan — 50%                 │ Rp {{pelunasan_amount}} │
└─────────────────────────────────┴─────────────────────────┘

* Harga sudah termasuk hosting 1 tahun pertama (jika berlaku)
* Harga belum termasuk domain (jika berlaku)

================================================================================
5. METODE PEMBAYARAN
================================================================================
Pembayaran dilakukan melalui transfer ke rekening:

Bank          : {{nama_bank}}
No. Rekening  : {{no_rekening}}
Atas Nama     : Mahin Utsman Nawawi

================================================================================
6. KETENTUAN TAMBAHAN
================================================================================
1. Proposal ini berlaku selama 14 hari sejak tanggal diterbitkan.
2. Revisi minor (warna, teks, gambar) diberikan maksimal 3x revisi.
3. Perubahan scope pekerjaan di luar kesepakatan dapat dikenakan
   biaya tambahan berdasarkan tingkat kompleksitas.
4. Proyek dimulai setelah DP diterima dan dikonfirmasi.
5. Source code dan hak cipta menjadi milik klien setelah pelunasan
   dilakukan secara penuh.

================================================================================
7. PENUTUP
================================================================================
Demikian proposal ini kami sampaikan. Kami sangat berharap dapat
bekerja sama dalam mewujudkan solusi digital yang optimal bagi
kebutuhan Bapak/Ibu/Saudara.

Atas perhatian dan kepercayaannya, kami ucapkan terima kasih.


Hormat kami,

Velora ID


________________________
Mahin Utsman Nawawi, S.H
Founder & CEO

================================================================================
VARIABEL DINAMIS (untuk sistem PDF generator):
- {{nomor_proposal}}     → Auto-generate: VT/PRP/YYYY/NNN
- {{tanggal}}            → Format: DD MMMM YYYY
- {{tanggal_berlaku}}    → tanggal + 14 hari
- {{nama_client}}        → Dari tabel Lead → field: companyName / contactName
- {{alamat_client}}      → Dari tabel Lead → field: address (jika ada)
- {{pic_client}}         → Dari tabel Lead → field: contactName
- {{nohp_client}}        → Dari tabel Lead → field: phone
- {{nama_proyek}}        → Dari tabel Lead/Project → field: title
- {{kategori_proyek}}    → Dari tabel Lead → field: category (jika ada)
- {{deskripsi_proyek}}   → Dari tabel Lead → field: notes / description
- {{fitur_N}}            → Input manual saat generate proposal
- {{ket_N}}              → Input manual saat generate proposal
- {{durasi_proyek}}      → Input manual
- {{tanggal_mulai}}      → Input manual / otomatis setelah DP
- {{tanggal_selesai}}    → tanggal_mulai + durasi_proyek
- {{total_biaya}}        → Dari tabel Lead/Project → field: value
- {{dp_amount}}          → total_biaya * 50%
- {{pelunasan_amount}}   → total_biaya * 50%
- {{nama_bank}}          → Dari Settings
- {{no_rekening}}        → Dari Settings
================================================================================
