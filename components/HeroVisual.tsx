"use client";

import { motion } from "framer-motion";
import PropertyImage from "@/components/PropertyImage";
import { IconCalendar, IconShield, IconTag, type IconComponent } from "@/components/icons";

const ease = [0.22, 1, 0.36, 1] as const;

const chips: Array<{ icon: IconComponent; label: string; pos: string; delay: number; cls: string }> = [
  { icon: IconCalendar, label: "Survei gratis", pos: "-left-3 top-8 sm:-left-8", delay: 0.7, cls: "float-slow" },
  { icon: IconTag, label: "Harga transparan", pos: "right-3 top-1/2 sm:right-5", delay: 0.85, cls: "float-slower" },
  { icon: IconShield, label: "Terverifikasi", pos: "bottom-6 left-4 sm:left-10", delay: 1, cls: "float-slow" },
];

/** Foto hero: muncul halus, dengan tiga chip kecil. Sengaja ringan (tanpa parallax). */
export default function HeroVisual({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative">
      <motion.div
        className="aspect-[16/10] overflow-hidden rounded-md border-2 border-ink bg-brand-100 shadow-brut"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease }}
      >
        <PropertyImage src={src} alt={alt} seed={2} view={0} />
      </motion.div>

      <span className="absolute -left-2 -top-2 h-5 w-5 border-l-2 border-t-2 border-accent-500" aria-hidden />
      <span className="absolute -bottom-2 -right-2 h-5 w-5 border-b-2 border-r-2 border-accent-500" aria-hidden />

      {chips.map((c) => (
        <motion.div
          key={c.label}
          className={`absolute ${c.pos}`}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: c.delay, duration: 0.4, ease }}
        >
          <div className={`${c.cls} flex items-center gap-2.5 rounded-md border-2 border-ink bg-white py-2 pl-2 pr-4 shadow-brut-sm`}>
            <span className="flex size-9 items-center justify-center rounded border-2 border-ink bg-brand-50 text-brand-800">
              <c.icon size={22} />
            </span>
            <span className="text-sm font-bold text-ink">{c.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
