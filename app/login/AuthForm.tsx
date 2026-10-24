"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IconBookmark, IconCalendar, IconDoor, IconShield, IconUser } from "@/components/icons";
import { signIn, signUp, type AuthResult } from "@/app/actions/auth";
import PasswordField from "@/components/PasswordField";
import { btnPrimary, field } from "@/lib/ui";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup";

const TITLES: Record<Mode, { h: string; p: string; cta: string }> = {
  signin: { h: "Masuk", p: "Masuk untuk booking survei, membayar, dan menyimpan properti.", cta: "Masuk" },
  signup: { h: "Buat akun", p: "Cukup pilih username dan kata sandi. Tanpa email, tanpa ribet.", cta: "Daftar" },
};

export default function AuthForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "";
  const urlError = params.get("error");

  const [mode, setMode] = useState<Mode>("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<AuthResult | null>(null);
  const [pending, startTransition] = useTransition();

  const fe = (k: string) => result?.fieldErrors?.[k];
  const fieldErr = (k: string) => (fe(k) ? <p className="mt-1.5 text-xs text-red-700">{fe(k)}</p> : null);

  function switchMode(m: Mode) {
    setMode(m);
    setResult(null);
    setPassword("");
  }

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      // Sukses -> server melakukan redirect sehingga hasil hanya ada saat gagal.
      const res = await (mode === "signin" ? signIn : signUp)(formData);
      setResult(res ?? null);
    });
  }

  const t = TITLES[mode];

  return (
    <div className="relative w-full max-w-md">
      {/* hiasan di sudut kartu */}
      <span className="pointer-events-none absolute -right-3 -top-3 hidden size-12 rotate-12 border-2 border-ink bg-accent-400 sm:block" aria-hidden />
      <span className="pointer-events-none absolute -bottom-4 -left-4 hidden size-10 rounded-full border-2 border-ink bg-brand-700 sm:block" aria-hidden />

      <div className="relative overflow-hidden rounded-lg border-2 border-ink bg-white shadow-brut-lg">
        <div
          className="h-3 border-b-2 border-ink"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #10231e 0 9px, #d2a34f 9px 18px)" }}
          aria-hidden
        />
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="inline-flex size-14 items-center justify-center rounded-md border-2 border-ink bg-brand-50 text-brand-800 shadow-brut-sm">
              <IconDoor size={34} />
            </span>
            <span className="sticker">{mode === "signup" ? "Gratis!" : "Selamat datang"}</span>
          </div>
          <h1 className="mt-5 font-display text-4xl text-ink">{t.h}</h1>
          <p className="mt-2 text-sm text-muted">{t.p}</p>

      {(
        <div className="mt-6 grid grid-cols-2 gap-1 rounded-md border-2 border-ink bg-paper p-1 text-sm font-bold" role="tablist">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m)}
              className={cn("relative rounded py-2.5 transition-colors duration-200", mode === m ? "text-white" : "text-ink hover:bg-accent-100")}
            >
              {mode === m && (
                <motion.span
                  layoutId="auth-tab"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded bg-brand-700"
                  aria-hidden
                />
              )}
              <span className="relative">{m === "signin" ? "Masuk" : "Daftar"}</span>
            </button>
          ))}
        </div>
      )}

      {urlError && !result && (
        <p role="alert" className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">{urlError}</p>
      )}

      <form action={onSubmit} className="mt-6 space-y-5" noValidate>
        <input type="hidden" name="next" value={next} />

        <div>
          <label htmlFor="username" className="mb-2 block text-sm font-medium text-ink">Username</label>
          <div className="relative">
            <IconUser size={22} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-700" />
            <input
              id="username"
              name="username"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="contoh: budi_01"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-invalid={!!fe("username")}
              className={cn(field, "pl-12", fe("username") && "!border-red-600")}
            />
          </div>
          {fieldErr("username")}
          {mode === "signup" && !fe("username") && (
            <p className="mt-1.5 text-xs text-muted">3–20 karakter: huruf, angka, titik, atau garis bawah.</p>
          )}
        </div>

        <div>
          <PasswordField
            name="password"
            label="Kata sandi"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            error={fe("password")}
            value={password}
            onChange={setPassword}
          />
          {mode === "signup" && !fe("password") && <p className="mt-1.5 text-xs text-muted">Minimal 6 karakter.</p>}
        </div>

        <AnimatePresence initial={false}>
          {result?.message && (
            <motion.p
              key={result.message}
              role="alert"
              initial={{ opacity: 0, y: -8, x: 0 }}
              animate={{ opacity: 1, y: 0, x: result.ok ? 0 : [0, -8, 8, -5, 5, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className={cn("rounded-md px-4 py-3 text-sm", result.ok ? "bg-brand-50 text-brand-800" : "border border-red-200 bg-red-50 text-red-800")}
            >
              {result.message}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={pending}
          className={btnPrimary + " w-full py-3.5"}
        >
          {pending ? "Memproses…" : t.cta}
        </button>

        {mode === "signup" && (
          <p className="text-center text-xs leading-relaxed text-muted">
            Dengan mendaftar, Anda menyetujui <Link href="/bantuan" className="underline">ketentuan layanan</Link> RuangKita.
          </p>
        )}
        {(
          <p className="text-center text-sm text-muted">
            {mode === "signin" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <button
              type="button"
              onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
              className="font-bold text-brand-700 underline decoration-accent-500 decoration-2 underline-offset-4"
            >
              {mode === "signin" ? "Daftar gratis" : "Masuk"}
            </button>
          </p>
        )}
      </form>
        </div>

        <ul className="grid grid-cols-3 divide-x-2 divide-ink border-t-2 border-ink bg-paper text-center text-[11px] font-bold uppercase tracking-wide text-ink">
          {[
            { icon: IconCalendar, label: "Survei gratis" },
            { icon: IconShield, label: "Data aman" },
            { icon: IconBookmark, label: "Simpan favorit" },
          ].map((b) => (
            <li key={b.label} className="flex flex-col items-center gap-1 px-1 py-3">
              <b.icon size={22} />
              {b.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
