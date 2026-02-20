MENU: LEAD DETAIL (OWNER)

Tujuan:
- Menjadi pusat informasi & pengambilan keputusan untuk satu lead
- Menentukan nasib lead: lanjut (deal) atau berhenti (cancel)
- Menyimpan histori & konteks lead secara rapi

Tipe User:
- Owner (full access)

Akses:
- Dari Leads List (klik satu lead)

==================================================

SECTION 1: INFORMASI LEAD (READ ONLY)
- Nama lead
- Kontak (email / nomor)
- Sumber lead
- Tanggal masuk
- Status saat ini (pending / deal / cancel)

Catatan:
- Data inti tidak diedit sembarangan
- Edit hanya via aksi terkontrol (status, catatan)

--------------------------------------------------

SECTION 2: STATUS & AKSI UTAMA
Aksi yang tersedia tergantung status:

Jika status = pending:
- Button: Ubah ke Deal
- Button: Cancel Lead

Jika status = deal:
- Status terkunci
- Link ke Project Detail (hasil convert)

Jika status = cancel:
- Status terkunci
- Tampilkan alasan cancel

Rule penting:
- Pending → Deal (boleh)
- Pending → Cancel (boleh)
- Deal → status lain (tidak boleh)
- Cancel → status lain (tidak boleh)

--------------------------------------------------

SECTION 3: CONVERT LEAD → PROJECT
(Hanya muncul saat klik "Ubah ke Deal")

Flow:
1. Owner klik "Ubah ke Deal"
2. Muncul modal konfirmasi
3. Optional input:
  - Nama project (default dari nama lead)
  - Tanggal mulai (default hari ini)
4. Submit
5. Sistem:
  - Update status lead = deal
  - Create project baru
  - Simpan relasi lead_id → project_id
6. Redirect ke Project Detail

Validasi:
- Satu lead hanya boleh punya satu project
- Jika gagal create project → status lead tidak berubah

--------------------------------------------------

SECTION 4: CATATAN INTERNAL (NOTES)
Fungsi:
- Catatan komunikasi
- Alasan follow up
- Pertimbangan sebelum deal / cancel

Fitur:
- Tambah catatan
- Lihat list catatan
- Urut berdasarkan waktu (terbaru di atas)

Catatan:
- Hanya owner yang bisa lihat & tambah
- Tidak ada edit catatan lama (audit friendly)

--------------------------------------------------

SECTION 5: HISTORY / AUDIT LOG
Menampilkan:
- Perubahan status
- Waktu perubahan
- Aksi convert ke project
- Aksi cancel lead

Tujuan:
- Transparansi
- Tracking keputusan
- Anti lupa / anti debat

--------------------------------------------------

State Management:
- leadDetail
- leadStatus
- notesList
- auditLogs
- isLoading
- actionLoading

Error Handling:
- Lead tidak ditemukan
- Gagal update status
- Gagal create project

UX Notes:
- Semua aksi penting pakai konfirmasi
- Status badge jelas & konsisten
- Aksi berbahaya (cancel) pakai warna warning
- Jangan taruh aksi besar di Leads List

Yang TIDAK ada di Lead Detail:
- Pagination
- Input keuangan
- Edit massal
- Filter global- Pastikan fungsi CRUD (Create, Read, Update, Delete) tersedia jika relevan
