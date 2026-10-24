import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import BookingClient from "./BookingClient";
import DataNotice from "@/components/DataNotice";
import EmptyState from "@/components/EmptyState";
import { Skeleton } from "@/components/Skeleton";
import { fetchPropertyBySlug } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { todayJakarta } from "@/lib/validation";
import type { PropertyDetail } from "@/types";

export const metadata = { title: "Booking Survei — RuangKita" };

function Wrap({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-2xl px-5 py-24">{children}</div>;
}

const cta = "inline-flex items-center justify-center rounded-md bg-brand-700 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800";

async function BookingContent({ searchParams }: { searchParams: Promise<{ property?: string }> }) {
  await connection();
  const { property: slug } = await searchParams;

  // Booking wajib login.
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/booking${slug ? `?property=${slug}` : ""}`)}`);

  if (!slug) {
    return (
      <Wrap>
        <EmptyState
          icon={<CalendarCheck className="h-6 w-6" />}
        title="Belum ada properti yang dipilih"
        description="Pilih properti terlebih dahulu untuk menjadwalkan survei."
        action={<Link href="/properties" className={cta}>Cari properti</Link>}
      />
      </Wrap>
    );
  }

  let property: PropertyDetail | null;
  try {
    property = await fetchPropertyBySlug(slug);
  } catch (e) {
    console.error("BookingContent", e);
    return <Wrap><DataNotice error="Gagal memuat properti." /></Wrap>;
  }

  if (!property) {
    return (
      <Wrap>
        <EmptyState
        title="Properti tidak ditemukan"
        description="Properti yang Anda pilih tidak tersedia atau sudah tidak aktif."
        action={<Link href="/properties" className={cta}>Cari properti</Link>}
      />
      </Wrap>
    );
  }

  if (property.roomsAvailable === 0) {
    return (
      <Wrap>
        <EmptyState
        title="Kamar sedang penuh"
        description="Semua kamar di properti ini sudah terisi. Coba properti lain."
        action={<Link href="/properties" className={cta}>Cari properti lain</Link>}
      />
      </Wrap>
    );
  }

  return (
    <BookingClient
      property={property}
      minDate={todayJakarta()}
      defaultName=""
      defaultEmail=""
    />
  );
}

export default function BookingPage({ searchParams }: { searchParams: Promise<{ property?: string }> }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-5 py-16"><Skeleton className="h-96 w-full" /></div>}>
      <BookingContent searchParams={searchParams} />
    </Suspense>
  );
}
