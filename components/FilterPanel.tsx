"use client";

import { Check } from "lucide-react";
import PriceRange, { PRICE_MAX, PRICE_MIN } from "@/components/ui/price-range";
import Select from "@/components/ui/select";
import { PROPERTY_TYPES } from "@/lib/constants";
import type { Facility } from "@/types";
import { cn } from "@/lib/utils";

const TYPE_OPTIONS = [{ value: "", label: "Semua tipe" }, ...PROPERTY_TYPES.map((t) => ({ value: t, label: t }))];

export interface Filters {
  q: string;
  type: string;
  min: string;
  max: string;
  facilities: string[];
  status: "" | "Tersedia" | "Penuh";
}

export const DEFAULT_FILTERS: Filters = {
  q: "",
  type: "",
  min: "",
  max: "",
  facilities: [],
  status: "",
};

const STATUSES: Array<{ label: string; value: Filters["status"] }> = [
  { label: "Semua", value: "" },
  { label: "Tersedia", value: "Tersedia" },
  { label: "Penuh", value: "Penuh" },
];

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t-2 border-ink pt-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted">{title}</p>
      {children}
    </div>
  );
}

export default function FilterPanel({
  filters,
  onChange,
  onReset,
  facilities,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  onReset: () => void;
  facilities: Facility[];
}) {
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => onChange({ ...filters, [k]: v });

  function toggleFacility(id: string) {
    set(
      "facilities",
      filters.facilities.includes(id)
        ? filters.facilities.filter((f) => f !== id)
        : [...filters.facilities, id],
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-ink">Saring</h2>
        <button type="button" onClick={onReset} className="text-sm font-medium text-brand-700 underline-offset-4 hover:underline">
          Atur ulang
        </button>
      </div>

      <Group title="Tipe properti">
        <Select
          value={filters.type}
          onChange={(v) => set("type", v)}
          options={TYPE_OPTIONS}
          ariaLabel="Tipe properti"
          triggerClassName="rounded-md border-2 border-ink bg-white px-4 py-3.5 shadow-brut-sm transition-all hover:-translate-y-0.5 hover:bg-accent-100 focus-visible:ring-4 focus-visible:ring-brand-100"
        />
      </Group>

      <Group title="Harga per bulan">
        <PriceRange
          value={[filters.min ? Number(filters.min) : PRICE_MIN, filters.max ? Number(filters.max) : PRICE_MAX]}
          onChange={([lo, hi]) =>
            onChange({
              ...filters,
              min: lo <= PRICE_MIN ? "" : String(lo),
              max: hi >= PRICE_MAX ? "" : String(hi),
            })
          }
        />
      </Group>

      <Group title="Status kamar">
        <div className="grid grid-cols-3 overflow-hidden rounded-md border-2 border-ink text-sm shadow-brut-sm" role="group">
          {STATUSES.map((s) => (
            <button
              key={s.label}
              type="button"
              aria-pressed={filters.status === s.value}
              onClick={() => set("status", s.value)}
              className={cn(
                "border-r-2 border-ink py-2.5 font-bold transition-colors last:border-r-0",
                filters.status === s.value ? "bg-brand-700 text-white" : "bg-white text-ink hover:bg-accent-100",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Fasilitas">
        <ul className="space-y-1">
          {facilities.map(({ id, name }) => {
            const on = filters.facilities.includes(id);
            return (
              <li key={id}>
                <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-ink transition-colors hover:bg-brand-50">
                  <input type="checkbox" className="peer sr-only" checked={on} onChange={() => toggleFacility(id)} />
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-600",
                      on ? "border-brand-700 bg-brand-700 text-white" : "border-line bg-white",
                    )}
                  >
                    {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </span>
                  {name}
                </label>
              </li>
            );
          })}
        </ul>
      </Group>
    </div>
  );
}
