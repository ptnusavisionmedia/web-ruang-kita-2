"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  return (
    <motion.button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.92 }}
      className="group inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-accent-500 hover:text-white"
    >
      Kembali ke atas
      <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1" />
    </motion.button>
  );
}
