"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import Logo from "./Logo";
import BottomNavBar, { type BottomNavItem } from "@/components/ui/bottom-nav-bar";
import { IconChat, IconClipboard, IconHome, IconSearch } from "@/components/icons";
import { cn } from "@/lib/utils";

// Urutan: Beranda, Cara Kerja, Cari Properti, Bantuan.
const items: BottomNavItem[] = [
  { label: "Beranda", icon: IconHome, href: "/" },
  { label: "Cara Kerja", icon: IconClipboard, href: "/cara-kerja" },
  { label: "Cari Properti", icon: IconSearch, href: "/properties" },
  { label: "Bantuan", icon: IconChat, href: "/bantuan" },
];

const isActive = (href: string, pathname: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

/**
 * Navbar atas: logo di kiri, menu berbentuk pil di tengah (desktop), akun di kanan.
 * Di layar kecil menu pindah ke bar bawah (MobileNav).
 * Ringan: hanya transisi CSS + satu garis progres berbasis transform.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeIndex = items.findIndex((i) => isActive(i.href!, pathname));

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b-2 transition-colors duration-200",
        scrolled ? "border-ink bg-paper" : "border-transparent bg-white",
      )}
    >
      <div
        className={cn(
          "relative mx-auto flex max-w-6xl items-center justify-between px-4 transition-[padding] duration-200 sm:px-5",
          scrolled ? "py-2" : "py-3.5",
        )}
      >
        <Logo priority className={cn("transition-[height] duration-200", scrolled ? "h-7" : "h-8 sm:h-9")} />

        {/* Pil menu di tengah (desktop) */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <BottomNavBar
            items={items}
            activeIndex={activeIndex}
            labelWidth={104}
            expandOnHover
            ariaLabel="Navigasi utama"
            className="min-w-0"
          />
        </div>

      </div>

      {/* Progres scroll halaman */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="absolute inset-x-0 bottom-[-2px] h-[3px] origin-left bg-accent-500"
        aria-hidden
      />
    </header>
  );
}
