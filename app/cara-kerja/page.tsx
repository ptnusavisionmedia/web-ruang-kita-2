import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import DoorArch from "@/components/DoorArch";
import IconTile from "@/components/IconTile";
import Reveal from "@/components/Reveal";
import { ScrollLine } from "@/components/motion";
import SectionLabel from "@/components/SectionLabel";
import { IconCalendar, IconClipboard, IconClock, IconDoor, IconIdCard, IconPhone, IconSearch, IconWallet } from "@/components/icons";
import { BOOKING_FEE } from "@/lib/constants";
import { btnGold, btnOutline } from "@/lib/ui";
import { formatRupiah } from "@/lib/utils";

export const metadata = {
  title: "Cara Kerja — RuangKita",
  description: "Dari mencari kamar sampai mendapat kunci: tiga langkah yang jelas dan tanpa biaya tersembunyi.",
};

const steps = [
  {
    n: "01",
    icon: IconSearch,
    title: "Cari kamar yang cocok",
    text: "Mulai dari katalog. Saring berdasarkan kota, tipe, rentang harga, fasilitas, dan status kamar sampai tersisa pilihan yang masuk akal untuk Anda.",
    points: ["Harga per bulan tampil jelas di setiap listing", "Lihat foto, fasilitas, dan peraturan sebelum memutuskan", "Simpan properti favorit untuk dibandingkan nanti"],
    href: "/properties",
    cta: "Buka katalog",
  },
  {
    n: "02",
    icon: IconCalendar,
    title: "Jadwalkan survei",
    text: "Pilih kamar, tanggal, dan jam. Isi nama, WhatsApp, dan email, lalu konfirmasi. Slot yang sudah diambil orang lain tidak bisa dipilih ganda.",
    points: ["Gratis dan tanpa komitmen", "Bisa dibatalkan dari dashboard selama masih menunggu konfirmasi", "Kode booking dikirim sebagai tanda masuk"],
    href: "/properties",
    cta: "Pilih properti",
  },
  {
    n: "03",
    icon: IconWallet,
    title: "Booking dan bayar",
    text: "Puas setelah survei? Amankan kamar dengan biaya booking atau DP sewa satu bulan. Semua tagihan dan riwayatnya tercatat di dashboard.",
    points: ["Transfer bank, e-wallet, atau virtual account", "Nominal dihitung otomatis dari harga kamar", "Status pembayaran bisa dipantau kapan saja"],
    href: "/bantuan",
    cta: "Hubungi pengelola",
  },
];

const prepare = [
  { icon: IconIdCard, title: "Identitas diri", text: "Siapkan KTP atau kartu identitas untuk verifikasi saat check-in." },
  { icon: IconPhone, title: "WhatsApp aktif", text: "Konfirmasi jadwal dan informasi lokasi dikirim ke nomor ini." },
  { icon: IconClock, title: "Waktu survei", text: "Sisihkan sekitar 30 menit untuk melihat kamar dan area sekitarnya." },
];

const fees = [
  { label: "Menjadwalkan survei", value: "Gratis", note: "Tanpa komitmen" },
  { label: "Biaya booking", value: formatRupiah(BOOKING_FEE), note: "Mengamankan kamar 7 hari, dihitung sebagai bagian dari sewa" },
  { label: "DP sewa (1 bulan)", value: "Sesuai harga kamar", note: "Pembayaran sewa bulan pertama untuk mengunci kamar" },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* HEADER */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <nav className="text-sm text-muted" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-700">Beranda</Link>
            <span className="mx-2 text-ink/30">/</span>
            <span className="text-ink">Cara kerja</span>
          </nav>
          <div className="mt-8 grid grid-cols-[minmax(0,1fr)] items-end gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <h1 className="font-display text-5xl leading-[1] tracking-tight text-ink md:text-7xl">Dari mencari sampai mendapat kunci.</h1>
            <p className="max-w-md text-lg leading-relaxed text-muted">
              Tiga langkah yang dibuat pendek dan jelas, supaya Anda bisa fokus memilih tempat yang benar-benar cocok.
            </p>
          </div>
        </div>
      </section>

      {/* LANGKAH */}
      <section className="relative mx-auto max-w-6xl px-5">
        <ScrollLine className="absolute bottom-0 top-0 hidden w-0.5 bg-line md:left-[calc(1.25rem+122px)] md:block" />
        <ol>
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={0.05}>
              <li className="group grid gap-8 border-b border-line py-14 md:grid-cols-[140px_minmax(0,1fr)_minmax(0,0.8fr)] md:gap-12 md:py-20">
                <span className="tnum font-display text-7xl leading-none text-brand-700/15 transition-colors duration-500 group-hover:text-accent-500/60 md:text-8xl" aria-hidden>{s.n}</span>
                <div>
                  <span className="inline-block transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:-rotate-3"><IconTile icon={s.icon} size="lg" /></span>
                  <h2 className="mt-6 font-display text-3xl tracking-tight text-ink md:text-4xl">
                    <span className="sr-only">Langkah {i + 1}: </span>
                    {s.title}
                  </h2>
                  <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">{s.text}</p>
                  <Link href={s.href} className="group mt-6 inline-flex items-center gap-2 border-b-2 border-accent-500 pb-1 text-sm font-semibold text-brand-800">
                    {s.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
                <ul className="space-y-4 self-center rounded-md border-2 border-ink bg-white p-7 transition-all duration-500 group-hover:-translate-y-1 group-hover:border-brand-700/40">
                  <li className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Yang terjadi di langkah ini</li>
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-3 text-ink/85">
                      <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* PERSIAPAN */}
      <section className="bg-paper-2">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <SectionLabel index="A">Sebelum survei</SectionLabel>
          <h2 className="mt-4 max-w-xl font-display text-4xl tracking-tight text-ink md:text-5xl">Yang perlu Anda siapkan.</h2>
          <div className="mt-12 grid gap-0 divide-y-2 divide-ink overflow-hidden rounded-md border-2 border-ink shadow-brut md:grid-cols-3 md:divide-x-2 md:divide-y-0">
            {prepare.map((p) => (
              <div key={p.title} className="group bg-paper-2 p-8 transition-colors duration-500 hover:bg-white">
                <span className="inline-block transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:rotate-3"><IconTile icon={p.icon} /></span>
                <h3 className="mt-6 text-lg font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BIAYA */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <SectionLabel index="B">Biaya</SectionLabel>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-ink md:text-5xl">Semua biaya, di depan.</h2>
            <p className="mt-4 max-w-sm text-muted">Tidak ada biaya yang disembunyikan. Anda membayar hanya setelah memutuskan.</p>
            <div className="mt-8 flex items-center gap-3 text-sm text-muted">
              <IconClipboard size={22} className="text-brand-700" /> Semua tagihan tercatat di dashboard.
            </div>
          </div>
          <dl className="divide-y-2 divide-ink border-y-2 border-ink">
            {fees.map((f) => (
              <div key={f.label} className="grid gap-1 py-6 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8">
                <div>
                  <dt className="text-lg font-semibold text-ink">{f.label}</dt>
                  <p className="mt-1 text-sm text-muted">{f.note}</p>
                </div>
                <dd className="tnum font-display text-2xl text-brand-700">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="grain relative overflow-hidden rounded-md bg-brand-800 px-8 py-14 md:px-16">
          <DoorArch className="absolute -right-6 bottom-0 hidden h-[120%] text-white md:block" stroke="#ffffff" />
          <div className="relative max-w-lg">
            <IconDoor size={44} className="text-white" />
            <h2 className="mt-6 font-display text-4xl leading-tight tracking-tight text-white md:text-5xl">Siap membuka pintu baru?</h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/properties" className={btnGold}>Cari properti</Link>
              <Link href="/bantuan" className={btnOutline + " border-white/30 text-white hover:bg-white/10 hover:text-white"}>Pusat bantuan</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
