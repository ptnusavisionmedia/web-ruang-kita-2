import { thumb } from "@/lib/photos";
import { IconPin } from "@/components/icons";
import { formatRupiah, seedOf } from "@/lib/utils";
import PropertyImage from "./PropertyImage";

export interface SummaryProperty {
  id: string;
  name: string;
  area: string;
  city: string;
  coverImage: string | null;
}

export default function PropertySummary({
  property: p,
  subtitle,
  price,
}: {
  property: SummaryProperty;
  subtitle?: string;
  price?: number;
}) {
  const seed = seedOf(p.id);
  return (
    <div className="flex gap-4">
      <div className="h-20 w-24 shrink-0 overflow-hidden rounded-md">
        <PropertyImage src={thumb(p.coverImage)} alt={p.name} seed={seed} view={seed % 4} />
      </div>
      <div className="min-w-0">
        <p className="truncate font-semibold text-ink">{p.name}</p>
        <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
          <IconPin size={18} className="shrink-0 text-brand-700" />
          <span className="truncate">{[p.area, p.city].filter(Boolean).join(", ")}</span>
        </p>
        {subtitle && <p className="truncate text-sm text-muted">{subtitle}</p>}
        {price !== undefined && (
          <p className="mt-1 text-sm font-semibold text-brand-700">{formatRupiah(price)} / bulan</p>
        )}
      </div>
    </div>
  );
}
