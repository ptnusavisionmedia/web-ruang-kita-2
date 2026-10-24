import type { IconComponent } from "@/components/icons";
import { cn } from "@/lib/utils";

/** Ubin persegi berisi ikon kustom. `dark` untuk latar hijau gelap. */
export default function IconTile({
  icon: Icon,
  size = "md",
  dark = false,
  className,
}: {
  icon: IconComponent;
  size?: "sm" | "md" | "lg";
  dark?: boolean;
  className?: string;
}) {
  const box = { sm: "size-11", md: "size-14", lg: "size-20" }[size];
  const px = { sm: 24, md: 30, lg: 44 }[size];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md border-2",
        dark ? "border-white bg-brand-900 text-white shadow-[3px_3px_0_0_#d2a34f]" : "border-ink bg-white text-brand-800 shadow-brut-sm",
        box,
        className,
      )}
    >
      <Icon size={px} />
    </span>
  );
}
