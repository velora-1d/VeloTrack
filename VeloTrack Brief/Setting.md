MENU: SETTINGS (OWNER)

Tujuan:
- Mengatur konfigurasi global aplikasi VeloTrack
- Mengontrol workflow, notifikasi, dan preferensi sistem
- Tidak berisi data operasional harian

Tipe User:
- Owner (full access)

Akses:
- Dari menu utama: Settings

==================================================

SECTION 1: GENERAL SETTINGS
- Nama aplikasi
- Nama brand (Velora)
- Timezone
- Format tanggal
- Mata uang (IDR)
- Logo / branding (optional)

--------------------------------------------------

SECTION 2: WORKFLOW & STATUS
- Konfigurasi status Lead:
 - pending
 - deal
 - cancel

- Konfigurasi status Project:
 - todo
 - on progress
 - done
 - overdue (auto)

Rule:
- Status default tidak bisa dihapus
- Urutan workflow dikunci

--------------------------------------------------

SECTION 3: NOTIFICATION SETTINGS
Channel:
- Email
- WhatsApp
- Telegram

Event yang bisa di-toggle:
- Lead dibuat
- Lead di-deal
- Project dibuat
- Deadline H-1
- Project overdue

Pengaturan:
- Aktif / nonaktif per channel
- Jam pengiriman notifikasi

--------------------------------------------------

SECTION 4: FINANCE SETTINGS
- Kategori pengeluaran (server, domain, tools, dll)
- Tipe pemasukan (DP, pelunasan, lainnya)
- Lock periode laporan (opsional, tahap lanjut)

--------------------------------------------------

SECTION 5: USER & ACCESS (OWNER ONLY)
Manajemen Akun Owner:
- Lihat akun owner
- Ganti password
- Session aktif
- Force logout semua session (panic button)

Manajemen Akun Mitra:
- Create akun Mitra baru (username, password)
- Read daftar akun Mitra aktif/non-aktif
- Update data Mitra (reset password, edit nama)
- Delete / Non-aktifkan akun Mitra

--------------------------------------------------

SECTION 6: AUDIT & LOGGING
- Toggle audit log:
 - perubahan status
 - input keuangan
 - export report
- Retensi log (misal 90 hari)

--------------------------------------------------

SECTION 7: INTEGRATION
- Konfigurasi API Key:
 - WhatsApp API
 - Telegram Bot Token
- Test connection
- Enable / disable integrasi

--------------------------------------------------

SECTION 8: DATA & MAINTENANCE
- Export data (manual)
- Backup trigger (manual)
- Reset cache
- Maintenance mode (on/off)

--------------------------------------------------

STATE MANAGEMENT:
- settingsData
- isSaving
- isLoading

--------------------------------------------------

UX NOTES:
- Semua perubahan pakai tombol Save
- Perubahan penting pakai konfirmasi
- Tampilkan last updated timestamp

--------------------------------------------------

SECURITY:
- Owner only
- Sensitive data di-mask
- Semua perubahan dicatat di audit log

--------------------------------------------------

YANG TIDAK ADA DI SETTINGS:
- Pagination
- Filter
- Data operasional
- Grafik- Pastikan fungsi CRUD (Create, Read, Update, Delete) tersedia jika relevan
