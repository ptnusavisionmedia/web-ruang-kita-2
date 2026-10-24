"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { LOGO_ASPECT, LOGO_SLICES } from "@/lib/logo-slices";

const TAGLINE = "Cari ruang. Temukan rumah.";
const PARTS = LOGO_SLICES.map((s) => s.name);

/**
 * Layar pembuka: simbol rumah memantul masuk, huruf-huruf "RuangKita" naik bergantian lalu
 * bergelombang, tagline muncul per huruf, bilah progres terisi, lalu layar terangkat.
 * Tampil setiap kali web dibuka pertama kali atau di-refresh (bukan saat pindah halaman).
 */
export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const percent = useRef<HTMLSpanElement>(null);
  const progress = useMotionValue(0);
  const fill = useTransform(progress, [0, 100], [0, 1]);

  // Mulai animasi langsung; gambar logo hanya dipanaskan di latar agar cepat tampil.
  useEffect(() => {
    PARTS.forEach((name) => {
      const img = new Image();
      img.src = `/splash/${name}.png`;
    });
  }, []);

  useEffect(() => {
    if (!show) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = reduce ? 0.6 : 2.4;
    const controls = animate(progress, 100, { duration: dur, ease: [0.45, 0, 0.2, 1] });
    const unsub = progress.on("change", (v) => {
      if (percent.current) percent.current.textContent = `${Math.round(v)}%`;
    });
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      setShow(false);
    }, (dur + 0.55) * 1000);
    return () => {
      controls.stop();
      unsub();
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, [show, progress]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          role="status"
          aria-label="Memuat RuangKita"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden border-b-4 border-ink bg-paper px-6"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="blueprint absolute inset-0" aria-hidden />

          {/* hiasan blok warna */}
          <motion.span
            className="absolute left-[8%] top-[16%] size-14 border-2 border-ink bg-accent-500 shadow-brut-sm"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 12 }}
            transition={{ type: "spring", stiffness: 260, damping: 14 }}
            aria-hidden
          />
          <motion.span
            className="absolute bottom-[18%] right-[9%] size-20 rounded-full border-2 border-ink bg-brand-700 shadow-brut-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 240, damping: 14 }}
            aria-hidden
          />

          <div className="relative flex w-full max-w-xl flex-col items-center">
            {/* stiker */}
            <motion.span
              className="mb-6 -rotate-3 border-2 border-ink bg-accent-500 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-ink shadow-brut-sm"
              initial={{ y: -30, opacity: 0, rotate: -12 }}
              animate={{ y: 0, opacity: 1, rotate: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 16 }}
            >
              Memuat
            </motion.span>

            {/* kartu logo */}
            <motion.div
              className="w-full border-2 border-ink bg-white p-6 shadow-brut sm:p-10"
              initial={{ y: 40, opacity: 0, rotate: 1.5 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative mx-auto w-full" style={{ aspectRatio: String(LOGO_ASPECT) }} aria-hidden>
                {LOGO_SLICES.map((s, i) => {
                  const isMark = s.name === "mark";
                  return (
                    <motion.div
                      key={s.name}
                      className="absolute top-0 h-full"
                      style={{ left: `${s.left}%`, width: `${s.width}%`, transformOrigin: "50% 100%" }}
                      initial={isMark ? { scale: 0, rotate: -25, opacity: 0 } : { y: "70%", opacity: 0, rotate: i % 2 ? 8 : -8 }}
                      animate={
                        isMark
                          ? { scale: 1, rotate: 0, opacity: 1 }
                          : { y: [null, "0%", "-6%", "0%"], opacity: 1, rotate: 0 }
                      }
                      transition={
                        isMark
                          ? { delay: 0.1, type: "spring", stiffness: 320, damping: 11 }
                          : { delay: 0.4 + i * 0.07, duration: 0.7, times: [0, 0.55, 0.8, 1], ease: "easeOut" }
                      }
                    >
                      {/* gelombang ringan setelah huruf terpasang */}
                      <motion.div
                        className="h-full w-full"
                        animate={{ y: ["0%", "-5%", "0%"] }}
                        transition={{ delay: 1.3 + i * 0.06, duration: 0.6, ease: "easeInOut", repeat: 1 }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/splash/${s.name}.png`} alt="" className="h-full w-full object-fill" draggable={false} />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* tagline per huruf */}
              <p className="mt-6 flex flex-wrap justify-center text-center font-display text-lg text-ink sm:text-xl" aria-hidden>
                {TAGLINE.split("").map((c, i) => (
                  <motion.span
                    key={i}
                    className="inline-block whitespace-pre"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + i * 0.03, duration: 0.3 }}
                  >
                    {c}
                  </motion.span>
                ))}
              </p>
            </motion.div>

            {/* progres */}
            <div className="mt-8 w-full max-w-sm">
              <div className="h-5 w-full border-2 border-ink bg-white shadow-brut-sm">
                <motion.div className="h-full origin-left bg-accent-500" style={{ scaleX: fill }} />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-ink">
                <span className="flex items-center gap-1">
                  Menyiapkan ruang
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                    >
                      .
                    </motion.span>
                  ))}
                </span>
                <span ref={percent} className="tnum">0%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
