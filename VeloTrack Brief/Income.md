MENU: INCOME / PEMASUKAN (OWNER)

Tujuan:
- Mencatat dan memonitor seluruh pemasukan
- Menjadi dasar perhitungan profit per project & periode

Tipe User:
- Owner (full access)

Akses:
- Dari Finance Dashboard
- Dari menu Finance → Income

==================================================

DATA YANG DITAMPILKAN (LIST):
- Tanggal transaksi
- Project
- Jenis pembayaran (DP / Pelunasan / Lainnya)
- Nominal
- Keterangan
- Tanggal input
- Aksi

--------------------------------------------------

KOMPONEN UI:
- Tabel / list pemasukan
- Button "Tambah Pemasukan"
- Filter section
- Pagination

--------------------------------------------------

FILTER:
- Periode (tanggal transaksi)
- Project
- Jenis pembayaran (DP / Pelunasan / Lainnya)
- Keyword (keterangan)

--------------------------------------------------

PAGINATION:
- Ada
- Server-side pagination
- Page size: 10 / 20 / 50

--------------------------------------------------

FORM TAMBAH / EDIT PEMASUKAN:
Field:
- Project (wajib)
- Tanggal transaksi (wajib)
- Jenis pembayaran (DP / Pelunasan / Lainnya)
- Nominal (wajib, numeric)
- Keterangan (optional)

Validasi:
- Nominal > 0
- Project wajib dipilih
- Tanggal valid

Rule:
- Semua pemasukan wajib terkait project
- Edit hanya boleh sebelum laporan dikunci (opsional tahap lanjut)

--------------------------------------------------

AKSI PER ITEM:
- View detail singkat
- Edit (jika diperbolehkan)
- Hapus (dengan konfirmasi)

--------------------------------------------------

STATE MANAGEMENT:
- filterState
- paginationState
- incomeList
- selectedIncome
- isLoading
- actionLoading

--------------------------------------------------

EMPTY STATE:
- Belum ada pemasukan → tampilkan CTA "Tambah Pemasukan"
- Filter tidak menemukan data → tampilkan pesan informatif

--------------------------------------------------

PERFORMANCE NOTES:
- Index DB di tanggal_transaksi, project_id
- Pagination wajib server-side
- Jangan load data keuangan sekaligus

--------------------------------------------------

SECURITY:
- Hanya owner yang bisa akses
- Semua aksi dicatat di audit log

--------------------------------------------------

YANG TIDAK ADA DI INCOME:
- Grafik (ada di Finance Dashboard)
- Perhitungan profit langsung
- Bulk action massal- Pastikan fungsi CRUD (Create, Read, Update, Delete) tersedia jika relevan
