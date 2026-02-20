MENU: PROJECT DETAIL (OWNER)

Tujuan:
- Menjadi pusat kontrol 1 project
- Monitoring progres, deadline, aktivitas, dan catatan
- Dasar pengambilan keputusan operasional & keuangan

Tipe User:
- Owner (full access)

Akses:
- Dari Projects List
- Dari Lead Detail (setelah convert deal)

==================================================

SECTION 1: INFORMASI UTAMA PROJECT
- Nama project
- Nama klien
- Status project (todo / on progress / done / overdue)
- PIC
- Deadline
- Tanggal mulai
- Tanggal dibuat

Aksi cepat:
- Update status
- Update deadline
- Ganti PIC

Rule:
- Status done → terkunci
- Overdue otomatis jika deadline lewat & belum done

--------------------------------------------------

SECTION 2: PROGRESS / TIMELINE
Fungsi:
- Melihat perkembangan project secara kronologis

Isi:
- Status change (todo → on progress → done)
- Update progress manual (opsional %)
- Timestamp tiap perubahan

Catatan:
- Progress tidak harus % kalau mau simpel
- Status-based timeline sudah cukup untuk MVP

--------------------------------------------------

SECTION 3: ACTIVITY LOG (AUDIT)
Fungsi:
- Mencatat semua aktivitas penting

Yang dicatat:
- Perubahan status
- Perubahan deadline
- Ganti PIC
- Catatan ditambahkan

Filter:
- Tanggal
- Jenis aktivitas

Pagination:
- Ada (khusus log aktivitas)

--------------------------------------------------

SECTION 4: CATATAN INTERNAL
Fungsi:
- Menyimpan konteks internal
- Catatan meeting, keputusan, follow up

Fitur:
- Tambah catatan
- List catatan (terbaru di atas)

Rule:
- Catatan tidak bisa diedit / dihapus (audit friendly)

--------------------------------------------------

SECTION 5: RELASI KE LEAD
- Tampilkan info lead asal project
- Status lead (deal)
- Tanggal convert

Tujuan:
- Jejak asal-usul project jelas

--------------------------------------------------

SECTION 6: RINGKASAN KEUANGAN PROJECT
(Read only di tahap ini)

Ditampilkan:
- Total pemasukan project
- Total pengeluaran project
- Profit sementara

Catatan:
- Detail input ada di menu Finance
- Di sini hanya summary

--------------------------------------------------

STATE MANAGEMENT:
- projectDetail
- activityLogs
- notes
- isLoading
- actionLoading

--------------------------------------------------

ERROR HANDLING:
- Project tidak ditemukan
- Gagal update status / deadline / PIC
- Gagal load log

--------------------------------------------------

UX NOTES:
- Section jelas & terpisah
- Aksi berbahaya pakai konfirmasi
- Jangan overload satu layar
- Fokus ke monitoring, bukan input

--------------------------------------------------

YANG TIDAK ADA DI PROJECT DETAIL:
- Input pemasukan / pengeluaran
- Pagination global
- Bulk action
- Filter global- Pastikan fungsi CRUD (Create, Read, Update, Delete) tersedia jika relevan
