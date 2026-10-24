import { thumb } from "@/lib/photos";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { IconPin } from "@/components/icons";
import type { Property } from "@/types";
import { cn, formatRupiah, seedOf } from "@/lib/utils";
import PropertyImage from "./PropertyImage";
import StatusBadge from "./StatusBadge";
import SaveButton from "./SaveButton";

/** Kartu tanpa kotak: foto besar, teks di bawahnya. `featured` untuk sorotan besar. */
export default function PropertyCard({
  property: p,
  saved = false,
  featured = false,
}: {
  property: Property;
  saved?: boolean;
  featured?: boolean;
}) {
  const seed = seedOf(p.id);
  return (
    <article className="group transition-transform duration-500 ease-out hover:-translate-y-1.5">
      <div className={cn("relative overflow-hidden rounded-md border-2 border-ink bg-brand-50 shadow-brut-sm transition-shadow duration-300 group-hover:shadow-brut", featured ? "aspect-[4/3.4]" : "aspect-[4/3]")}>
        <Link href={`/properties/${p.slug}`} className="block h-full" aria-label={`Lihat ${p.name}`} tabIndex={-1}>
          <PropertyImage
            src={thumb(p.coverImage)}
            alt={p.name}
            seed={seed}
            view={seed % 4}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          />
        </Link>
        <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-brand-900/90 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-transform duration-500 ease-out group-hover:translate-y-0">
          Lihat detail
        </span>
        <div className="absolute left-3 top-3">
          <StatusBadge label={p.status} className="bg-white shadow-sm" />
        </div>
        <div className="absolute right-3 top-3">
          <SaveButton propertyId={p.id} initialSaved={saved} variant="icon" />
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">{p.type}</p>
          <h3 className={cn("mt-1.5 font-semibold leading-snug text-ink", featured ? "font-display text-3xl font-normal" : "text-lg")}>
            <Link href={`/properties/${p.slug}`} className="link-grow hover:text-brand-700">{p.name}</Link>
          </h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
            <IconPin size={18} className="shrink-0 text-brand-700" />
            <span className="truncate">{[p.area, p.city].filter(Boolean).join(", ")}</span>
          </p>
        </div>
        <Link
          href={`/properties/${p.slug}`}
          aria-label={`Detail ${p.name}`}
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink text-brand-700 transition-all duration-500 group-hover:rotate-45 group-hover:border-brand-700 group-hover:bg-brand-700 group-hover:text-white"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-4 border-t-2 border-ink pt-4">
        <p className="tnum whitespace-nowrap">
          <span className="text-xl font-semibold text-ink">{formatRupiah(p.price)}</span>
          <span className="text-sm text-muted"> / bulan</span>
        </p>
        <p className="mt-1.5 truncate text-sm text-muted">{p.facilities.slice(0, 3).map((f) => f.name).join(" · ")}</p>
      </div>
    </article>
  );
}
