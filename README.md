# VeloTrack

**VeloTrack** adalah Sistem Manajemen Operasional Cerdas yang dirancang khusus untuk memantau performa bisnis, mengelola proyek, dan meningkatkan efisiensi operasional secara terpusat. Aplikasi ini menggunakan arsitektur *Monorepo* modern dengan teknologi *Serverless*.

## 🚀 Fitur Utama
Sistem Manajemen ini dibangun untuk memfasilitasi dua peran utama: **Owner** (Administrator) dan **Mitra** (Tenaga Kerja / Partner).
- **Dashboard Eksekutif**: Ringkasan performa finansial, analitik *Leads*, dan status *Projects* secara metrik waktu nyata.
- **Manajemen Leads (CRM)**: Pemantauan prospek klien mulai dari status *Pending* hingga *Deal* atau *Cancel*. Terintegrasi dengan satu kali klik (One-click convert) menjadi *Project*.
- **Manajemen Proyek**: Pelacakan batas waktu (deadlines), penugasan sumber daya (PIC), dan riwayat aktivitas berkesinambungan.
- **Manajemen Keuangan Tersentralisasi**: Memisahkan entri Pemasukan dan Pengeluaran, yang kemudian dikalkulasi secara otomatis menjadi ringkasan Profit berbasis persentase KPI.
- **Kontrol Hak Akses Ketat (RBAC)**: Pemisahan tegas ruang kerja *Owner* yang transparan secara global dan *Mitra* yang hanya memiliki pandangan (*View*) pada tugas spesifik miliknya. Pengamanan disokong penuh oleh *Row Level Security (RLS)*.


## 🛠 Teknologi Utama
Proyek ini memakai monorepo (meski saat ini baru aktif satu environment `web`) dan dibangun dengan perangkat sebagai berikut:
- **Framework Web**: [Next.js](https://nextjs.org/) (App Router, Server Actions, React 19)
- **Desain UI/UX**: [Tailwind CSS v4](https://tailwindcss.com/), Framer Motion, [Lucide Icons](https://lucide.dev/), dan komponen-komponen UI [shadcn/ui](https://ui.shadcn.com/)
- **Database Backend**: [Supabase](https://supabase.com/) (PostgreSQL cloud, Auth, RTC)
- **Lapisan Data (ORM)**: [Prisma](https://www.prisma.io/)
- **Styling Paradigm**: Glassmorphism, UI *Mega Slide-Over* Panel (minimalis dan non-refreshable routing)

## 🗄 Pembagian Hak Akses
| Menu / Fitur | Owner (Admin) | Mitra (Anggota) |
| --- | --- | --- |
| Dashboard | Seluruh agregasi dan ringkasan | Tampilan terbatas |
| Leads | CRUD Penuh | Lihat *Lead* tugasan (Read-Only) |
| Projects | CRUD Penuh | Lihat *Project* tugasan (Read-Only) |
| Transaksi (Cashflow)| CRUD Penuh | ❌ Ditolak |
| Pengaturan Sistem | CRUD Penuh | ❌ Ditolak |

## 🏗 Struktur Repositori (Monorepo)
```text
/VeloTrack
├── VeloTrack Brief/      -> [Single Source of Truth] Rujukan spesifikasi proyek
├── apps/
│   └── web/              -> Next.js Web Application
│       ├── src/app       -> Next.js App Router Pages
│       ├── src/components-> Komponen UI Reusable
│       └── src/lib       -> Definisi Action Server & Prisma Core
└── packages/
    └── database/         -> Prisma Schema (schema.prisma)
```

## ⚙️ Persiapan & Instalasi
1. Kloning repository ini:
   ```bash
   git clone https://github.com/velora-1d/VeloTrack.git
   cd VeloTrack/apps/web
   ```
2. Salin variabel lingkungan *environment*: 
   Buat file `.env.local`  dengan struktur:
   ```env
   # Database (Prisma)
   DATABASE_URL="postgresql://[user]:[password]@[host]/[dbname]?pgbouncer=true"
   DIRECT_URL="postgresql://[user]:[password]@[host]/[dbname]"

   # Supabase Auth Serverless JWT
   NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-ID].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_ANON_KEY]"
   ```
3. Unduh *dependencies*:
   ```bash
   npm install
   ```
4. Tarik skema prisma terbaru dari database:
   ```bash
   npx prisma generate
   ```
5. Mulai server *development*:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` dengan pembungkus *browser* Anda.

---
VeloTrack adalah pilar manajemen cerdas untuk masa purna-optimal. Dikembangkan untuk skalabilitas dan jaminan retensi kendali mutu produk-produk Velora. 🛡️
