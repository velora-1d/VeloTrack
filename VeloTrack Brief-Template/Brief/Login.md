MENU: LOGIN (OWNER)

Tujuan:
- Autentikasi owner Velora untuk mengakses sistem VeloTrack
- Entry point semua akses sistem

Tipe User:
- Owner (single role untuk tahap ini)

Komponen UI:
- Input Email
- Input Password
- Button Login
- Link "Lupa Password"
- Loading state
- Error message (inline)

Alur Login:
1. User membuka halaman login
2. User mengisi email dan password
3. User klik tombol Login
4. Sistem validasi input (required, format email)
5. Sistem kirim request ke Auth (Supabase Auth)
6. Jika berhasil:
  - Simpan session/token
  - Redirect ke Dashboard
7. Jika gagal:
  - Tampilkan pesan error yang jelas

Validasi:
- Email wajib diisi
- Password wajib diisi
- Format email valid
- Tidak boleh submit kalau field kosong

Error Handling:
- Email/password salah
- Akun tidak ditemukan
- Akun nonaktif
- Error koneksi

Keamanan:
- Password tidak pernah disimpan di frontend
- Auth via Supabase Auth
- Session berbasis JWT
- Auto logout jika token expired

State Management:
- isLoading (true/false)
- errorMessage (string/null)
- userSession (object)

Redirect Rules:
- Sudah login → tidak bisa akses halaman login
- Belum login → tidak bisa akses halaman lain

UX Notes:
- Button disabled saat loading
- Error message human-readable
- Fokus ke input pertama saat halaman load

Audit Log (optional):
- Log waktu login
- Log IP (kalau tersedia)

Yang TIDAK ada di Login:
- Filter
- Pagination
- Role switching
- Data lain- Pastikan fungsi CRUD (Create, Read, Update, Delete) tersedia jika relevan
