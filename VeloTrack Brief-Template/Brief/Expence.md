MENU: EXPENSE / PENGELUARAN (OWNER)

Tujuan:
- Mencatat dan memonitor seluruh pengeluaran
- Menjadi dasar penghitungan profit bersih
- Memisahkan biaya operasional dan biaya per project

Tipe User:
- Owner (full access)

Akses:
- Dari Finance Dashboard
- Dari menu Finance → Expense

==================================================

DATA YANG DITAMPILKAN (LIST):
- Tanggal pengeluaran
- Kategori biaya
- Project (opsional)
- Nominal
- Keterangan
- Tanggal input
- Aksi

--------------------------------------------------

KOMPONEN UI:
- Tabel / list pengeluaran
- Button "Tambah Pengeluaran"
- Filter section
- Pagination

--------------------------------------------------

FILTER:
- Periode (tanggal pengeluaran)
- Kategori biaya
- Project (opsional)
- Keyword (keterangan)

--------------------------------------------------

PAGINATION:
- Ada
- Server-side pagination
- Page size: 10 / 20 / 50

--------------------------------------------------

FORM TAMBAH / EDIT PENGELUARAN:
Field:
- Tanggal pengeluaran (wajib)
- Kategori biaya (wajib)
 contoh: server, domain, tools, operasional, lainnya
- Project (opsional)
- Nominal (wajib, numeric)
- Keterangan (optional)

Validasi:
- Nominal > 0
- Kategori wajib dipilih
- Tanggal valid

Rule:
- Pengeluaran boleh tidak terkait project
- Pengeluaran terkait project akan dihitung ke profit project
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
- expenseList
- selectedExpense
- isLoading
- actionLoading

--------------------------------------------------

EMPTY STATE:
- Belum ada pengeluaran → tampilkan CTA "Tambah Pengeluaran"
- Filter tidak menemukan data → tampilkan pesan informatif

--------------------------------------------------

PERFORMANCE NOTES:
- Index DB di tanggal_pengeluaran, kategori
- Pagination wajib server-side
- Jangan load data keuangan sekaligus

--------------------------------------------------

SECURITY:
- Hanya owner yang bisa akses
- Semua aksi dicatat di audit log

--------------------------------------------------

YANG TIDAK ADA DI EXPENSE:
- Grafik (ada di Finance Dashboard)
- Perhitungan profit langsung
- Bulk action massal- Pastikan fungsi CRUD (Create, Read, Update, Delete) tersedia jika relevan
