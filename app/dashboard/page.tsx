import { thumb } from "@/lib/photos";
import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { IconBookmark, IconCalendar, IconReceipt, IconWallet } from "@/components/icons";
import { signOut } from "@/app/actions/auth";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import DataNotice from "@/components/DataNotice";
import PropertyImage from "@/components/PropertyImage";
import SaveButton from "@/components/SaveButton";
import CancelBookingButton from "@/components/CancelBookingButton";
import { Skeleton } from "@/components/Skeleton";
import DashboardNav from "@/components/DashboardNav";
import Reveal from "@/components/Reveal";
import { CountUp } from "@/components/motion";
import { fetchDashboard } from "@/lib/data";
import { BOOKING_STATUS_LABEL, PAYMENT_METHODS, PAYMENT_STATUS_LABEL, PAYMENT_TYPES } from "@/lib/constants";
import { getCurrentUser } from "@/lib/auth";
import { btnPrimary } from "@/lib/ui";
import { formatDate, formatRupiah, formatShortDate, seedOf, shortCode } from "@/lib/utils";

export const metadata = { title: "Dashboard — RuangKita" };

function SectionHead({ title, count }: { title: string; count?: number }) {
  return (
    <div className="mb-5 flex items-baseline justify-between border-b border-ink/15 pb-3">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      {count !== undefined && <span className="tnum text-sm text-muted">{count} item</span>}
    </div>
  );
}

async function DashboardContent() {
  await connection();
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  let d: Awaited<ReturnType<typeof fetchDashboard>>;
  try {
    d = await fetchDashboard(user.id);
  } catch (e) {
    console.error("DashboardContent", e);
    return <div className="mx-auto max-w-2xl px-5 py-24"><DataNotice error="Gagal memuat data dashboard." /></div>;
  }

  const { bookings, payments, savedProperties, propertyMap, roomMap } = d;
  const activeBookings = bookings.filter((b) => b.status === "pending" || b.status === "confirmed");
  const paidBookingIds = new Set(payments.filter((p) => p.payment_status === "paid").map((p) => p.booking_id));
  const awaiting =
    payments.filter((p) => p.payment_status === "pending").length +
    activeBookings.filter((b) => !payments.some((p) => p.booking_id === b.id)).length;
  const displayName = user.username;

  const kpis = [
    { label: "Booking aktif", value: activeBookings.length },
    { label: "Menunggu pembayaran", value: awaiting },
    { label: "Properti tersimpan", value: savedProperties.length },
  ];

  return (
    <div className="bg-paper">
      <div className="mx-auto grid grid-cols-[minmax(0,1fr)] max-w-6xl gap-10 px-5 py-10 md:py-14 lg:grid-cols-[250px_minmax(0,1fr)]">
        {/* SIDEBAR */}
        <aside className="hidden lg:block">
          <div className="grain sticky top-24 overflow-hidden rounded-lg border-2 border-ink bg-brand-900 p-6 text-white shadow-brut">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-500 font-display text-xl text-brand-900">
                {displayName.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{displayName}</p>
                <p className="truncate text-xs text-white/60">Pengguna</p>
              </div>
            </div>
            <DashboardNav />
            <form action={signOut} className="mt-6 border-t border-white/10 pt-5">
              <button type="submit" className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white">
                <LogOut className="h-4 w-4" /> Keluar
              </button>
            </form>
          </div>
        </aside>

        <div className="min-w-0 space-y-14">
          {/* RINGKASAN */}
          <Reveal y={26}><section id="ringkasan" className="scroll-mt-24">
            <p className="eyebrow">Dashboard</p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">Halo, {displayName}.</h1>
            <p className="mt-3 text-muted">Ringkasan aktivitas pencarian tempat tinggal Anda.</p>
            <dl className="mt-8 grid divide-y divide-line overflow-hidden rounded-lg border-2 border-ink bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {kpis.map((k) => (
                <div key={k.label} className="p-6 transition-colors duration-300 hover:bg-brand-50/60">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{k.label}</dt>
                  <dd className="tnum mt-2 font-display text-5xl text-brand-700"><CountUp to={k.value} duration={1.1} /></dd>
                </div>
              ))}
            </dl>
          </section></Reveal>

          {/* SURVEI */}
          <Reveal y={26}><section id="survei" className="scroll-mt-24">
            <SectionHead title="Jadwal survei" count={bookings.length} />
            {bookings.length === 0 ? (
              <EmptyState
                icon={<IconCalendar size={30} />}
                title="Belum ada jadwal survei"
                description="Pilih properti dan jadwalkan survei pertama Anda."
                action={<Link href="/properties" className={btnPrimary}>Cari properti</Link>}
              />
            ) : (
              <ul className="divide-y divide-line overflow-hidden rounded-lg border-2 border-ink bg-white">
                {bookings.map((b) => {
                  const p = propertyMap.get(b.property_id);
                  const room = roomMap.get(b.room_id);
                  const seed = seedOf(b.property_id);
                  return (
                    <li key={b.id} className="grid items-center gap-4 p-5 sm:grid-cols-[1.4fr_1fr_auto]">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-20 shrink-0 overflow-hidden rounded-md bg-brand-50">
                          <PropertyImage src={thumb(p?.coverImage)} alt={p?.name ?? ""} seed={seed} view={seed % 4} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-ink">{p?.name ?? "Properti tidak tersedia"}</p>
                          <p className="truncate text-sm text-muted">{room?.name}</p>
                        </div>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-ink">{formatDate(b.survey_date)}</p>
                        <p className="tnum text-muted">{b.survey_time.slice(0, 5)} WIB · {shortCode(b.id)}</p>
                      </div>
                      <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                        <StatusBadge label={BOOKING_STATUS_LABEL[b.status]} />
                        {b.status === "pending" && <CancelBookingButton bookingId={b.id} />}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section></Reveal>

          {/* PEMBAYARAN */}
          <Reveal y={26}><section id="pembayaran" className="scroll-mt-24">
            <SectionHead title="Status pembayaran" count={activeBookings.length} />
            {activeBookings.length === 0 ? (
              <EmptyState icon={<IconWallet size={30} />} title="Belum ada tagihan" description="Tagihan muncul setelah Anda membuat booking." />
            ) : (
              <ul className="divide-y divide-line overflow-hidden rounded-lg border-2 border-ink bg-white">
                {activeBookings.map((b) => {
                  const p = propertyMap.get(b.property_id);
                  const pay = payments.find((x) => x.booking_id === b.id);
                  const paid = paidBookingIds.has(b.id);
                  return (
                    <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                      <div>
                        <p className="font-semibold text-ink">{p?.name}</p>
                        <p className="text-sm text-muted">
                          {pay ? `${PAYMENT_TYPES[pay.payment_type]} · ${PAYMENT_METHODS[pay.payment_method]}` : "Belum dibayar"}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge label={paid ? "Berhasil" : "Menunggu"} />
                        {!paid && (
                          <Link href={`/payment?booking=${b.id}`} className="text-sm font-semibold text-brand-700 underline-offset-4 hover:underline">
                            {pay ? "Lihat" : "Bayar sekarang"}
                          </Link>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section></Reveal>

          {/* TERSIMPAN */}
          <Reveal y={26}><section id="tersimpan" className="scroll-mt-24">
            <SectionHead title="Properti tersimpan" count={savedProperties.length} />
            {savedProperties.length === 0 ? (
              <EmptyState icon={<IconBookmark size={30} />} title="Belum ada properti tersimpan" description="Tekan Simpan Properti pada halaman detail untuk menyimpannya di sini." />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {savedProperties.map((p) => {
                  const seed = seedOf(p.id);
                  return (
                    <article key={p.id} className="group overflow-hidden rounded-lg border-2 border-ink bg-white">
                      <div className="aspect-[16/9] overflow-hidden bg-brand-50">
                        <PropertyImage src={thumb(p.coverImage)} alt={p.name} seed={seed} view={seed % 4} className="transition-transform duration-700 group-hover:scale-[1.04]" />
                      </div>
                      <div className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">{p.type}</p>
                        <h3 className="mt-1 text-lg font-semibold text-ink">{p.name}</h3>
                        <p className="tnum mt-1 text-sm text-muted">{formatRupiah(p.price)} / bulan</p>
                        <div className="mt-4 flex gap-3">
                          <Link href={`/properties/${p.slug}`} className={btnPrimary + " flex-1"}>Lihat detail</Link>
                          <div className="flex-1"><SaveButton propertyId={p.id} initialSaved /></div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section></Reveal>

          {/* RIWAYAT */}
          <Reveal y={26}><section id="riwayat" className="scroll-mt-24">
            <SectionHead title="Riwayat transaksi" count={payments.length} />
            {payments.length === 0 ? (
              <EmptyState icon={<IconReceipt size={30} />} title="Belum ada transaksi" description="Riwayat pembayaran Anda akan tampil di sini." />
            ) : (
              <ul className="divide-y divide-line overflow-hidden rounded-lg border-2 border-ink bg-white">
                {payments.map((t) => (
                  <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                    <div>
                      <p className="font-semibold text-ink">{PAYMENT_TYPES[t.payment_type]}</p>
                      <p className="tnum text-sm text-muted">
                        {t.transaction_id ?? shortCode(t.id)} · {formatShortDate(t.created_at)} · {PAYMENT_METHODS[t.payment_method]}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="tnum font-display text-xl text-ink">{formatRupiah(Number(t.amount))}</span>
                      <StatusBadge label={PAYMENT_STATUS_LABEL[t.payment_status]} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section></Reveal>

          {/* PROFIL */}
          <Reveal y={26}><section id="profil" className="scroll-mt-24">
            <SectionHead title="Profil" />
            <div className="flex flex-wrap items-center gap-5 rounded-lg border-2 border-ink bg-white p-6">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-700 font-display text-2xl text-white">
                {displayName.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-lg font-semibold text-ink">{displayName}</p>
                <p className="text-sm text-muted">Username: @{user.username}</p>
              </div>
              <form action={signOut} className="ml-auto lg:hidden">
                <button type="submit" className="inline-flex items-center gap-2 rounded-md border-2 border-ink px-4 py-2.5 text-sm font-medium text-ink hover:bg-brand-50">
                  <LogOut className="h-4 w-4" /> Keluar
                </button>
              </form>
            </div>
          </section></Reveal>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl space-y-4 px-5 py-16">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
