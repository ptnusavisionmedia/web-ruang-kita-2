/**
 * Foto lokal bangunan (public/photos, sumber asli di assets/photos).
 * Properti yang slug-nya terdaftar di sini memakai foto lokal; properti lain tetap memakai gambar dari database.
 */

const OWN = [
  "melati-residence",
  "kenanga-house",
  "teratai-suites",
  "anggrek-putra",
  "sakura-living",
  "bukit-hijau",
  "lotus-tower",
  "dahlia-kost",
] as const;

/** Pelengkap galeri (foto suasana umum, tanpa papan nama bisnis lain). */
const EXTRAS = ["extra-tropical-villa", "extra-brick-apartment"] as const;

export const HERO_PHOTO = "/photos/extra-tropical-villa.jpg";

const ownSet = new Set<string>(OWN);

/** Foto utama properti, atau null bila tidak ada foto lokal untuk slug tersebut. */
export function localCover(slug: string): string | null {
  return ownSet.has(slug) ? `/photos/${slug}.jpg` : null;
}

/** Galeri: foto properti sendiri + dua foto pelengkap. */
export function localGallery(slug: string): string[] | null {
  const cover = localCover(slug);
  return cover ? [cover, ...EXTRAS.map((e) => `/photos/${e}.jpg`)] : null;
}

/** Versi kecil (720 px) untuk kartu dan daftar agar halaman ringan. */
export function thumb(src: string | null | undefined): string | null | undefined {
  if (src && src.startsWith("/photos/") && !src.endsWith("-sm.jpg")) return src.replace(/\.jpg$/, "-sm.jpg");
  return src;
}
