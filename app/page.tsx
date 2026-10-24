import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import HeroVisual from "@/components/HeroVisual";
import DataNotice from "@/components/DataNotice";
import DoorArch from "@/components/DoorArch";
import IconTile from "@/components/IconTile";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import { Skeleton } from "@/components/Skeleton";
import { CountUp, SplitWords, Stagger, StaggerItem } from "@/components/motion";
import {
  IconBed,
  IconBuilding,
  IconCalendar,
  IconChat,
  IconDoor,
  IconHeadset,
  IconKey,
  IconSearch,
  IconShield,
  IconTag,
  IconWallet,
} from "@/components/icons";
import { fetchHomeStats, fetchPopularProperties } from "@/lib/data";
import { HERO_PHOTO } from "@/lib/photos";
import { btnGold, btnOutline, btnPrimary } from "@/lib/ui";

export const metadata = { title: "RuangKita — Cari dan booking kos, apartemen, rumah" };


const ticker = [
  { icon: IconBed, label: "Kos Putra" },
  { icon: IconBed, label: "Kos Putri" },
  { icon: IconKey, label: "Kos Campur" },
  { icon: IconBuilding, label: "Apartemen" },
  { icon: IconDoor, label: "Rumah" },
];

const steps = [
  { icon: IconSearch, title: "Cari kamar", text: "Saring berdasarkan lokasi, harga, dan fasilitas." },
  { icon: IconCalendar, title: "Jadwalkan survei", text: "Pilih tanggal dan jam, lihat kamarnya langsung." },
  { icon: IconWallet, title: "Booking dan bayar", text: "Amankan kamar dengan pembayaran yang tercatat." },
];

const perks = [
  { icon: IconShield, title: "Properti terverifikasi", text: "Setiap listing diperiksa sebelum tampil di katalog." },
  { icon: IconTag, title: "Harga transparan", text: "Tanpa biaya tersembunyi. Harga yang tampil adalah harga yang dibayar." },
  { icon: IconHeadset, title: "Bantuan responsif", text: "Tim kami siap membantu dari survei sampai hari check-in." },
];

const quickFaq = [
  "Apakah survei dikenakan biaya?",
  "Bagaimana cara membayar booking?",
  "Bisakah saya membatalkan jadwal survei?",
];

async function Stats() {
  await connection();
  let stats: Awaited<ReturnType<typeof fetchHomeStats>> | null = null;
  try {
    stats = await fetchHomeStats();
  } catch (e) {
    console.error("Stats", e);
  }
  if (!stats) return null;
  const items = [
    { n: stats.properties, label: "Properti aktif" },
    { n: stats.rooms, label: "Kamar tersedia" },
    { n: stats.cities, label: "Kota" },
  ];
  return (
    <Stagger gap={0.12} className="grid grid-cols-3 divide-x-2 divide-ink rounded-md border-2 border-ink bg-white shadow-brut">
      {items.map((s) => (
        <StaggerItem key={s.label} className="group px-2 py-7 transition-colors hover:bg-brand-50/60 sm:px-8">
          <p className="tnum font-display text-5xl leading-none text-brand-700 transition-transform duration-500 group-hover:-translate-y-1 sm:text-7xl">
            <CountUp to={s.n} />
          </p>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-xs">{s.label}</p>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

async function loadFeatured() {
  try {
    return { items: await fetchPopularProperties(3), error: null };
  } catch (e) {
    console.error("Featured", e);
    return { items: [], error: "Gagal memuat properti." };
  }
}

async function Featured() {
  await connection();
  const { items, error } = await loadFeatured();
  if (error) return <DataNotice error={error} />;
  if (items.length === 0) return <DataNotice error="Belum ada properti yang tersedia." />;
  return (
    <Stagger gap={0.14} className="grid gap-x-8 gap-y-12 md:grid-cols-3">
      {items.map((p) => (
        <StaggerItem key={p.id}>
          <PropertyCard property={p} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative z-10 overflow-x-clip bg-paper">
        <div className="blueprint absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 pb-0 pt-12 md:pt-16">
          <div className="flex flex-wrap items-center gap-3">
            <SectionLabel>Kos · Apartemen · Rumah</SectionLabel>
            <span className="sticker">Survei gratis</span>
          </div>
          <h1 className="mt-6 font-display text-[3rem] leading-[0.98] tracking-tight text-ink sm:text-7xl lg:text-[6.25rem]">
            <SplitWords
              text="Temukan tempat tinggal yang terasa seperti rumah."
              italicWords={["rumah"]}
              italicClassName="text-ink marker-gold"
              delay={0.1}
            />
          </h1>

          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
            <Reveal delay={0.5} className="flex flex-col justify-between gap-8">
              <p className="max-w-md text-lg leading-relaxed text-muted">
                Cari kamar, jadwalkan survei, lalu booking dan bayar dalam satu tempat. Tanpa perantara berbelit, tanpa biaya tersembunyi.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/properties" className={btnPrimary + " group px-7 py-3.5"}>
                    Cari properti <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                <Link href="/cara-kerja" className={btnOutline + " px-7 py-3.5"}>
                  Cara kerja
                </Link>
              </div>
            </Reveal>

            <HeroVisual src={HERO_PHOTO} alt="Vila tropis dengan kolam renang dan pepohonan kelapa" />
          </div>
        </div>

        <div className="relative mx-auto mt-12 max-w-6xl px-5 pb-14">
          <SearchBar />
        </div>
      </section>

      {/* PITA TIPE PROPERTI */}
      <div className="border-y-2 border-ink bg-brand-900" aria-label="Tipe properti">
        <div className="overflow-hidden py-5">
          <div className="marquee flex w-max items-center gap-10 whitespace-nowrap">
            {[...ticker, ...ticker, ...ticker, ...ticker].map((t, i) => (
              <span key={i} className="flex items-center gap-10 font-display text-2xl text-white">
                <span className="flex items-center gap-3">
                  <t.icon size={30} className="text-white" />
                  {t.label}
                </span>
                <span className="h-2 w-2 rotate-45 bg-accent-500" aria-hidden />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* STATISTIK */}
      <section className="mx-auto max-w-6xl px-5 pt-14">
        <Suspense fallback={<Skeleton className="h-36 w-full" />}>
          <Stats />
        </Suspense>
      </section>

      {/* PILIHAN TERBARU */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel index="01">Pilihan terbaru</SectionLabel>
              <h2 className="mt-4 font-display text-4xl tracking-tight text-ink md:text-6xl">Baru dan tersedia.</h2>
            </div>
            <Link href="/properties" className="group inline-flex items-center gap-2 border-b-2 border-accent-500 pb-1 text-sm font-semibold text-brand-800">
              Lihat semua properti
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-12">
          <Suspense
            fallback={
              <div className="grid gap-8 md:grid-cols-3" role="status" aria-label="Memuat properti">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="aspect-[4/3.4] w-full" />
                ))}
              </div>
            }
          >
            <Featured />
          </Suspense>
        </div>
      </section>

      {/* CARA KERJA (ringkas) */}
      <section className="grain relative overflow-hidden bg-brand-800 text-white">
        <p className="text-outline-light pointer-events-none absolute -right-6 -top-6 select-none font-display text-[12rem] leading-none sm:text-[18rem]" aria-hidden>
          3
        </p>
        <div className="relative mx-auto max-w-6xl px-5 py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <SectionLabel index="02" dark>Cara kerja</SectionLabel>
              <h2 className="mt-4 max-w-xl font-display text-4xl leading-tight tracking-tight md:text-6xl">Tiga langkah, tanpa ribet.</h2>
            </Reveal>
            <Link href="/cara-kerja" className={btnGold}>
                Lihat cara kerja lengkap <ArrowRight className="h-4 w-4" />
              </Link>
          </div>
          <Stagger gap={0.14} className="mt-14 grid gap-0 divide-y-2 divide-white overflow-hidden rounded-md border-2 border-white shadow-[6px_6px_0_0_#d2a34f] md:grid-cols-3 md:divide-x-2 md:divide-y-0">
            {steps.map((s, i) => (
              <StaggerItem key={s.title} className="group bg-brand-800 p-8 transition-colors duration-500 hover:bg-brand-700">
                <div className="flex items-center justify-between">
                  <span className="transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <IconTile icon={s.icon} dark />
                  </span>
                  <span className="tnum font-display text-5xl text-white/20 transition-colors duration-500 group-hover:text-accent-400/60">0{i + 1}</span>
                </div>
                <h3 className="mt-8 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-white/65">{s.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* KEUNGGULAN */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <SectionLabel index="03">Kenapa RuangKita</SectionLabel>
          <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight tracking-tight text-ink md:text-6xl">
            Mencari hunian seharusnya tidak melelahkan.
          </h2>
        </Reveal>
        <Stagger gap={0.12} className="mt-14 grid divide-y-2 divide-ink border-y-2 border-ink md:grid-cols-3 md:divide-x-2 md:divide-y-0">
          {perks.map((p) => (
            <StaggerItem key={p.title} className="group py-8 transition-colors hover:bg-paper md:px-8 md:first:pl-0 md:last:pr-0">
              <span className="inline-block transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:rotate-3">
                <IconTile icon={p.icon} />
              </span>
              <h3 className="mt-6 text-xl font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 max-w-xs leading-relaxed text-muted">{p.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* BANTUAN (ringkas) */}
      <section className="border-t border-line bg-paper">
        <div className="mx-auto grid grid-cols-[minmax(0,1fr)] gap-12 px-5 py-20 lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <Reveal>
            <SectionLabel index="04">Bantuan</SectionLabel>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-ink md:text-5xl">Masih ada yang ingin ditanyakan?</h2>
            <Link href="/bantuan" className={btnPrimary + " mt-8"}>
              <IconChat size={20} className="text-white" /> Buka pusat bantuan
            </Link>
          </Reveal>
          <Stagger gap={0.1} className="divide-y-2 divide-ink border-y-2 border-ink">
            {quickFaq.map((q) => (
              <StaggerItem key={q} y={16}>
                <Link href="/bantuan" className="group flex items-center justify-between gap-6 py-5 text-lg text-ink transition-all duration-300 hover:pl-3 hover:text-brand-700">
                  {q}
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-brand-700 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-lg border-2 border-ink bg-brand-900 px-8 py-16 shadow-brut-lg md:px-16 md:py-20">
            <DoorArch className="absolute -right-6 bottom-0 hidden h-[115%] text-white md:block" stroke="#ffffff" />
            <div className="relative max-w-xl">
              <SectionLabel dark>Mulai sekarang</SectionLabel>
              <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight text-white md:text-6xl">Siap menemukan kamar yang cocok?</h2>
              <p className="mt-5 text-lg text-white/70">Mulai cari hari ini. Survei gratis, tanpa komitmen.</p>
              <div className="mt-9"><Link href="/properties" className={btnGold + " px-7 py-3.5"}>
                  Cari properti <ArrowRight className="h-4 w-4" />
                </Link></div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
