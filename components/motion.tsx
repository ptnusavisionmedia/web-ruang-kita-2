"use client";

import { animate, motion, useInView, useMotionValue, useScroll, useSpring } from "framer-motion";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { formatRupiah } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Pola "muncul saat masuk layar" yang AMAN: konten selalu terlihat secara default.
 * Elemen baru disembunyikan hanya jika saat dipasang berada jauh di bawah layar,
 * lalu dimunculkan ketika terlihat. Jika animasi/JS gagal, konten tetap terbaca.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [armed, setArmed] = useState(false);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = requestAnimationFrame(() => {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.92) setArmed(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return { ref, hidden: armed && !inView };
}

/** Naik halus + muncul. */
export function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const { ref, hidden } = useReveal<HTMLDivElement>();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={hidden ? { opacity: 0, y } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: hidden ? 0 : delay, ease }}
    >
      {children}
    </motion.div>
  );
}

const StaggerContext = createContext(false);

/** Kontainer: anak-anaknya (StaggerItem) muncul bergantian saat kontainer terlihat. */
export function Stagger({ children, className, gap = 0.08 }: { children: ReactNode; className?: string; gap?: number }) {
  const { ref, hidden } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      <StaggerContext.Provider value={hidden}>
        {Children.map(children, (child, i) =>
          isValidElement(child) ? cloneElement(child as ReactElement<{ index?: number; gap?: number }>, { index: i, gap }) : child,
        )}
      </StaggerContext.Provider>
    </div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 20,
  index = 0,
  gap = 0.08,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  index?: number;
  gap?: number;
}) {
  const hidden = useContext(StaggerContext);
  return (
    <motion.div
      className={className}
      initial={false}
      animate={hidden ? { opacity: 0, y } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: hidden ? 0 : Math.min(index, 8) * gap, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Judul yang muncul kata demi kata (naik dari balik garis). Berjalan sekali saat dimuat. */
export function SplitWords({
  text,
  className,
  delay = 0,
  italicWords = [],
  italicClassName,
}: {
  text: string;
  className?: string;
  delay?: number;
  italicWords?: string[];
  italicClassName?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => {
        const italic = italicWords.includes(w.replace(/[.,]/g, ""));
        return (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom" aria-hidden>
            <motion.span
              className={`inline-block ${italic ? `italic ${italicClassName ?? ""}` : ""}`}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.65, delay: delay + i * 0.05, ease }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

/** Angka yang menghitung naik saat terlihat (nilai akhir sudah tampil bila animasi tidak jalan). */
export function CountUp({ to, duration = 1.2, className }: { to: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const value = useMotionValue(0);

  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const controls = animate(value, to, { duration, ease });
    const unsub = value.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toLocaleString("id-ID");
    });
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, to, duration, value]);

  return (
    <span ref={ref} className={className}>
      {to.toLocaleString("id-ID")}
    </span>
  );
}

/** Garis vertikal yang terisi mengikuti scroll di dalam bagian induknya. */
export function ScrollLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  return (
    <div ref={ref} className={className} aria-hidden>
      <motion.div className="h-full w-full origin-top bg-accent-500" style={{ scaleY }} />
    </div>
  );
}

/** Nominal rupiah yang bergulir halus saat nilainya berubah. */
export function AnimatedRupiah({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const spring = useSpring(value, { stiffness: 140, damping: 24, mass: 0.6 });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = formatRupiah(Math.round(v));
    });
    return unsub;
  }, [spring]);

  return (
    <span ref={ref} className={className}>
      {formatRupiah(value)}
    </span>
  );
}

/** Cap miring yang "dihentakkan" ke kertas. */
export function Stamp({ text, tone }: { text: string; tone: "paid" | "pending" }) {
  return (
    <motion.div
      className={
        "pointer-events-none absolute bottom-9 right-7 rounded-md border-[3px] px-4 py-1.5 font-display text-2xl tracking-widest " +
        (tone === "paid" ? "border-brand-700/70 text-brand-700/70" : "border-accent-600/80 text-accent-600/80")
      }
      initial={{ scale: 1.8, rotate: -2, opacity: 0 }}
      animate={{ scale: 1, rotate: -12, opacity: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.3 }}
      aria-hidden
    >
      {text}
    </motion.div>
  );
}
