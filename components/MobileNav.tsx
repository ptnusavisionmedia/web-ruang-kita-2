"use client";

import { usePathname } from "next/navigation";
import BottomNavBar, { type BottomNavItem } from "@/components/ui/bottom-nav-bar";
import { IconChat, IconClipboard, IconHome, IconSearch, IconUser } from "@/components/icons";

// Urutan sama dengan navbar atas: Beranda, Cara Kerja, Cari Properti, Bantuan (+ Akun).
const items: BottomNavItem[] = [
  { label: "Beranda", icon: IconHome, href: "/" },
  { label: "Cara", icon: IconClipboard, href: "/cara-kerja" },
  { label: "Cari", icon: IconSearch, href: "/properties" },
  { label: "Bantuan", icon: IconChat, href: "/bantuan" },
  { label: "Akun", icon: IconUser, href: "/dashboard" },
];

/** Navigasi bawah untuk layar kecil (tersembunyi di md ke atas). */
export default function MobileNav() {
  const pathname = usePathname();
  const activeIndex = items.findIndex((i) =>
    i.href === "/" ? pathname === "/" : pathname === i.href || pathname.startsWith(`${i.href}/`),
  );

  return (
    <BottomNavBar
      items={items}
      // -1: tidak ada item aktif (mis. halaman login), label tidak ditampilkan.
      activeIndex={activeIndex}
      stickyBottom
      className="md:hidden"
    />
  );
}
