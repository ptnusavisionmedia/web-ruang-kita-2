"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { IconUser } from "@/components/icons";
import { currentUsername, signOut } from "@/app/actions/auth";

export default function AuthButton() {
  const [email, setEmail] = useState<string | null>(null);
  const pathname = usePathname();

  // Login/logout terjadi di server (Server Action), jadi klien perlu memeriksa ulang sesi
  // setiap kali pindah halaman agar tombol ini selalu sesuai.
  useEffect(() => {
    let active = true;
    currentUsername().then((name) => active && setEmail(name));
    return () => {
      active = false;
    };
  }, [pathname]);

  if (!email) {
    return (
      <Link
        href="/login"
        className="rounded-md border-2 border-ink bg-brand-700 px-5 py-2.5 text-sm font-bold text-white shadow-brut-sm transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
      >
        Masuk
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/dashboard"
        className="hidden items-center gap-2 rounded-md border-2 border-ink bg-white px-4 py-2 text-sm font-bold text-ink shadow-brut-sm transition-all hover:-translate-y-0.5 hover:bg-accent-100 sm:flex"
      >
        <IconUser size={20} className="text-brand-700" />
        <span className="max-w-[140px] truncate">{email}</span>
      </Link>
      <form action={signOut}>
        <button
          type="submit"
          aria-label="Keluar"
          className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-ink bg-white text-ink shadow-brut-sm transition-all hover:-translate-y-0.5 hover:bg-accent-100"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
