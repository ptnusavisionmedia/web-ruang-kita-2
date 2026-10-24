"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export const PRICE_MIN = 0;
export const PRICE_MAX = 10_000_000;
export const PRICE_STEP = 100_000;

/** 1500000 -> "Rp 1,5 jt"; nilai batas atas ditandai "+" . */
export function formatCompact(v: number, isMax = false) {
  if (v <= 0) return "Rp 0";
  const jt = v / 1_000_000;
  const text = Number.isInteger(jt) ? String(jt) : jt.toFixed(1).replace(".", ",");
  return `Rp ${text} jt${isMax && v >= PRICE_MAX ? "+" : ""}`;
}

/**
 * Slider rentang harga dua pegangan: tarik ke kanan = makin mahal.
 * Memakai dua <input type="range"> asli sehingga bisa dipakai dengan sentuh dan keyboard.
 */
export default function PriceRange({
  value,
  onChange,
  className,
}: {
  value: [number, number];
  onChange: (v: [number, number]) => void;
  className?: string;
}) {
  const id = useId();
  const [lo, hi] = value;
  const pct = (v: number) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <div className={cn("select-none", className)}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Minimum</p>
          <output htmlFor={`${id}-lo`} className="tnum text-lg font-bold text-ink">
            {formatCompact(lo)}
          </output>
        </div>
        <span className="mb-1.5 h-0.5 w-5 bg-ink" aria-hidden />
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Maksimum</p>
          <output htmlFor={`${id}-hi`} className="tnum text-lg font-bold text-ink">
            {formatCompact(hi, true)}
          </output>
        </div>
      </div>

      <div className="relative mt-4 h-7">
        {/* jalur */}
        <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 rounded-full border-2 border-ink bg-white" />
        <div
          className="absolute top-1/2 h-3 -translate-y-1/2 border-y-2 border-ink bg-accent-500 transition-[left,right] duration-75"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          id={`${id}-lo`}
          type="range"
          className={cn("range-thumb", lo > PRICE_MAX - PRICE_STEP * 5 && "z-20")}
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={lo}
          aria-label="Harga minimum per bulan"
          aria-valuetext={formatCompact(lo)}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi - PRICE_STEP), hi])}
        />
        <input
          id={`${id}-hi`}
          type="range"
          className="range-thumb z-10"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={hi}
          aria-label="Harga maksimum per bulan"
          aria-valuetext={formatCompact(hi, true)}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + PRICE_STEP)])}
        />
      </div>

      <div className="mt-1 flex justify-between text-[10px] font-semibold text-muted" aria-hidden>
        <span>0</span>
        <span>2,5 jt</span>
        <span>5 jt</span>
        <span>7,5 jt</span>
        <span>10 jt+</span>
      </div>
    </div>
  );
}
