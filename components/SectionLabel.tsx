import { cn } from "@/lib/utils";

/** Label bagian bernomor, mis. "(01) Pilihan terbaru". */
export default function SectionLabel({
  index,
  children,
  className,
  dark = false,
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <p className={cn("flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]", dark ? "text-accent-400" : "text-brand-700", className)}>
      {index && <span className="tnum text-accent-600">({index})</span>}
      {children}
    </p>
  );
}
