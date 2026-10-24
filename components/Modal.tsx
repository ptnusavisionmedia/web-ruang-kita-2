"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { btnOutline, btnPrimary } from "@/lib/ui";

export default function Modal({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = "Lanjutkan",
  cancelLabel = "Batal",
  loading = false,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !loading && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-brand-900/50 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => !loading && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="w-full max-w-md rounded-lg border-2 border-ink bg-white p-7 shadow-brut-lg"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mb-4 block h-1 w-10 rounded-full bg-accent-500" aria-hidden />
            <h2 className="font-display text-3xl text-ink">{title}</h2>
            <div className="mt-3 text-sm leading-relaxed text-muted">{children}</div>
            <div className="mt-7 flex justify-end gap-3">
              <button type="button" onClick={onClose} disabled={loading} className={btnOutline}>
                {cancelLabel}
              </button>
              <button type="button" onClick={onConfirm} disabled={loading} className={btnPrimary}>
                {loading ? "Memproses…" : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
