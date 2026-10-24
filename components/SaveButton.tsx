"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import { IconBookmark } from "@/components/icons";
import { toggleSavedProperty } from "@/app/actions/properties";
import { useToast } from "./Toast";

export default function SaveButton({
  propertyId,
  initialSaved = false,
  variant = "button",
}: {
  propertyId: string;
  initialSaved?: boolean;
  variant?: "button" | "icon" | "icon-outline";
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  function onClick() {
    startTransition(async () => {
      const res = await toggleSavedProperty(propertyId);
      if (res.message === "UNAUTHENTICATED") {
        toast("Masuk dulu untuk menyimpan properti", "info");
        router.push(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }
      if (!res.ok || !res.data) {
        toast(res.message ?? "Gagal memperbarui simpanan", "info");
        return;
      }
      setSaved(res.data.saved);
      toast(res.data.saved ? "Properti disimpan" : "Properti dihapus dari simpanan", res.data.saved ? "success" : "info");
      router.refresh();
    });
  }

  if (variant === "icon-outline") {
    return (
      <motion.button
        whileTap={{ scale: 0.88 }}
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-pressed={saved}
        aria-label={saved ? "Hapus dari simpanan" : "Simpan properti"}
        className="flex h-11 w-11 items-center justify-center rounded-md border-2 border-ink bg-white text-ink shadow-brut-sm transition-all hover:-translate-y-0.5 hover:bg-accent-200 disabled:opacity-60"
      >
        <motion.span key={String(saved)} initial={{ scale: 0.4, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 520, damping: 14 }} className="flex"><IconBookmark size={20} filled={saved} /></motion.span>
      </motion.button>
    );
  }

  if (variant === "icon") {
    return (
      <motion.button
        whileTap={{ scale: 0.88 }}
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-pressed={saved}
        aria-label={saved ? "Hapus dari simpanan" : "Simpan properti"}
        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-white text-ink shadow-brut-sm hover:bg-accent-200 disabled:opacity-60"
      >
        <motion.span key={String(saved)} initial={{ scale: 0.4, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 520, damping: 14 }} className="flex"><IconBookmark size={20} filled={saved} /></motion.span>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={saved}
      className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-brand-700/30 px-6 py-3 text-sm font-semibold text-brand-800 transition-colors hover:border-brand-700 hover:bg-brand-50 disabled:opacity-60"
    >
      <motion.span key={String(saved)} initial={{ scale: 0.4, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 520, damping: 14 }} className="flex"><IconBookmark size={20} filled={saved} /></motion.span>
      {saved ? "Tersimpan" : "Simpan Properti"}
    </motion.button>
  );
}
