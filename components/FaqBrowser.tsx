"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Faq {
  category: string;
  q: string;
  a: string;
}

/** Pencarian + kategori + akordion untuk halaman Bantuan. */
export default function FaqBrowser({ faqs, categories }: { faqs: Faq[]; categories: string[] }) {
  const [category, setCategory] = useState<string>("Semua");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(faqs[0]?.q ?? null);

  const counts = useMemo(() => {
    const m: Record<string, number> = { Semua: faqs.length };
    for (const f of faqs) m[f.category] = (m[f.category] ?? 0) + 1;
    return m;
  }, [faqs]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter(
      (f) => (category === "Semua" || f.category === category) && (!q || `${f.q} ${f.a}`.toLowerCase().includes(q)),
    );
  }, [faqs, category, query]);

  return (
    <div>
      <label className="flex items-center gap-3 rounded-md border border-ink/20 bg-white px-5 py-4 transition-colors focus-within:border-brand-700 focus-within:ring-4 focus-within:ring-brand-100">
        <Search className="size-5 text-brand-700" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari pertanyaan, mis. survei, bayar, batal"
          aria-label="Cari di pusat bantuan"
          className="w-full bg-transparent text-base text-ink outline-none placeholder:text-muted/70"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="Hapus pencarian" className="rounded p-1 text-muted hover:text-ink">
            <X className="size-4" />
          </button>
        )}
      </label>

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Kategori</p>
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0" role="group" aria-label="Kategori bantuan">
            {["Semua", ...categories].map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={cn(
                  "relative flex shrink-0 items-center justify-between gap-4 whitespace-nowrap rounded-md border px-4 py-2.5 text-sm font-medium transition-colors duration-300 lg:rounded-none lg:border-0 lg:border-l-2 lg:border-l-line lg:px-4 lg:hover:pl-5",
                  category === c
                    ? "border-brand-700 bg-brand-700 text-white lg:bg-transparent lg:text-brand-800"
                    : "border-line bg-white text-muted hover:text-ink lg:bg-transparent",
                )}
              >
                {category === c && (
                  <motion.span
                    layoutId="faq-cat"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    className="absolute -left-0.5 inset-y-0 w-0.5 bg-accent-500 max-lg:hidden"
                    aria-hidden
                  />
                )}
                {c}
                <span className="tnum text-xs opacity-70">{counts[c] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        <div aria-live="polite">
          {shown.length === 0 ? (
            <div className="rounded-md border border-dashed border-ink/25 p-10 text-center">
              <p className="font-display text-2xl text-ink">Tidak ada hasil</p>
              <p className="mt-2 text-sm text-muted">Coba kata kunci lain atau pilih kategori Semua.</p>
            </div>
          ) : (
            <ul className="divide-y-2 divide-ink border-y-2 border-ink">
              <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((f) => {
                const isOpen = open === f.q;
                return (
                  <motion.li
                    key={f.q}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : f.q)}
                      className="group flex w-full items-start justify-between gap-6 py-6 text-left transition-all duration-300 hover:pl-2"
                    >
                      <span>
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-700">{f.category}</span>
                        <span className="mt-1.5 block text-lg font-medium text-ink">{f.q}</span>
                      </span>
                      <Plus className={cn("mt-1 size-5 shrink-0 text-brand-700 transition-transform duration-300", isOpen && "rotate-45")} />
                    </button>
                    <div className={cn("grid transition-[grid-template-rows] duration-300", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pb-6 leading-relaxed text-muted">{f.a}</p>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
