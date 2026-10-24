# RuangKita

Platform pencarian dan booking kos, apartemen, dan rumah. Dibangun dengan Next.js (App Router), TypeScript, Tailwind CSS, dan SQLite (libSQL). Login memakai username + kata sandi biasa.

## Halaman

| Rute | Isi |
| --- | --- |
| `/` | Beranda: hero, pencarian, statistik nyata, properti terbaru, ringkasan |
| `/cara-kerja` | Langkah lengkap, persiapan survei, rincian biaya |
| `/properties` | Katalog (Cari Properti) dengan filter dan pengurutan |
| `/bantuan` | Pusat bantuan: pencarian, kategori, kontak |
| `/properties/[slug]`, `/booking`, `/payment`, `/dashboard`, `/login` | Alur pengguna |

## Ikon kustom

Set ikon sendiri (34 ikon, hijau logo `#104437` + aksen emas `#D2A34F`) ada di `assets/icons/*.svg`
(pratinjau: `assets/icons/_preview.png`). Ikon dipakai sebagai komponen React dari `components/icons`.

```bash
npm run icons   # membuat ulang components/icons/index.tsx dari assets/icons/*.svg
```

Menambah ikon: simpan SVG baru (viewBox 32, garis `#104437`, aksen `#D2A34F`) di `assets/icons`, jalankan `npm run icons`,
lalu pakai `<IconNamaFile size={24} className="text-brand-700" />`.

## Struktur

```
app/                 routing (halaman) dan app/actions/ (Server Actions)
components/          komponen UI
lib/db.ts            koneksi SQLite (libSQL), skema, dan data awal (dibuat otomatis)
lib/auth.ts          daftar/masuk/keluar, hash kata sandi (scrypt), sesi di tabel `sessions`
lib/data.ts          semua query baca (server only)
lib/validation.ts    skema Zod
lib/static-data.ts   data properti awal yang di-seed ke database
netlify.toml         konfigurasi build Netlify
```

## Database SQLite

Tabel: `users`, `sessions`, `properties`, `rooms`, `facilities`, `property_facilities`, `bookings`, `payments`, `saved_properties`
(+ view `property_listings`). Skema dan 8 properti contoh dibuat **otomatis** saat aplikasi pertama kali dipakai; tidak ada migrasi manual.

| Lingkungan | `DATABASE_URL` | Keterangan |
| --- | --- | --- |
| Lokal | kosong | berkas `./data/ruangkita.db` (di-ignore Git) |
| Netlify / Vercel | `libsql://...` | **wajib** — filesystem hosting serverless sementara, berkas SQLite tidak akan bertahan |

Untuk Netlify pakai [Turso](https://turso.tech) (SQLite terkelola, ada paket gratis):

```bash
turso db create ruangkita
turso db show ruangkita --url        # -> DATABASE_URL
turso db tokens create ruangkita     # -> DATABASE_AUTH_TOKEN
```

## Login

- Daftar cukup dengan **username** (3–20 karakter: huruf, angka, titik, garis bawah) dan **kata sandi** (min. 6 karakter). Tanpa email.
- Kata sandi di-hash dengan scrypt + salt. Sesi berupa token acak di cookie `httpOnly` (hanya hash-nya yang disimpan di database), berlaku 30 hari.
- 5 kali salah kata sandi mengunci akun itu 10 menit. Belum ada fitur lupa kata sandi (tidak ada email untuk verifikasi).

## Deploy ke Netlify

Aplikasi memakai Server Components, Server Actions, dan cookie sesi, jadi **tidak boleh** di-export statis. Netlify Next.js Runtime menjalankannya otomatis.

1. Push project ke GitHub (`.env*` kecuali `.env.example` dan `data/` sudah di-ignore).
2. Buat database Turso (lihat atas).
3. Di Netlify: **Add new site → Import an existing project**. Pengaturan dibaca dari `netlify.toml` (build `npm run build`, publish `.next`).
4. Di **Site configuration → Environment variables** isi `DATABASE_URL` dan `DATABASE_AUTH_TOKEN` (scope Builds + Runtime), lalu **Deploy**.

## Deploy ke Vercel

1. Push ke GitHub, lalu di Vercel: **Add New → Project** dan pilih repositori. Framework Next.js terdeteksi otomatis, tanpa konfigurasi tambahan.
2. Di **Settings → Environment Variables** isi `DATABASE_URL` dan `DATABASE_AUTH_TOKEN` (Turso, lihat atas) untuk Production dan Preview.
3. **Deploy**. Jangan menaruh token database dengan awalan `NEXT_PUBLIC_`.

Keamanan bawaan: hash scrypt, sesi `httpOnly` + `secure` + `sameSite=lax`, query terparameter (anti SQL injection), pengecekan kepemilikan data di setiap action, kunci akun setelah 5 kali gagal, dan header keamanan (HSTS, nosniff, anti-iframe).

### Menjalankan secara lokal

```bash
npm install
npm run dev                  # http://localhost:3000
npm run lint && npx tsc --noEmit && npm run build
```

## Alur booking dan pembayaran

- Booking dan dashboard mewajibkan login. `user_id` selalu diambil dari session, bukan dari form.
- Anti double booking: kamar dicek tersedia, dan index unik SQLite mencegah satu slot survei dipakai dua booking aktif serta dua booking aktif oleh user yang sama pada satu kamar.
- Nominal pembayaran dihitung ulang di server dari data kamar.
- **Pembayaran masih simulasi** (belum ada payment gateway). E-wallet langsung dianggap lunas dan tombol "tandai lunas" hanya untuk demo; hapus `simulatePaid` saat memakai gateway dan ubah status `paid` lewat webhook gateway.

## Catatan

- Foto bangunan ada di `assets/photos` (sumber) dan `public/photos` (versi web). Sumber dan lisensi: `assets/photos/CREDITS.md`.
- Font disimpan lokal di `app/fonts` (Instrument Sans dan DM Serif Display, lisensi SIL OFL), sehingga build tidak butuh koneksi ke Google Fonts.
- Logo ada di `public/ruangkita-logo.png` (dan `public/ruangkita-logo-white.png` untuk latar gelap); file sumber: `assets/ruangkita-logo.png`.
- Tipe baris tabel ada di `types/database.ts`. Folder `supabase/` adalah sisa skema Postgres lama dan tidak dipakai lagi.
