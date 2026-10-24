# RuangKita

Platform pencarian dan booking kos, apartemen, dan rumah. Dibangun dengan Next.js (App Router), TypeScript, Tailwind CSS, tanpa database dan tanpa login.

## Halaman

| Rute | Isi |
| --- | --- |
| `/` | Beranda: hero, pencarian, statistik, properti terbaru, ringkasan |
| `/cara-kerja` | Langkah lengkap, persiapan survei, rincian biaya |
| `/properties` | Katalog (Cari Properti) dengan filter dan pengurutan |
| `/properties/[slug]` | Detail properti: galeri, kamar, fasilitas, aturan |
| `/bantuan` | Pusat bantuan: pencarian, kategori, kontak |

Fitur akun (login, booking, pembayaran, dashboard, simpan properti) dan database sudah dihapus. Data properti ada di
`lib/static-data.ts`; ubah file itu untuk menambah atau mengedit properti.

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
app/                 routing (halaman) dan app/actions/properties.ts (pencarian katalog)
components/          komponen UI
lib/data.ts          pencarian dan pembacaan properti dari data statis
lib/static-data.ts   data properti dan fasilitas
netlify.toml         konfigurasi build Netlify
```

## Deploy

Tidak perlu environment variable atau database.

- **Vercel:** Add New → Project, pilih repositori, Deploy. Next.js terdeteksi otomatis.
- **Netlify:** Add new site → Import an existing project. Pengaturan dibaca dari `netlify.toml` (build `npm run build`, publish `.next`).

## Menjalankan secara lokal

```bash
npm install
npm run dev                  # http://localhost:3000
npm run lint && npx tsc --noEmit && npm run build
```

## Catatan

- Foto bangunan ada di `assets/photos` (sumber) dan `public/photos` (versi web). Sumber dan lisensi: `assets/photos/CREDITS.md`.
- Font disimpan lokal di `app/fonts` (Instrument Sans dan DM Serif Display, lisensi SIL OFL), sehingga build tidak butuh koneksi ke Google Fonts.
- Logo ada di `public/ruangkita-logo.png` (dan `public/ruangkita-logo-white.png` untuk latar gelap); file sumber: `assets/ruangkita-logo.png`.
- Folder `supabase/` adalah sisa skema Postgres lama dan tidak dipakai lagi.
