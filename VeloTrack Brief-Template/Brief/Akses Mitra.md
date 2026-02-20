AKSES MENU: MITRA (VeloTrack)

ROLE
- Mitra (akses terbatas, data milik sendiri)

PRINSIP AKSES
- Mitra hanya bisa lihat data yang DIA bawa
- Tidak bisa lihat data owner / mitra lain
- Tidak bisa ubah status final (deal / cancel)

MENU YANG BISA DIAKSES

1. Login
- Login mitra

2. Dashboard (Mitra)
- Ringkasan lead milik sendiri
 - total lead
 - pending
 - deal
- Ringkasan project dari lead dia
- Tidak ada data global

3. Leads (Mitra)
- List lead miliknya (yang diinput oleh Owner)
- Status lead:
 - pending
 - deal (read-only)
 - cancel (read-only)
- Tidak bisa convert lead ke project
- Tidak bisa ubah status jadi deal/cancel

Filter:
- Status
- Tanggal
Pagination

4. Lead Detail (Mitra)
- Lihat detail lead milik sendiri
- Lihat status & history
- Lihat catatan (read-only)
- Tidak ada aksi keputusan

5. Projects (Mitra)
- List project hasil deal dari lead dia
- Lihat status project
- Lihat deadline
- Tidak bisa edit project

Filter:
- Status project
- Deadline
Pagination

6. Project Detail (Mitra)
- Lihat info project
- Lihat status & timeline
- Lihat progress
- Tidak bisa edit
- Tidak bisa input keuangan

MENU YANG TIDAK BISA DIAKSES MITRA
- Finance Dashboard
- Income
- Expense
- Profit
- Reports
- Settings

AKSES KEUANGAN MITRA
- Tidak lihat pemasukan global
- Tidak lihat pengeluaran
- Fee mitra (nanti) hanya read-only

KEAMANAN DATA
- Data difilter by mitra_id
- Enforced di backend (RLS)
- Frontend hanya tampilan

STATUS
- Akses mitra: FIX & DIKUNCI- Pastikan fungsi CRUD (Create, Read, Update, Delete) tersedia jika relevan
