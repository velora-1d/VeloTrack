MENU: PROFIT (OWNER)

Tujuan:
- Mengetahui laba bersih secara akurat
- Analisis profit per project & per periode
- Dasar evaluasi kinerja & keputusan bisnis

Tipe User:
- Owner (full access)

Akses:
- Dari menu utama: Profit
- Dari Finance Dashboard (klik summary)

==================================================

RUMUS UTAMA:
Profit = Total Pemasukan - Total Pengeluaran - Fee (jika ada)

==================================================

SECTION 1: SUMMARY PROFIT
- Profit total (periode terpilih)
- Total pemasukan
- Total pengeluaran
- Margin profit (%)

--------------------------------------------------

SECTION 2: PROFIT PER PROJECT (LIST)
Data yang ditampilkan:
- Nama project
- Total pemasukan
- Total pengeluaran
- Profit project
- Margin (%)
- Status project

Filter:
- Periode
- Project
- Status project

Pagination:
- Ada (server-side)

--------------------------------------------------

SECTION 3: PROFIT PER PERIODE
Data yang ditampilkan:
- Profit harian / mingguan / bulanan
- Tren profit (naik / turun)

Filter:
- Periode (hari / minggu / bulan / custom range)

--------------------------------------------------

SECTION 4: DETAIL PROFIT PROJECT (DRILL DOWN)
Akses:
- Klik salah satu project di list

Isi:
- Breakdown pemasukan project
- Breakdown pengeluaran project
- Profit bersih project

Catatan:
- Read-only
- Detail transaksi tidak diedit di sini

--------------------------------------------------

STATE MANAGEMENT:
- selectedPeriod
- selectedProject
- profitSummary
- profitList
- paginationState
- isLoading

--------------------------------------------------

ERROR HANDLING:
- Data kosong → tampilkan state informatif
- Error query → tampilkan retry

--------------------------------------------------

UX NOTES:
- Angka profit pakai warna kontekstual (plus/minus)
- Fokus ke angka & perbandingan
- Jangan campur input keuangan di halaman ini

--------------------------------------------------

SECURITY:
- Hanya owner bisa akses
- Semua data read-only
- Audit log untuk akses & export

--------------------------------------------------

YANG TIDAK ADA DI PROFIT:
- Input pemasukan
- Input pengeluaran
- Edit data
- Bulk action- Pastikan fungsi CRUD (Create, Read, Update, Delete) tersedia jika relevan
