"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { IconBuilding, IconPhone, IconWallet, type IconComponent } from "@/components/icons";
import { createPayment, simulatePaid, type CreatedPayment } from "@/app/actions/payments";
import PaymentSummary from "@/components/PaymentSummary";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";
import { BOOKING_FEE, PAYMENT_METHODS, PAYMENT_TYPES } from "@/lib/constants";
import { btnOutline, btnPrimary } from "@/lib/ui";
import { cn, formatRupiah } from "@/lib/utils";
import type { PropertyDetail } from "@/types";
import type { BookingRow, PaymentDbMethod, PaymentType, RoomRow } from "@/types/database";

const METHODS: Array<{ id: PaymentDbMethod; desc: string; icon: IconComponent }> = [
  { id: "bank_transfer", desc: "BCA, Mandiri, BNI, BRI", icon: IconBuilding },
  { id: "e_wallet", desc: "GoPay, OVO, DANA", icon: IconPhone },
  { id: "virtual_account", desc: "Nomor VA unik per transaksi", icon: IconWallet },
];

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t-2 border-ink pt-8">
      <legend className="float-left mb-5 flex w-full items-baseline gap-3">
        <span className="font-display text-2xl text-accent-600">{n}</span>
        <span className="text-lg font-semibold text-ink">{title}</span>
      </legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

function Radio({ checked, children, group, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { checked: boolean; group: string }) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer items-center gap-4 rounded-md border-2 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-600",
        checked ? "border-ink shadow-brut-sm" : "border-ink hover:bg-accent-50",
      )}
    >
      {checked && (
        <motion.span
          layoutId={`radio-${group}`}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className="absolute inset-0 rounded-md bg-accent-200"
          aria-hidden
        />
      )}
      <input type="radio" className="sr-only" checked={checked} {...props} />
      <span className="relative z-10 flex flex-1 items-center gap-4">{children}</span>
      <span
        className={cn(
          "relative z-10 ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          checked ? "border-ink bg-brand-700 text-white" : "border-ink bg-white",
        )}
        aria-hidden
      >
        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
    </label>
  );
}

export default function PaymentClient({
  booking,
  property,
  room,
}: {
  booking: BookingRow;
  property: PropertyDetail;
  room: RoomRow;
}) {
  const toast = useToast();
  const [type, setType] = useState<PaymentType>("booking_fee");
  const [method, setMethod] = useState<PaymentDbMethod>("e_wallet");
  const [agree, setAgree] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<(CreatedPayment & { method: PaymentDbMethod; type: PaymentType }) | null>(null);
  const [pending, startTransition] = useTransition();

  const options = {
    booking_fee: { amount: BOOKING_FEE, hint: "Mengamankan kamar selama 7 hari, dihitung sebagai bagian dari sewa." },
    rent_deposit: { amount: Number(room.price_monthly), hint: "Pembayaran sewa bulan pertama untuk mengunci kamar." },
  };
  const amount = options[type].amount;

  function pay() {
    startTransition(async () => {
      const res = await createPayment({ bookingId: booking.id, type, method });
      setConfirmOpen(false);
      if (!res.ok || !res.data) {
        setError(res.message ?? "Pembayaran gagal. Coba lagi.");
        return;
      }
      setError(null);
      setResult({ ...res.data, method, type });
      toast(res.data.status === "paid" ? "Pembayaran berhasil" : "Menunggu pembayaran Anda", res.data.status === "paid" ? "success" : "info");
    });
  }

  function markPaid() {
    if (!result) return;
    startTransition(async () => {
      const res = await simulatePaid(result.id);
      if (!res.ok) {
        toast(res.message ?? "Gagal memperbarui status", "info");
        return;
      }
      setResult({ ...result, status: "paid" });
      toast("Pembayaran berhasil (simulasi)");
    });
  }

  if (result) {
    const ok = result.status === "paid";
    return (
      <div className="mx-auto grid grid-cols-[minmax(0,1fr)] max-w-5xl items-center gap-12 px-5 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div>
          <p className="eyebrow">{ok ? "Pembayaran diterima" : "Menunggu pembayaran"}</p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">
            {ok ? "Terima kasih, pembayaran berhasil." : "Selesaikan pembayaran Anda."}
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            {ok
              ? `${PAYMENT_TYPES[result.type]} sebesar ${formatRupiah(result.amount)} telah kami terima. Kamar Anda aman.`
              : `Transfer ${formatRupiah(result.amount)} melalui ${PAYMENT_METHODS[result.method]} menggunakan nomor di bawah ini.`}
          </p>

          <div className="mt-8 rounded-md border border-dashed border-brand-700/40 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {result.method === "virtual_account" ? "Nomor virtual account" : "Nomor referensi"}
            </p>
            <p className="tnum mt-2 font-display text-3xl tracking-wide text-brand-700 [overflow-wrap:anywhere]">{result.transactionId}</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {!ok && (
              <button onClick={markPaid} disabled={pending} className={btnPrimary}>
                Simulasikan pembayaran selesai
              </button>
            )}
            <Link href="/dashboard" className={ok ? btnPrimary : btnOutline}>
              Ke dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <PaymentSummary
          property={property}
          roomName={room.name}
          booking={booking}
          kind={PAYMENT_TYPES[result.type]}
          method={PAYMENT_METHODS[result.method]}
          amount={result.amount}
          stamp={ok ? { text: "LUNAS", tone: "paid" } : { text: "MENUNGGU", tone: "pending" }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 md:py-20">
      <p className="eyebrow">Pembayaran</p>
      <h1 className="mt-4 font-display text-4xl leading-tight text-ink md:text-5xl">Amankan kamar Anda.</h1>
      <p className="mb-12 mt-4 max-w-lg text-muted">Pilih jenis dan metode pembayaran. Anda bisa meninjau ringkasannya di sebelah kanan.</p>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-10">
          {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

          <Block n="01" title="Jenis pembayaran">
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(options) as PaymentType[]).map((k) => (
                <Radio key={k} group="kind" name="kind" checked={type === k} onChange={() => setType(k)}>
                  <span>
                    <span className="block font-medium text-ink">{PAYMENT_TYPES[k]}</span>
                    <span className="tnum block font-display text-xl text-brand-700">{formatRupiah(options[k].amount)}</span>
                    <span className="mt-1 block text-xs leading-snug text-muted">{options[k].hint}</span>
                  </span>
                </Radio>
              ))}
            </div>
          </Block>

          <Block n="02" title="Metode pembayaran">
            <div className="space-y-3">
              {METHODS.map((m) => (
                <Radio key={m.id} group="method" name="method" checked={method === m.id} onChange={() => setMethod(m.id)}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                    <m.icon size={26} />
                  </span>
                  <span>
                    <span className="block font-medium text-ink">{PAYMENT_METHODS[m.id]}</span>
                    <span className="block text-sm text-muted">{m.desc}</span>
                  </span>
                </Radio>
              ))}
            </div>
          </Block>

          <Block n="03" title="Persetujuan">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink/85">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 accent-brand-700" />
              Saya menyetujui syarat dan ketentuan sewa serta kebijakan pembatalan RuangKita.
            </label>
          </Block>

          <button type="button" disabled={!agree} onClick={() => setConfirmOpen(true)} className={btnPrimary + " w-full py-4 text-base"}>
            Bayar Sekarang · {formatRupiah(amount)}
          </button>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <PaymentSummary property={property} roomName={room.name} booking={booking} kind={PAYMENT_TYPES[type]} amount={amount} />
        </div>
      </div>

      <Modal
        open={confirmOpen}
        title="Konfirmasi pembayaran"
        confirmLabel="Ya, Bayar"
        loading={pending}
        onClose={() => setConfirmOpen(false)}
        onConfirm={pay}
      >
        Anda akan membayar <strong className="text-ink">{formatRupiah(amount)}</strong> untuk {PAYMENT_TYPES[type].toLowerCase()} melalui {PAYMENT_METHODS[method]}. Ini adalah simulasi, tidak ada uang yang ditarik.
      </Modal>
    </div>
  );
}
