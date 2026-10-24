"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, SlidersHorizontal, X } from "lucide-react";
import { searchCatalog, type CatalogResult } from "@/app/actions/properties";
import SearchBar from "@/components/SearchBar";
import CatalogHeading from "@/components/CatalogHeading";
import FilterPanel, { DEFAULT_FILTERS, type Filters } from "@/components/FilterPanel";
import PropertyRow from "@/components/PropertyRow";
import EmptyState from "@/components/EmptyState";
import { PropertyGridSkeleton } from "@/components/Skeleton";
import { PROPERTY_TYPES } from "@/lib/constants";
import { btnOutline, btnPrimary } from "@/lib/ui";
import { cn } from "@/lib/utils";

type Sort = "newest" | "price-asc" | "price-desc";

const SORTS: Array<{ value: Sort; label: string }> = [
  { value: "newest", label: "Terbaru" },
  { value: "price-asc", label: "Termurah" },
  { value: "price-desc", label: "Termahal" },
];

export default function Catalog() {
  const params = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => ({
    ...DEFAULT_FILTERS,
    q: params.get("q") ?? "",
    type: params.get("type") ?? "",
    min: params.get("min") ?? "",
    max: params.get("max") ?? "",
  }));
  const [sort, setSort] = useState<Sort>("newest");
  const [page, setPage] = useState(1);
  const [panelOpen, setPanelOpen] = useState(false);

  const [data, setData] = useState<CatalogResult | null>(null);
  const [items, setItems] = useState<CatalogResult["items"]>([]);
  // Tanda hasil "terkini": berubah saat filter/urutan berganti, memicu transisi daftar.
  const [sig, setSig] = useState("init");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const requestId = useRef(0);

  // Ambil data dari Supabase (lewat server action) setiap filter/urutan/halaman berubah.
  useEffect(() => {
    const id = ++requestId.current;
    const delay = setTimeout(async () => {
      setLoading(true);
      setError(null);
      const res = await searchCatalog({
        q: filters.q || undefined,
        type: filters.type || undefined,
        min: filters.min ? Number(filters.min) : undefined,
        max: filters.max ? Number(filters.max) : undefined,
        facilityIds: filters.facilities.length ? filters.facilities : undefined,
        status: filters.status || undefined,
        sort,
        page,
      });
      if (id !== requestId.current) return; // abaikan respons lama
      if (!res.ok || !res.data) {
        setError(res.message ?? "Gagal memuat properti");
      } else {
        const d = res.data;
        setData(d);
        setItems((prev) => (d.page === 1 ? d.items : [...prev, ...d.items]));
        if (d.page === 1) setSig(JSON.stringify([filters, sort]));
      }
      setLoading(false);
    }, 250);
    return () => clearTimeout(delay);
  }, [filters, sort, page, retry]);

  const changeFilters = (next: Filters) => {
    setPage(1);
    setFilters(next);
  };
  const reset = () => changeFilters(DEFAULT_FILTERS);

  const savedIds = new Set(data?.savedIds ?? []);
  const hasMore = data ? items.length < data.total : false;
  const firstLoad = loading && items.length === 0;
  const activeCount =
    (filters.type ? 1 : 0) +
    (filters.min || filters.max ? 1 : 0) +
    (filters.status ? 1 : 0) +
    filters.facilities.length;

  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-5 pb-8 pt-14">
          <CatalogHeading />
          <div className="mt-8 max-w-2xl">
            <SearchBar compact query={filters.q} onQueryChange={(q) => changeFilters({ ...filters, q })} />
          </div>
          <div className="-mx-5 mt-6 overflow-x-auto px-5">
            <div className="flex w-max gap-2" role="group" aria-label="Tipe properti">
              {["", ...PROPERTY_TYPES].map((t) => {
                const on = filters.type === t;
                return (
                  <button
                    key={t || "all"}
                    type="button"
                    aria-pressed={on}
                    onClick={() => changeFilters({ ...filters, type: t })}
                    className={cn(
                      "relative whitespace-nowrap rounded-md border-2 px-4 py-2 text-sm font-bold shadow-brut-sm transition-all duration-150 hover:-translate-y-0.5",
                      on ? "border-ink text-white" : "border-ink bg-white text-ink hover:bg-accent-100",
                    )}
                  >
                    {on && (
                      <motion.span
                        layoutId="type-pill"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        className="absolute inset-0 -z-0 rounded-md bg-brand-700"
                        aria-hidden
                      />
                    )}
                    <span className="relative">{t || "Semua"}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid grid-cols-[minmax(0,1fr)] max-w-6xl gap-12 px-5 py-10 lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <FilterPanel filters={filters} onChange={changeFilters} onReset={reset} facilities={data?.facilities ?? []} />
          </div>
        </aside>

        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <p className="tnum text-sm text-muted" aria-live="polite">
              {firstLoad ? (
                "Memuat…"
              ) : data ? (
                <>
                  <motion.strong
                    key={data.total}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block font-display text-2xl font-normal text-ink"
                  >
                    {data.total}
                  </motion.strong>{" "}
                  properti ditemukan
                </>
              ) : (
                ""
              )}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => setPanelOpen(true)} className={cn(btnOutline, "px-4 py-2.5 lg:hidden")}>
                <SlidersHorizontal className="h-4 w-4" /> Saring
                {activeCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-xs text-brand-900">
                    {activeCount}
                  </span>
                )}
              </button>
              <div className="flex overflow-hidden rounded-md border-2 border-ink text-sm shadow-brut-sm" role="group" aria-label="Urutkan">
                {SORTS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    aria-pressed={sort === s.value}
                    onClick={() => {
                      setPage(1);
                      setSort(s.value);
                    }}
                    className={cn(
                      "relative border-r-2 border-ink px-3.5 py-2.5 font-bold transition-colors duration-300 last:border-r-0",
                      sort === s.value ? "text-white" : "bg-white text-muted hover:bg-brand-50",
                    )}
                  >
                    {sort === s.value && (
                      <motion.span
                        layoutId="sort-pill"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        className="absolute inset-0 bg-brand-700"
                        aria-hidden
                      />
                    )}
                    <span className="relative">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {firstLoad ? (
            <PropertyGridSkeleton />
          ) : error ? (
            <EmptyState
              icon={<AlertTriangle className="h-6 w-6" />}
              title="Properti tidak dapat dimuat"
              description={error}
              action={
                <button onClick={() => setRetry((n) => n + 1)} className={btnPrimary}>
                  Coba lagi
                </button>
              }
            />
          ) : items.length === 0 ? (
            <EmptyState
              title="Belum ada properti yang cocok"
              description="Coba ubah kata kunci atau longgarkan filter harga dan fasilitas."
              action={
                <button onClick={reset} className={btnPrimary}>
                  Atur ulang filter
                </button>
              }
            />
          ) : (
            <>
              <div className={cn("transition-opacity duration-300", loading && "opacity-60")}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={sig}
                    className="space-y-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -12, transition: { duration: 0.16 } }}
                    transition={{ duration: 0.2 }}
                  >
                    {items.map((p, i) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 28, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.45, delay: Math.min(i % 9, 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <PropertyRow property={p} saved={savedIds.has(p.id)} />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
              {hasMore && (
                <div className="mt-10 text-center">
                  <button type="button" disabled={loading} onClick={() => setPage((n) => n + 1)} className={btnOutline + " px-8"}>
                    {loading ? "Memuat…" : "Muat lebih banyak"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {panelOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden" role="dialog" aria-modal="true" aria-label="Saring properti">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <span className="font-display text-xl text-ink">Saring</span>
            <button onClick={() => setPanelOpen(false)} aria-label="Tutup filter" className="rounded-md p-2 hover:bg-brand-50">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <FilterPanel filters={filters} onChange={changeFilters} onReset={reset} facilities={data?.facilities ?? []} />
          </div>
          <div className="border-t border-line p-4">
            <button onClick={() => setPanelOpen(false)} className={btnPrimary + " w-full"}>
              Tampilkan {data?.total ?? 0} properti
            </button>
          </div>
        </div>
      )}
    </>
  );
}
