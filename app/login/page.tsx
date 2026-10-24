import { Suspense } from "react";
import { Check } from "lucide-react";
import AuthForm from "./AuthForm";
import DoorArch from "@/components/DoorArch";

export const metadata = { title: "Masuk — RuangKita" };

const points = ["Jadwalkan survei kapan saja", "Pembayaran tercatat rapi", "Simpan properti favorit Anda"];

export default function LoginPage() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_1.05fr]">
      <section className="grain relative hidden overflow-hidden bg-brand-800 p-14 text-white lg:block">
        <DoorArch className="absolute -bottom-2 -right-8 h-[52%] text-white" stroke="#ffffff" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-400">RuangKita</p>
          <h2 className="mt-5 max-w-md font-display text-5xl leading-[1.08]">Masuk, lalu temukan ruang untuk Anda.</h2>
        </div>
        <ul className="relative mt-10 space-y-4 text-white/85">
          {points.map((t) => (
            <li key={t} className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-brand-900">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="relative flex items-center justify-center overflow-hidden bg-paper px-5 py-12 sm:px-10">
        <div className="blueprint absolute inset-0" aria-hidden />
        <div className="relative w-full max-w-md">
          <Suspense fallback={null}>
            <AuthForm />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
