MENU: FINANCE DASHBOARD (OWNER)

Tujuan:
- Memberi gambaran cepat kondisi keuangan keseluruhan
- Menjadi pintu masuk ke menu Income, Expense, dan Profit

Tipe User:
- Owner (full access)

Akses:
- Dari menu utama: Finance Dashboard

==================================================

SECTION 1: SUMMARY KEUANGAN (CARD)
- Total Pemasukan
- Total Pengeluaran
- Total Fee (ringkasan)
- Profit Bersih

Catatan:
- Angka agregat
- Format rupiah
- Klik card → redirect ke menu terkait

--------------------------------------------------

SECTION 2: GRAFIK UTAMA
1. Bar Chart
  - Pemasukan vs Pengeluaran per periode

2. Line Chart
  - Tren pemasukan per periode
  - Tren pengeluaran per periode

3. Donut / Pie Chart
  - Komposisi pengeluaran per kategori

--------------------------------------------------

SECTION 3: RINGKASAN PER PROJECT
- Top project berdasarkan pemasukan
- Project dengan biaya tertinggi
- Project dengan profit tertinggi

Tujuan:
- Bantu prioritas & evaluasi cepat

--------------------------------------------------

FILTER:
- Periode (hari / minggu / bulan / custom range)
- Project (optional, default: all)

--------------------------------------------------

INTERAKSI:
- Ganti filter → semua chart & summary update
- Klik grafik / card → ke halaman list detail (Income / Expense / Profit)

--------------------------------------------------

DATA SOURCE:
- Aggregation query (SUM, GROUP BY)
- Tidak load transaksi detail
- Fokus performa

--------------------------------------------------

STATE MANAGEMENT:
- selectedPeriod
- selectedProject
- financeSummary
- chartData
- isLoading

--------------------------------------------------

ERROR HANDLING:
- Data kosong → tampilkan state informatif
- Error API → tampilkan retry

--------------------------------------------------

UX NOTES:
- Jangan tampilkan tabel panjang
- Visual jelas & ringkas
- Satu layar cukup untuk overview

--------------------------------------------------

YANG TIDAK ADA DI FINANCE DASHBOARD:
- Input transaksi
- Pagination
- Edit data
- Detail transaksi- Pastikan fungsi CRUD (Create, Read, Update, Delete) tersedia jika relevan
NOTE : SUDAH DIGABUNG DENGAN DASHBOARD UTAMA JADI WAJIB DI SKIP !