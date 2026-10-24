import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { IconBed, IconBuilding, IconLayers, IconPin, IconRuler, IconUser } from "@/components/icons";
import Gallery from "@/components/Gallery";
import { FacilityIcon } from "@/components/FacilityBadge";
import StatusBadge from "@/components/StatusBadge";
import Reveal from "@/components/Reveal";
import { Stagger, StaggerItem } from "@/components/motion";
import DataNotice from "@/components/DataNotice";
import { Skeleton } from "@/components/Skeleton";
import { fetchPropertyBySlug } from "@/lib/data";
import { btnPrimary } from "@/lib/ui";
import { formatRupiah, seedOf } from "@/lib/utils";
import type { PropertyDetail } from "@/types";

export const metadata = { title: "Detail properti — RuangKita" };

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Reveal y={22}>
      <section className="grid grid-cols-[minmax(0,1fr)] gap-4 border-t-2 border-ink py-10 md:grid-cols-[170px_minmax(0,1fr)] md:gap-10">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-700">{label}</h2>
        <div>{children}</div>
      </section>
    </Reveal>
  );
}

async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;

  let p: PropertyDetail | null;
  try {
    p = await fetchPropertyBySlug(slug);
  } catch (e) {
    console.error("PropertyDetail", e);
    return <DataNotice error="Gagal memuat properti ini." />;
  }
  if (!p) notFound();

  const full = p.roomsAvailable === 0;
  const firstRoom = p.rooms.find((r) => r.available && r.status === "available") ?? p.rooms[0];
  const seed = seedOf(p.id);
  const images = p.images.length ? p.images : p.coverImage ? [p.coverImage] : [];

  const facts = [
    { icon: IconBuilding, label: "Tipe", value: p.type },
    { icon: IconRuler, label: "Ukuran", value: firstRoom?.size ?? "—" },
    { icon: IconLayers, label: "Lantai", value: firstRoom?.floor ?? "—" },
    { icon: IconBed, label: "Kamar tersedia", value: `${p.roomsAvailable} dari ${p.rooms.length}` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:py-10">
      <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/properties" className="hover:text-brand-700">Katalog</Link>
        <span className="mx-2 text-line">/</span>
        <span className="text-ink">{p.name}</span>
      </nav>

      <Gallery images={images} seed={seed} name={p.name} />

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_370px]">
        <div>
          <header className="pb-10">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge label={p.status} />
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">{p.type}</span>
            </div>
            <h1 className="mt-4 font-display text-4xl leading-[1.05] text-ink md:text-6xl">{p.name}</h1>
            <p className="mt-4 flex items-center gap-2 text-lg text-muted">
              <IconPin size={26} className="text-brand-700" /> {p.address || `${p.area}, ${p.city}`}
            </p>
          </header>

          <Stagger gap={0.08} className="contents">
          <dl className="grid grid-cols-2 border-y-2 border-ink sm:grid-cols-4">
            {facts.map((f, i) => (
              <StaggerItem key={f.label} y={18} className={`px-1 py-5 sm:px-5 ${i > 0 ? "sm:border-l sm:border-line" : ""} ${i % 2 ? "border-l border-line sm:border-l" : ""}`}>
                <span className="inline-block transition-transform duration-500 hover:-translate-y-1 hover:rotate-6"><f.icon size={30} className="text-brand-700" /></span>
                <dt className="mt-3 text-xs uppercase tracking-wider text-muted">{f.label}</dt>
                <dd className="tnum mt-0.5 font-semibold text-ink">{f.value}</dd>
              </StaggerItem>
            ))}
          </dl>
          </Stagger>

          <Section label="Tentang">
            <p className="max-w-2xl text-lg leading-relaxed text-ink/85">{p.description || "Belum ada deskripsi."}</p>
          </Section>

          <Section label="Pilihan kamar">
            {p.rooms.length === 0 ? (
              <p className="text-sm text-muted">Belum ada data kamar.</p>
            ) : (
              <ul className="divide-y divide-line border-y-2 border-ink">
                {p.rooms.map((r) => {
                  const ok = r.available && r.status === "available";
                  return (
                    <li key={r.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-5">
                      <div>
                        <p className="font-semibold text-ink">{r.name}</p>
                        <p className="mt-1 text-sm text-muted">
                          {[r.size, r.floor].filter(Boolean).join(" · ")}
                          {r.description ? ` — ${r.description}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-5">
                        <p className="tnum text-right">
                          <span className="font-semibold text-ink">{formatRupiah(Number(r.price_monthly))}</span>
                          <span className="text-sm text-muted"> / bln</span>
                        </p>
                        <StatusBadge label={ok ? "Tersedia" : "Penuh"} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>

          <Section label="Fasilitas">
            {p.facilities.length === 0 ? (
              <p className="text-sm text-muted">Belum ada data fasilitas.</p>
            ) : (
              <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {p.facilities.map((f) => (
                  <li key={f.id} className="group flex items-center gap-3 text-ink transition-transform duration-300 hover:translate-x-1">
                    <span className="flex size-11 items-center justify-center rounded-md border border-brand-700/15 bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:border-brand-700 group-hover:bg-brand-700 group-hover:text-white">
                      <FacilityIcon icon={f.icon} size={26} />
                    </span>
                    {f.name}
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {p.rules.length > 0 && (
            <Section label="Peraturan">
              <ol className="space-y-4">
                {p.rules.map((r, i) => (
                  <li key={r} className="flex gap-4 text-ink/85">
                    <span className="tnum font-display text-lg text-accent-600">{String(i + 1).padStart(2, "0")}</span>
                    <span className="pt-0.5">{r}</span>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          <Section label="Lokasi">
            <div className="relative aspect-[16/8] overflow-hidden rounded-md border-2 border-ink bg-paper">
              <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-label="Peta lokasi (placeholder)">
                <rect width="400" height="200" fill="#f7f5ef" />
                <g fill="#e6e1d2"><rect x="20" y="20" width="90" height="60" rx="4" /><rect x="130" y="110" width="110" height="70" rx="4" /><rect x="270" y="30" width="110" height="80" rx="4" /><rect x="30" y="110" width="80" height="70" rx="4" /></g>
                <g stroke="#ffffff" strokeWidth="9" fill="none"><path d="M-10 95 L410 80" /><path d="M120 -10 L125 210" /><path d="M255 -10 L262 210" /></g>
                <g stroke="#c2ddd3" strokeWidth="2" fill="none" strokeDasharray="5 5"><path d="M-10 95 L410 80" /></g>
                <circle cx="190" cy="88" r="26" fill="#104437" opacity=".12" />
                <circle cx="190" cy="88" r="10" fill="#d2a34f" stroke="#104437" strokeWidth="3" />
              </svg>
              <span className="absolute bottom-3 left-3 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-ink shadow-sm">
                {[p.area, p.city].filter(Boolean).join(", ")}
              </span>
            </div>
          </Section>

          <Section label={p.owner.role}>
            <div className="flex items-center gap-4">
              <span className="flex size-14 items-center justify-center rounded-md bg-brand-700 text-white">
                <IconUser size={32} />
              </span>
              <div>
                <p className="font-semibold text-ink">{p.owner.name}</p>
                <p className="text-sm text-muted">Hubungi lewat penjadwalan survei</p>
              </div>
            </div>
          </Section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Reveal y={30} delay={0.2}>
          <div className="relative rounded-md border-2 border-ink bg-white shadow-brut">
            <div className="p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Mulai dari</p>
              <p className="tnum mt-2">
                <span className="font-display text-4xl text-ink">{formatRupiah(p.price)}</span>
                <span className="text-muted"> / bulan</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                {full ? "Semua kamar sedang penuh." : `${p.roomsAvailable} kamar tersisa · survei gratis`}
              </p>
            </div>

            {/* garis sobekan tiket */}
            <div className="relative">
              <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full border-2 border-ink bg-white [clip-path:inset(50%_0_0_50%)]" aria-hidden />
              <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full border-2 border-ink bg-white [clip-path:inset(50%_50%_0_0)]" aria-hidden />
              <div className="perforation mx-5" />
            </div>

            <div className="space-y-3 p-7 pt-6">
              {full || !firstRoom ? (
                <span className="flex w-full cursor-not-allowed items-center justify-center rounded-md bg-surface px-6 py-3.5 text-sm font-semibold text-muted">
                  Kamar Penuh
                </span>
              ) : (
                <Link href="/bantuan" className={btnPrimary + " w-full py-3.5"}>
                  Hubungi Pengelola <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <p className="pt-1 text-center text-xs text-muted">Hubungi pengelola untuk menjadwalkan survei.</p>
            </div>
          </div>
          </Reveal>
        </aside>
      </div>
    </div>
  );
}

export default function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl space-y-6 px-5 py-14">
          <Skeleton className="h-[320px] w-full sm:h-[440px]" />
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
      }
    >
      <Detail params={params} />
    </Suspense>
  );
}
