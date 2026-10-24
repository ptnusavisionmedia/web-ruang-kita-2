"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  /** Teks kecil di kanan (mis. harga). */
  hint?: string;
}

/** Tutup panel saat klik di luar atau menekan Escape. */
export function useDismiss<T extends HTMLElement>(open: boolean, close: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return ref;
}

/** Panel mengambang bergaya neo-brutal dengan animasi muncul. */
export function Popover({ open, children, className, align = "left" }: { open: boolean; children: ReactNode; className?: string; align?: "left" | "right" }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.12 } }}
          transition={{ type: "spring", stiffness: 520, damping: 34 }}
          style={{ transformOrigin: align === "left" ? "top left" : "top right" }}
          className={cn(
            "absolute top-full z-50 mt-2 rounded-md border-2 border-ink bg-white shadow-brut",
            align === "left" ? "left-0" : "right-0",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Dropdown kustom: dapat dipakai dengan mouse, sentuh, dan keyboard
 * (↑ ↓ Home End Enter Spasi Esc). Menggantikan <select> bawaan browser.
 */
export default function Select({
  value,
  onChange,
  options,
  ariaLabel,
  className,
  triggerClassName,
  minPanelWidth,
}: {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  ariaLabel: string;
  className?: string;
  triggerClassName?: string;
  minPanelWidth?: number;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const close = useCallback(() => setOpen(false), []);
  const wrapRef = useDismiss<HTMLDivElement>(open, close);
  const listId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];

  function openList() {
    setActive(selectedIndex);
    setOpen(true);
  }

  function choose(i: number) {
    onChange(options[i].value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(options.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(active);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          "group flex w-full cursor-pointer items-center justify-between gap-3 text-left text-[15px] font-bold text-ink outline-none",
          triggerClassName,
        )}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-ink transition-transform duration-300", open && "rotate-180")} />
      </button>

      <Popover open={open} className="min-w-full overflow-hidden p-1.5" align="left">
        <ul id={listId} role="listbox" aria-label={ariaLabel} className="max-h-72 overflow-y-auto" style={{ minWidth: minPanelWidth }}>
          {options.map((o, i) => {
            const isSel = o.value === value;
            const isActive = i === active;
            return (
              <motion.li
                key={o.value}
                role="option"
                aria-selected={isSel}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.025, duration: 0.18 }}
                onMouseEnter={() => setActive(i)}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => choose(i)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-4 whitespace-nowrap rounded px-3 py-2.5 text-sm font-semibold transition-colors duration-100",
                  isSel ? "bg-brand-700 text-white" : isActive ? "bg-accent-200 text-ink" : "text-ink",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                      isSel ? "scale-100 border-white bg-accent-500 text-ink" : "scale-75 border-transparent opacity-0",
                    )}
                  >
                    <Check className="size-3" strokeWidth={3.5} />
                  </span>
                  {o.label}
                </span>
                {o.hint && <span className={cn("tnum text-xs font-medium", isSel ? "text-white/80" : "text-muted")}>{o.hint}</span>}
              </motion.li>
            );
          })}
        </ul>
      </Popover>
    </div>
  );
}
