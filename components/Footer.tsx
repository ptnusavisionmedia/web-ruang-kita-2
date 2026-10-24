import Link from "next/link";
import Logo from "./Logo";
import BackToTop from "./BackToTop";

const cols = [
  {
    title: "Jelajahi",
    links: [
      { href: "/", label: "Beranda" },
      { href: "/cara-kerja", label: "Cara kerja" },
      { href: "/properties", label: "Cari properti" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { href: "/bantuan", label: "Pusat bantuan" },
      { href: "/login", label: "Masuk / daftar" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="grain relative border-t-4 border-ink bg-brand-900 text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo light className="h-9" />
          <p className="mt-5 text-sm leading-relaxed text-white/65">
            Cari kamar, jadwalkan survei, lalu booking dan bayar. Sederhana, jelas, dan transparan.
          </p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-400">{c.title}</p>
            <ul className="mt-5 space-y-3 text-sm">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-grow text-white/75 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-400">Kontak</p>
          <p className="mt-5 text-sm text-white/75">halo@ruangkita.id</p>
          <p className="mt-2 text-sm text-white/55">Senin – Sabtu, 09.00 – 17.00 WIB</p>
        </div>
      </div>
      <p className="text-outline-light pointer-events-none select-none overflow-hidden whitespace-nowrap px-5 text-center font-display text-[17vw] leading-[0.8] md:text-[13rem]" aria-hidden>
        RuangKita
      </p>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-white/50 sm:flex-row sm:justify-between">
          <span>© 2026 RuangKita. Seluruh hak dilindungi.</span>
          <span className="flex items-center gap-4">
            <span>Versi demo — pembayaran masih simulasi.</span>
            <BackToTop />
          </span>
        </div>
      </div>
    </footer>
  );
}
