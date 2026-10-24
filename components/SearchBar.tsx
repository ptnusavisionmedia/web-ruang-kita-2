"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { IconBuilding, IconPin, IconSearch, IconWallet, type IconComponent } from "@/components/icons";
import PriceRange, { PRICE_MAX, PRICE_MIN, formatCompact } from "@/components/ui/price-range";
import Select, { Popover, useDismiss } from "@/components/ui/select";
import { PROPERTY_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const TYPE_OPTIONS = [{ value: "", label: "Semua tipe" }, ...PROPERTY_TYPES.map((t) => ({ value: t, label: t }))];

const PRESETS: Array<{ label: string; range: [number, number] }> = [
  { label: "Semua", range: [PRICE_MIN, PRICE_MAX] },
  { label: "< 1,5 jt", range: [0, 1_500_000] },
  { label: "1,5 – 3 jt", range: [1_500_000, 3_000_000] },
  { label: "3 – 6 jt", range: [3_000_000, 6_000_000] },
  { label: "> 6 jt", range: [6_000_000, PRICE_MAX] },
];

const control =
  "w-full bg-transparent text-[15px] font-bold text-ink outline-none placeholder:font-normal placeholder:text-muted/70";

/** Satu kolom pencarian: kotak ikon, label kecil, isian. Garis emas tumbuh saat fokus. */
function Field({
  icon: Icon,
  label,
  children,
  className,
}: {
  icon: IconComponent;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative flex items-center gap-3.5 border-b-2 border-ink px-5 py-4 transition-colors duration-200 hover:bg-paper focus-within:bg-paper md:border-b-0 md:border-r-2",
        className,
      )}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-md border-2 border-ink bg-brand-50 text-brand-800 transition-colors duration-200 group-focus-within:bg-brand-700 group-focus-within:text-white">
        <Icon size={24} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{label}</span>
        {children}
      </div>
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-accent-500 transition-transform duration-300 ease-out group-focus-within:scale-x-100" />
    </div>
  );
}

/** Dropdown harga: ringkasan di tombol, slider dua pegangan di panel. */
function PriceField({ value, onChange }: { value: [number, number]; onChange: (v: [number, number]) => void }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss<HTMLDivElement>(open, close);
  const [lo, hi] = value;
  const isAll = lo <= PRICE_MIN && hi >= PRICE_MAX;
  const summary = isAll ? "Semua harga" : `${formatCompact(lo)} – ${formatCompact(hi, true)}`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full cursor-pointer items-center justify-between gap-3 text-left text-[15px] font-bold text-ink outline-none"
      >
        <span className="tnum truncate">{summary}</span>
        <ChevronDown className={cn("size-4 shrink-0 transition-transform duration-300", open && "rotate-180")} />
      </button>

      <Popover open={open} align="left" className="w-[min(88vw,22rem)] -translate-x-2 p-5">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-muted">Rentang harga / bulan</p>
        <PriceRange value={value} onChange={onChange} />
        <div className="mt-5 flex flex-wrap gap-1.5">
          {PRESETS.map((p) => {
            const on = lo === p.range[0] && hi === p.range[1];
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => onChange(p.range)}
                className={cn(
                  "rounded border-2 border-ink px-2.5 py-1 text-xs font-bold transition-all duration-150 hover:-translate-y-0.5",
                  on ? "bg-brand-700 text-white" : "bg-white text-ink hover:bg-accent-100",
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={close}
          className="mt-5 w-full rounded-md border-2 border-ink bg-accent-500 py-2.5 text-sm font-bold text-ink shadow-brut-sm transition-all hover:-translate-y-0.5 hover:shadow-brut active:translate-y-0.5 active:shadow-none"
        >
          Selesai
        </button>
      </Popover>
    </div>
  );
}

/** Mode compact: pencarian teks untuk katalog. Mode default: kotak pencarian besar di hero. */
export default function SearchBar({
  compact = false,
  query,
  onQueryChange,
}: {
  compact?: boolean;
  query?: string;
  onQueryChange?: (v: string) => void;
}) {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [range, setRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);

  if (compact) {
    return (
      <label className="flex items-center gap-3 rounded-md border-2 border-ink bg-white px-5 py-3.5 shadow-brut-sm transition-all focus-within:-translate-y-px focus-within:shadow-brut">
        <IconSearch size={22} className="text-brand-700" />
        <input
          type="search"
          value={query ?? ""}
          onChange={(e) => onQueryChange?.(e.target.value)}
          placeholder="Cari nama properti, kota, atau area"
          className={control}
          aria-label="Cari properti"
        />
      </label>
    );
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("q", location.trim());
    if (type) params.set("type", type);
    if (range[0] > PRICE_MIN) params.set("min", String(range[0]));
    if (range[1] < PRICE_MAX) params.set("max", String(range[1]));
    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : "/properties");
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      role="search"
      aria-label="Cari properti"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 grid rounded-lg border-2 border-ink bg-white shadow-brut md:grid-cols-[1.25fr_1fr_1.1fr_auto]"
    >
      <Field icon={IconPin} label="Lokasi" className="rounded-t-md md:rounded-l-md md:rounded-tr-none">
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Kota atau area"
          autoComplete="off"
          className={control}
        />
      </Field>

      <Field icon={IconBuilding} label="Tipe">
        <Select value={type} onChange={setType} options={TYPE_OPTIONS} ariaLabel="Tipe properti" minPanelWidth={190} />
      </Field>

      <Field icon={IconWallet} label="Harga / bulan">
        <PriceField value={range} onChange={setRange} />
      </Field>

      <button
        type="submit"
        className="group flex items-center justify-center gap-2.5 rounded-b-md bg-brand-700 px-9 py-5 text-sm font-bold text-white transition-colors duration-150 hover:bg-brand-600 active:bg-brand-800 md:rounded-b-none md:rounded-r-md"
      >
        <IconSearch size={22} className="text-white transition-transform duration-300 group-hover:scale-110" />
        Cari Kamar
      </button>
    </motion.form>
  );
}
