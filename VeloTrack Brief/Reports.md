MENU: REPORTS (OWNER)

Tujuan:
- Menyediakan laporan resmi & terstruktur
- Digunakan untuk evaluasi, arsip, dan pengambilan keputusan
- Sumber data rekap (bukan input)

Tipe User:
- Owner (full access)

Akses:
- Dari menu utama: Reports

==================================================

JENIS REPORT (TAB / SECTION):

1. Report Leads
2. Report Projects
3. Report Finance
4. Report Profit

--------------------------------------------------

REPORT LEADS
Data yang ditampilkan:
- Total leads
- Leads pending
- Leads deal
- Leads cancel
- Rasio deal (%)

Filter:
- Periode
- Status lead

Output:
- Tabel ringkas
- Rekap angka
- Export CSV / Excel

--------------------------------------------------

REPORT PROJECTS
Data yang ditampilkan:
- Total project
- Project aktif
- Project selesai
- Project overdue
- Rata-rata durasi project

Filter:
- Periode
- Status project
- PIC

Output:
- Tabel project
- Rekap per status
- Export CSV / Excel

--------------------------------------------------

REPORT FINANCE
Data yang ditampilkan:
- Total pemasukan
- Total pengeluaran
- Breakdown per kategori
- Breakdown per project

Filter:
- Periode
- Project
- Kategori biaya

Output:
- Tabel pemasukan
- Tabel pengeluaran
- Export CSV / Excel

--------------------------------------------------

REPORT PROFIT
Data yang ditampilkan:
- Profit total
- Profit per project
- Profit per periode

Formula:
- Profit = Pemasukan - Pengeluaran

Filter:
- Periode
- Project

Output:
- Tabel profit
- Summary angka
- Export CSV / Excel

--------------------------------------------------

FILTER GLOBAL (BERLAKU UNTUK SEMUA REPORT):
- Periode (tanggal custom range)
- Project (optional)

--------------------------------------------------

PAGINATION:
- Ada di semua tabel report
- Server-side pagination
- Page size: 20 / 50 / 100

--------------------------------------------------

STATE MANAGEMENT:
- selectedReportType
- filterState
- paginationState
- reportData
- isLoading

--------------------------------------------------

UX NOTES:
- Report fokus ke data & angka
- Tidak ada input / edit data
- Grafik tidak wajib (opsional)
- Export selalu berdasarkan filter aktif

--------------------------------------------------

SECURITY:
- Hanya owner bisa akses
- Data read-only
- Export dicatat di audit log

--------------------------------------------------

YANG TIDAK ADA DI REPORTS:
- Input data
- Edit / delete
- Real-time update- Pastikan fungsi CRUD (Create, Read, Update, Delete) tersedia jika relevan
