"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconBookmark, IconCalendar, IconHome, IconReceipt, IconUser, IconWallet } from "@/components/icons";
import { cn } from "@/lib/utils";

const nav = [
  { id: "ringkasan", label: "Ringkasan", icon: IconHome },
  { id: "survei", label: "Jadwal survei", icon: IconCalendar },
  { id: "pembayaran", label: "Pembayaran", icon: IconWallet },
  { id: "tersimpan", label: "Tersimpan", icon: IconBookmark },
  { id: "riwayat", label: "Riwayat", icon: IconReceipt },
  { id: "profil", label: "Profil", icon: IconUser },
];

/** Menu samping dengan penanda bagian aktif (scrollspy) yang meluncur. */
export default function DashboardNav() {
  const [active, setActive] = useState("ringkasan");

  useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="mt-7 space-y-1 border-t border-white/10 pt-6" aria-label="Menu dashboard">
      {nav.map((n) => {
        const on = active === n.id;
        return (
          <a
            key={n.id}
            href={`#${n.id}`}
            aria-current={on ? "true" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors duration-300",
              on ? "text-white" : "text-white/65 hover:text-white",
            )}
          >
            {on && (
              <motion.span
                layoutId="dash-nav"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-md bg-white/10"
                aria-hidden
              />
            )}
            {on && <motion.span layoutId="dash-nav-bar" className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-accent-500" aria-hidden />}
            <n.icon size={22} className="relative text-white transition-transform duration-300 group-hover:scale-110" />
            <span className="relative">{n.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
