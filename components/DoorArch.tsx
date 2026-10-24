"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Motif dekoratif: lengkung pintu berlapis (diambil dari pintu emas pada logo).
 * Garisnya "digambar" saat masuk layar, lalu pintu emas naik mengisi.
 * Hanya hiasan, disembunyikan dari pembaca layar.
 */
export default function DoorArch({
  className,
  stroke = "currentColor",
  accent = "#d2a34f",
}: {
  className?: string;
  stroke?: string;
  accent?: string;
}) {
  return (
    <svg viewBox="0 0 400 520" fill="none" className={cn("pointer-events-none", className)} aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <motion.path
          key={i}
          d={`M${40 + i * 34} 500V${220 + i * 22}a${160 - i * 34} ${160 - i * 34} 0 0 1 ${320 - i * 68} 0V500`}
          stroke={stroke}
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.22 + i * 0.1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      <motion.path
        d="M176 500V300a24 24 0 0 1 48 0V500Z"
        fill={accent}
        style={{ transformOrigin: "200px 500px" }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.path
        d="M20 500H380"
        stroke={stroke}
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        opacity={0.4}
      />
    </svg>
  );
}
