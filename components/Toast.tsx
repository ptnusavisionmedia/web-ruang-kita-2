"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X } from "lucide-react";

type ToastKind = "success" | "info";
interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

const ToastContext = createContext<(message: string, kind?: ToastKind) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message: string, kind: ToastKind = "success") => {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev.slice(-2), { id, message, kind }]);
      setTimeout(() => dismiss(id), 3800);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-6"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {items.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="pointer-events-auto relative flex max-w-sm items-center gap-3 overflow-hidden rounded-md border-2 border-ink bg-brand-900 px-4 py-3 text-sm text-white shadow-brut-sm"
            >
              <motion.span
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 500, damping: 18 }}
                className="flex"
              >
                {t.kind === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-400" />
                ) : (
                  <Info className="h-4 w-4 shrink-0 text-accent-400" />
                )}
              </motion.span>
              <span>{t.message}</span>
              <button type="button" onClick={() => dismiss(t.id)} aria-label="Tutup notifikasi" className="text-white/60 transition-colors hover:text-white">
                <X className="h-4 w-4" />
              </button>
              <motion.span
                className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-accent-500"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3.8, ease: "linear" }}
                aria-hidden
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
