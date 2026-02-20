# Role & Hak Akses – VeloTrack

Dokumen ini mendefinisikan hak akses setiap role di aplikasi VeloTrack.
Dokumen ini bersifat FINAL dan menjadi single source of truth
untuk implementasi permission di frontend, backend, dan database (RLS).

---

## ROLE: OWNER (Full Access)

Owner memiliki kontrol penuh terhadap seluruh data dan fitur aplikasi.

### Menu & Hak Akses OWNER

#### 1. Dashboard
- Read summary data
- Read grafik & statistik
(CRUD tidak berlaku, hanya agregasi)

#### 2. Leads
- Create lead
- Read semua lead
- Update lead
- Delete lead
- Update status (pending / deal / cancel)
- Convert lead → project

#### 3. Lead Detail
- Read detail lead
- Create catatan internal
- Update status lead
- Delete lead (jika diperlukan)

#### 4. Projects
- Create project (hasil deal)
- Read semua project
- Update project (status, PIC, deadline)
- Delete project

#### 5. Project Detail
- Read detail project
- Update status & deadline
- Create catatan internal
- Read activity log

#### 6. Dashboard Keuangan (digabung ke Dashboard utama)
- Read summary pemasukan
- Read summary pengeluaran
- Read profit

#### 7. Income (Pemasukan)
- Create pemasukan
- Read semua pemasukan
- Update pemasukan
- Delete pemasukan

#### 8. Expense (Pengeluaran)
- Create pengeluaran
- Read semua pengeluaran
- Update pengeluaran
- Delete pengeluaran

#### 9. Reports
- Read semua laporan
- Export laporan (CSV / Excel)

#### 10. Profit
- Read profit total
- Read profit per project
- Read profit per periode

#### 11. Settings
- Update konfigurasi aplikasi
- Update workflow status
- Update notifikasi
- Update integrasi
- Manage akun owner

---

## ROLE: MITRA (Read Only – Data Milik Sendiri)

Mitra hanya dapat melihat data yang berkaitan dengan dirinya sendiri.
Tidak memiliki hak CRUD terhadap data inti sistem.

### Menu & Hak Akses MITRA

#### 1. Dashboard (Mitra)
- Read ringkasan lead miliknya (yang diinput oleh Owner)
- Read ringkasan project hasil deal miliknya

#### 2. Leads
- Read lead miliknya (yang diinput oleh Owner)
- Tidak bisa create / update / delete
- Tidak bisa ubah status

#### 3. Lead Detail
- Read detail lead miliknya
- Read status & history
- Tidak bisa edit atau menambah catatan

#### 4. Projects
- Read project hasil deal dari lead miliknya
- Read status & deadline

#### 5. Project Detail
- Read detail project
- Read timeline & activity
- Tidak bisa edit data apa pun

---

## Menu yang TIDAK Bisa Diakses MITRA
- Income (Pemasukan)
- Expense (Pengeluaran)
- Reports
- Profit
- Settings

---

## Prinsip Keamanan Data

- Semua data MITRA difilter berdasarkan `mitra_id`
- Enforcement dilakukan di backend (Row Level Security)
- Frontend hanya menampilkan data yang sudah lolos filter
- MITRA tidak pernah melihat data global
- **Semua penambahan data Lead baru selalu dilakukan secara manual oleh Owner.**

---

## Catatan Penting

- Owner = FULL CRUD & Manajemen Akun Mitra
- Mitra = READ ONLY (Data Sendiri)
- Tidak ada role lain selain Owner dan Mitra
- Perubahan pada dokumen ini harus eksplisit dan terdokumentasi

Dokumen ini bersifat FINAL.