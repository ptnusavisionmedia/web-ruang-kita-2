import { IconAc, IconBath, IconBed, IconCar, IconKitchen, IconShirt, IconShield, IconTv, IconWifi, IconZap, IconDoor, type IconComponent } from "@/components/icons";
import type { Facility } from "@/types";

/** Nama ikon di tabel facilities -> ikon kustom (assets/icons). */
const icons: Record<string, IconComponent> = {
  wifi: IconWifi,
  snowflake: IconAc,
  bath: IconBath,
  car: IconCar,
  "cooking-pot": IconKitchen,
  shirt: IconShirt,
  "bed-double": IconBed,
  "shield-check": IconShield,
  zap: IconZap,
  tv: IconTv,
};

export function FacilityIcon({ icon, className, size = 20 }: { icon: string | null; className?: string; size?: number }) {
  const Icon = (icon && icons[icon]) || IconDoor;
  return <Icon size={size} className={className} />;
}

export default function FacilityBadge({ facility, large = false }: { facility: Facility; large?: boolean }) {
  return (
    <span
      className={
        large
          ? "inline-flex items-center gap-3 rounded-md border-2 border-ink px-4 py-3 text-sm text-ink"
          : "inline-flex items-center gap-1.5 rounded bg-surface px-2 py-1 text-xs text-muted"
      }
    >
      <FacilityIcon icon={facility.icon} size={large ? 22 : 16} className="text-brand-700" />
      {facility.name}
    </span>
  );
}
