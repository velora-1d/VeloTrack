MENU: LEADS (OWNER)

Tujuan:
- Mengelola seluruh lead yang masuk
- Menentukan status lead (pending / deal / cancel)
- Menjadi sumber awal pembuatan project

Tipe User:
- Owner (full access)

Tipe Halaman:
- List (utama)
- Detail (dibahas di menu 4)

Data yang Ditampilkan (List):
- Nama lead
- Kontak (email / nomor)
- Sumber lead (manual / referral / dll)
- Status (pending / deal / cancel)
- Tanggal masuk
- Last update
- Aksi cepat

Komponen UI:
- Tabel / list leads
- Status badge (warna beda)
- Search input
- Filter section
- Action button per row

Filter:
- Status: pending, deal, cancel
- Tanggal masuk (range)
- Keyword: nama / kontak / sumber

Pagination:
- Ada
- Default page size: 10 / 20 / 50
- Pagination server-side

Aksi per Lead:
- View detail
- Update status:
 - pending
 - deal
 - cancel
- Convert ke project (hanya jika status = deal)
- Tambah catatan singkat

Bulk Action (opsional, tapi disiapkan):
- Update status massal
- Export CSV (filtered)

Alur Update Status:
1. Owner klik ubah status
2. Pilih status baru
3. Jika pilih "deal":
  - Sistem minta konfirmasi
  - Sistem buat project baru
  - Lead dikunci (tidak bisa diubah lagi)
4. Jika pilih "cancel":
  - Wajib isi alasan (optional text)

Validasi:
- Lead status deal tidak bisa balik ke pending
- Lead cancel tidak bisa convert ke project
- Satu lead hanya bisa punya satu project

State Management:
- filterState
- paginationState
- leadsList
- selectedLead
- isLoading

Empty State:
- Belum ada lead → tampilkan CTA "Tambah Lead"
- Filter tidak menemukan data → tampilkan pesan informatif

Performance Notes:
- Query pakai index (status, created_at)
- Pagination server-side wajib
- Jangan load semua data sekaligus

Security:
- Hanya owner bisa lihat semua lead
- Semua aksi dicatat di audit log

Audit Log:
- Status lead berubah
- Lead dikonversi ke project
- Catatan ditambahkan

Yang TIDAK ada di Leads:
- Input keuangan
- Edit project detail
- Pagination client-side- Pastikan fungsi CRUD (Create, Read, Update, Delete) tersedia jika relevan
