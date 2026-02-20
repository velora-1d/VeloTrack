MENU: PROJECTS (OWNER)

Tujuan:
- Mengelola seluruh project hasil deal
- Monitoring status, deadline, dan PIC
- Entry point ke detail project & progres

Tipe User:
- Owner (full access)

Tipe Halaman:
- List (utama)
- Detail (dibahas di menu 6)

==================================================

DATA YANG DITAMPILKAN (LIST):
- Nama project
- Nama klien
- Status project (todo / on progress / done / overdue)
- PIC
- Deadline
- Progress ringkas (opsional)
- Tanggal dibuat
- Aksi cepat

--------------------------------------------------

KOMPONEN UI:
- Tabel / list projects
- Status badge
- Search input
- Filter section
- Action button per row

--------------------------------------------------

FILTER:
- Status project (todo / on progress / done / overdue)
- Deadline:
 - hari ini
 - minggu ini
 - overdue
- PIC
- Keyword (nama project / klien)

--------------------------------------------------

PAGINATION:
- Ada
- Server-side pagination
- Page size: 10 / 20 / 50

--------------------------------------------------

AKSI PER PROJECT:
- View detail
- Update status
- Update deadline
- Assign / ganti PIC
- Tambah catatan singkat

--------------------------------------------------

RULE STATUS PROJECT:
- Todo → On Progress → Done
- Deadline lewat & belum done → otomatis Overdue
- Done → status terkunci (tidak bisa balik)

--------------------------------------------------

BULK ACTION (opsional):
- Update status massal
- Update PIC massal
- Export CSV (filtered)

--------------------------------------------------

STATE MANAGEMENT:
- filterState
- paginationState
- projectList
- selectedProject
- isLoading

--------------------------------------------------

EMPTY STATE:
- Belum ada project → tampilkan info “Project akan muncul setelah lead di-deal”
- Filter tidak menemukan data → tampilkan pesan informatif

--------------------------------------------------

PERFORMANCE NOTES:
- Index DB di status, deadline, PIC
- Jangan load log & detail di list
- Pagination wajib server-side

--------------------------------------------------

SECURITY:
- Hanya owner bisa lihat semua project
- Semua perubahan status dicatat di audit log

--------------------------------------------------

YANG TIDAK ADA DI PROJECTS LIST:
- Input keuangan
- Log aktivitas detail
- Timeline panjang- Pastikan fungsi CRUD (Create, Read, Update, Delete) tersedia jika relevan
