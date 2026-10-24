import { cn } from "@/lib/utils";

type Tone = "success" | "pending" | "neutral";

const toneByLabel: Record<string, Tone> = {
  Tersedia: "success",
  Berhasil: "success",
  Terjadwal: "success",
  Selesai: "success",
  "Segera Penuh": "pending",
  Menunggu: "pending",
  "Menunggu konfirmasi": "pending",
  Penuh: "neutral",
  Dibatalkan: "neutral",
  Gagal: "neutral",
  Kedaluwarsa: "neutral",
};

const styles: Record<Tone, string> = {
  success: "border-2 border-ink bg-brand-200 text-ink",
  pending: "border-2 border-ink bg-accent-300 text-ink",
  neutral: "border-2 border-ink bg-white text-ink/60",
};

export default function StatusBadge({ label, className }: { label: string; className?: string }) {
  const tone = toneByLabel[label] ?? "neutral";
  const dot = tone === "success" ? "bg-brand-600" : tone === "pending" ? "bg-accent-500" : "bg-muted";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide",
        styles[tone],
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {tone !== "neutral" && <span className={cn("ping-soft absolute inline-flex h-full w-full rounded-full", dot)} />}
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", dot)} />
      </span>
      {label}
    </span>
  );
}
