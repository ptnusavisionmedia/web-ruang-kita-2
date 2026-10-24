import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Wallet } from "lucide-react";
import PaymentClient from "./PaymentClient";
import DataNotice from "@/components/DataNotice";
import EmptyState from "@/components/EmptyState";
import { Skeleton } from "@/components/Skeleton";
import { fetchBookingForPayment } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Pembayaran — RuangKita" };

async function PaymentContent({ searchParams }: { searchParams: Promise<{ booking?: string }> }) {
  await connection();
  const { booking: bookingId } = await searchParams;

  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/payment${bookingId ? `?booking=${bookingId}` : ""}`)}`);

  let found: Awaited<ReturnType<typeof fetchBookingForPayment>>;
  try {
    found = await fetchBookingForPayment(user.id, bookingId);
  } catch (e) {
    console.error("PaymentContent", e);
    return <div className="mx-auto max-w-2xl px-5 py-24"><DataNotice error="Gagal memuat data booking." /></div>;
  }

  if (!found) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24">
        <EmptyState
        icon={<Wallet className="h-6 w-6" />}
        title="Belum ada booking untuk dibayar"
        description="Jadwalkan survei terlebih dahulu, lalu lanjutkan ke pembayaran."
        action={
          <Link href="/properties" className="rounded-md bg-brand-700 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800">
            Cari properti
          </Link>
        }
      />
      </div>
    );
  }

  return <PaymentClient booking={found.booking} property={found.property} room={found.room} />;
}

export default function PaymentPage({ searchParams }: { searchParams: Promise<{ booking?: string }> }) {
  return (
    <div className="bg-paper">
      <Suspense fallback={<div className="mx-auto max-w-5xl px-5 py-16"><Skeleton className="h-96 w-full" /></div>}>
        <PaymentContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
