import { thumb } from "@/lib/photos";
import Link from "next/link";
import { IconPin } from "@/components/icons";
import type { Property } from "@/types";
import { cn, formatRupiah, seedOf } from "@/lib/utils";
import { FacilityIcon } from "./FacilityBadge";
import PropertyImage from "./PropertyImage";
import StatusBadge from "./StatusBadge";
import { btnPrimary } from "@/lib/ui";

/** Baris horizontal untuk katalog: mudah dipindai, harga selalu di kanan. */
export default function PropertyRow({
  property: p,
  compact = false,
}: {
  property: Property;
  compact?: boolean;
}) {
  const seed = seedOf(p.id);
  return (
    <article
      className={cn(
        "group relative grid overflow-hidden rounded-md border-2 border-ink bg-white transition-all duration-500 shadow-brut-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut",
        compact ? "grid-cols-[132px_1fr]" : "sm:grid-cols-[280px_1fr]",
      )}
    >
      <span className="absolute left-0 top-0 z-10 h-full w-1 origin-top scale-y-0 bg-accent-500 transition-transform duration-500 ease-out group-hover:scale-y-100" aria-hidden />
      <div className={cn("relative overflow-hidden bg-brand-50", compact ? "h-full min-h-[132px]" : "aspect-[16/10] sm:aspect-auto sm:min-h-[200px]")}>
        <Link href={`/properties/${p.slug}`} className="block h-full" tabIndex={-1} aria-label={`Lihat ${p.name}`}>
          <PropertyImage
            src={thumb(p.coverImage)}
            alt={p.name}
            seed={seed}
            view={seed % 4}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        </Link>
        {!compact && (
          <div className="absolute left-3 top-3">
            <StatusBadge label={p.status} className="bg-white shadow-sm" />
          </div>
        )}
      </div>

      <div className={cn("flex flex-col justify-between gap-4", compact ? "p-4" : "min-w-0 p-5 sm:p-6 xl:flex-row xl:items-stretch")}>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">{p.type}</p>
          <h3 className={cn("mt-1 font-semibold leading-snug text-ink", compact ? "text-base" : "text-xl")}>
            <Link href={`/properties/${p.slug}`} className="link-grow hover:text-brand-700">{p.name}</Link>
          </h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
            <IconPin size={18} className="shrink-0 text-brand-700" />
            <span className="truncate">{[p.area, p.city].filter(Boolean).join(", ")}</span>
          </p>
          {!compact && (
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              {p.facilities.slice(0, 4).map((f) => (
                <li key={f.id} className="flex items-center gap-1.5">
                  <FacilityIcon icon={f.icon} size={20} className="text-brand-700" />
                  {f.name}
                </li>
              ))}
              {p.facilities.length > 4 && <li className="text-muted/80">+{p.facilities.length - 4} lainnya</li>}
            </ul>
          )}
          {compact && (
            <p className="tnum mt-2 text-sm">
              <span className="font-semibold text-ink">{formatRupiah(p.price)}</span>
              <span className="text-muted"> / bln</span>
            </p>
          )}
        </div>

        {!compact && (
          <div className="flex items-end justify-between gap-4 border-t border-line pt-4 xl:min-w-[190px] xl:flex-col xl:items-end xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
            <p className="tnum whitespace-nowrap xl:text-right">
              <span className="block text-xs uppercase tracking-wider text-muted">Mulai dari</span>
              <span className="text-xl font-semibold text-ink">{formatRupiah(p.price)}</span>
              <span className="text-sm text-muted"> / bln</span>
            </p>
            <Link href={`/properties/${p.slug}`} className={btnPrimary + " whitespace-nowrap"}>Lihat Detail</Link>
          </div>
        )}
      </div>
    </article>
  );
}
