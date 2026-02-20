MENU: DASHBOARD (OWNER)

Tujuan:
- Memberi gambaran cepat kondisi bisnis & operasional VeloTrack
- Membantu owner ambil keputusan tanpa buka menu detail

Tipe User:
- Owner (full access)

Data Utama yang Ditampilkan (Summary Cards):
- Total Leads
- Leads Pending
- Leads Deal
- Leads Cancel
- Total Projects Aktif
- Project Overdue
- Total Pemasukan
- Total Pengeluaran
- Profit Bersih
- Total Mitra

Komponen UI:
- Summary cards (angka besar + label)
- Grafik (charts)
- Section deadline terdekat
- Quick navigation ke menu detail

Filter Dashboard:
- Periode: hari / minggu / bulan / custom range
- Project (optional, default: all)

Grafik / Chart (WAJIB ADA):
1. Line Chart
  - Leads masuk per periode
  - Projects aktif per periode

2. Bar Chart
  - Pemasukan vs Pengeluaran per periode

3. Pie / Donut Chart
  - Distribusi status project (aktif / selesai / overdue)
  - Distribusi status lead (pending / deal / cancel)

Deadline Terdekat Section:
- List project dengan deadline terdekat
- Info yang ditampilkan:
 - Nama project
 - Status
 - Sisa hari
- Klik item → ke Project Detail

Interaksi:
- Ubah filter periode → semua card & chart auto update
- Klik summary card → redirect ke halaman list terkait
 - contoh: klik "Leads Deal" → ke halaman Leads (status=deal)

Data Source:
- Aggregation query (COUNT, SUM)
- Tidak load data mentah
- Fokus ke performa

Pagination:
- Tidak ada (dashboard hanya summary)

Error Handling:
- Data kosong → tampilkan state kosong (bukan error)
- Error API → tampilkan pesan ringan + retry

State Management:
- selectedPeriod
- selectedProject
- dashboardSummary
- chartData
- isLoading

Performance Notes:
- Semua query agregasi
- Parallel fetch untuk chart & summary
- Cache data per periode (optional)

Security:
- Hanya owner yang bisa akses
- Data global (tidak di-filter user)

UX Notes:
- Loading skeleton untuk cards & chart
- Angka pakai format rupiah
- Jangan overload satu layar
- Fokus: cepat dibaca < 5 detik

Yang TIDAK ada di Dashboard:
- Form input data
- Pagination
- Edit data
- Table panjang- Pastikan fungsi CRUD (Create, Read, Update, Delete) tersedia jika relevan
