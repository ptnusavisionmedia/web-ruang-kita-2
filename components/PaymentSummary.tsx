import { thumb } from "@/lib/photos";
import type { BookingRow } from "@/types/database";
import { formatDate, seedOf, shortCode } from "@/lib/utils";
import { AnimatedRupiah, Stamp } from "@/components/motion";
import PropertyImage from "./PropertyImage";
import type { SummaryProperty } from "./PropertySummary";

function Line({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3 text-sm">
      <dt className="shrink-0 text-muted">{label}</dt>
      <span className="mb-1 min-w-4 flex-1 border-b border-dotted border-ink/25" aria-hidden />
      <dd className="tnum text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

/** Ringkasan bergaya struk. `stamp` menampilkan cap miring (mis. LUNAS). */
export default function PaymentSummary({
  property,
  roomName,
  booking,
  kind,
  amount,
  stamp,
  method,
}: {
  property: SummaryProperty;
  roomName: string;
  booking: BookingRow;
  kind: string;
  amount: number;
  stamp?: { text: string; tone: "paid" | "pending" };
  method?: string;
}) {
  const seed = seedOf(property.id);
  return (
    <aside className="zigzag-bottom relative bg-white">
      <div className="h-2.5 bg-ink" />
      <div className="p-7">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Ringkasan booking</p>
          <p className="tnum text-xs text-muted">#{shortCode(booking.id)}</p>
        </div>

        <div className="mt-5 flex gap-4">
          <div className="h-16 w-20 shrink-0 overflow-hidden rounded-md">
            <PropertyImage src={thumb(property.coverImage)} alt={property.name} seed={seed} view={seed % 4} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">{property.name}</p>
            <p className="truncate text-sm text-muted">{roomName}</p>
            <p className="truncate text-sm text-muted">{[property.area, property.city].filter(Boolean).join(", ")}</p>
          </div>
        </div>

        <dl className="mt-6 space-y-3">
          <Line label="Jadwal survei" value={`${formatDate(booking.survey_date)}, ${booking.survey_time.slice(0, 5)}`} />
          <Line label="Atas nama" value={booking.full_name} />
          <Line label="Jenis" value={kind} />
          {method && <Line label="Metode" value={method} />}
        </dl>

        <div className="mt-7 border-t-2 border-dashed border-ink/15 pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Total bayar</p>
          <p className="tnum mt-1 font-display text-4xl text-brand-700"><AnimatedRupiah value={amount} /></p>
        </div>

        {stamp && <Stamp text={stamp.text} tone={stamp.tone} />}
      </div>
    </aside>
  );
}
