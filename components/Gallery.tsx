"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import PropertyImage from "./PropertyImage";
import { cn } from "@/lib/utils";

/** Mosaik foto (1 besar + 4 kecil) dengan lightbox layar penuh. */
export default function Gallery({ images, seed, name }: { images: string[]; seed: number; name: string }) {
  const n = Math.max(1, images.length);
  const slots = Array.from({ length: n }, (_, i) => images[i] ?? null);

  // Mosaik menyesuaikan jumlah foto agar tidak ada kotak kosong.
  const spanFor = (i: number) => {
    if (i === 0) return n === 1 ? "col-span-4 row-span-2" : "col-span-4 row-span-2 sm:col-span-2";
    const base = "hidden sm:block";
    if (n === 2) return base + " sm:col-span-2 sm:row-span-2";
    if (n === 3) return base + " sm:col-span-2";
    if (n === 4 && i === 3) return base + " sm:col-span-2";
    return base;
  };
  const [open, setOpen] = useState<number | null>(null);
  const [dir, setDir] = useState(1);

  const go = useCallback(
    (d: number) => {
      setDir(d);
      setOpen((i) => (i === null ? i : (i + d + slots.length) % slots.length));
    },
    [slots.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go]);

  return (
    <>
      <div className="relative">
        <div className="grid h-[320px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-md sm:h-[440px]">
          {slots.slice(0, 5).map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Buka foto ${i + 1} dari ${name}`}
              className={cn("group relative overflow-hidden bg-brand-50", spanFor(i))}
            >
              <PropertyImage
                src={src}
                alt={`${name} — foto ${i + 1}`}
                seed={seed}
                view={i}
                className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setOpen(0)}
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-md border-2 border-ink bg-white px-4 py-2.5 text-sm font-bold text-ink shadow-brut-sm transition-all hover:-translate-y-0.5 hover:bg-accent-200"
        >
          <Images className="h-4 w-4 text-brand-700" />
          {n > 1 ? "Lihat semua foto" : "Perbesar foto"}
        </button>
      </div>

      <AnimatePresence>
      {open !== null && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col bg-brand-900/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Galeri ${name}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center justify-between px-5 py-4 text-white">
            <p className="tnum text-sm text-white/80">
              {name} · {open + 1} / {slots.length}
            </p>
            <button onClick={() => setOpen(null)} aria-label="Tutup galeri" className="rounded-full p-2 hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16">
            <button onClick={() => go(-1)} aria-label="Foto sebelumnya" className="absolute left-2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:left-6">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="relative aspect-[3/2] max-h-full w-full max-w-4xl overflow-hidden rounded-md">
              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.div
                  key={open}
                  custom={dir}
                  className="absolute inset-0"
                  initial={{ opacity: 0, x: dir * 80, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: dir * -80 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -70) go(1);
                    else if (info.offset.x > 70) go(-1);
                  }}
                >
                  <PropertyImage src={slots[open]} alt={`${name} — foto ${open + 1}`} seed={seed} view={open} />
                </motion.div>
              </AnimatePresence>
            </div>
            <button onClick={() => go(1)} aria-label="Foto berikutnya" className="absolute right-2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:right-6">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          <div className="flex justify-center gap-2 overflow-x-auto px-5 py-5">
            {slots.map((src, i) => (
              <button
                key={i}
                onClick={() => {
                  setDir(i > (open ?? 0) ? 1 : -1);
                  setOpen(i);
                }}
                aria-label={`Foto ${i + 1}`}
                aria-current={open === i}
                className={cn(
                  "h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-opacity",
                  open === i ? "border-accent-500" : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <PropertyImage src={src} alt="" seed={seed} view={i} />
              </button>
            ))}
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
