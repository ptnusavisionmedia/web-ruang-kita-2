// BERKAS OTOMATIS — jangan diedit manual.
// Sumber: assets/icons/*.svg  ·  Perbarui dengan: npm run icons
import type { ComponentType, SVGProps } from "react";

export type IconProps = Omit<SVGProps<SVGSVGElement>, "ref"> & {
  size?: number | string;
  strokeWidth?: number;
  /** Mengisi bentuk utama (dipakai ikon bookmark). */
  filled?: boolean;
};

export type IconComponent = ComponentType<IconProps>;

export function IconAc({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="7" width="24" height="11" rx="3"/><path d="M8 14h16"/></g>
      <path d="M10 22v3M16 22v5M22 22v3" stroke="var(--icon-accent, #D2A34F)" strokeWidth="2.2"/>
    </svg>
  );
}

export function IconBath({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M4 17h24v2a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6zM8 25l-1 3M24 25l1 3M9 17V9a3 3 0 0 1 6 0"/></g>
      <circle cx="19" cy="8" r="1.4" fill="var(--icon-accent, #D2A34F)" stroke="none"/><circle cx="23" cy="11" r="1.4" fill="var(--icon-accent, #D2A34F)" stroke="none"/><circle cx="21.5" cy="4.8" r="1.4" fill="var(--icon-accent, #D2A34F)" stroke="none"/>
    </svg>
  );
}

export function IconBed({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M4 6v20M4 20h24v6M28 20v-1a4 4 0 0 0-4-4H14v5"/></g>
      <rect x="7" y="13.5" width="6" height="4" rx="2" fill="var(--icon-accent, #D2A34F)" stroke="none"/>
    </svg>
  );
}

export function IconBookmark({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path fill={filled ? "currentColor" : "none"} d="M8 4.5h16v23l-8-6-8 6z"/></g>
      <path d="M12.5 10.5h7" stroke="var(--icon-accent, #D2A34F)" strokeWidth="2.2"/>
    </svg>
  );
}

export function IconBuilding({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="4" width="18" height="24" rx="2"/><path d="M3 28h26"/></g>
      <rect x="11" y="9" width="3.5" height="3.5" rx="0.6" fill="var(--icon-accent, #D2A34F)" stroke="none"/><rect x="17.5" y="9" width="3.5" height="3.5" rx="0.6" fill="var(--icon-accent, #D2A34F)" stroke="none"/><rect x="11" y="15" width="3.5" height="3.5" rx="0.6" fill="var(--icon-accent, #D2A34F)" stroke="none"/><rect x="17.5" y="15" width="3.5" height="3.5" rx="0.6" fill="var(--icon-accent, #D2A34F)" stroke="none"/><path d="M14 28v-4.5a2 2 0 0 1 4 0V28z" fill="var(--icon-accent, #D2A34F)" stroke="none"/>
    </svg>
  );
}

export function IconCalendar({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="7" width="22" height="20" rx="3"/><path d="M5 13h22M11 4v5M21 4v5"/></g>
      <rect x="11" y="17" width="6" height="5.5" rx="1.5" fill="var(--icon-accent, #D2A34F)" stroke="none"/>
    </svg>
  );
}

export function IconCar({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M6 19v-3l3-7h14l3 7v3"/><rect x="4" y="19" width="24" height="6" rx="2"/><path d="M8 25v2M24 25v2"/></g>
      <circle cx="9.5" cy="22" r="1.4" fill="var(--icon-accent, #D2A34F)" stroke="none"/><circle cx="22.5" cy="22" r="1.4" fill="var(--icon-accent, #D2A34F)" stroke="none"/>
    </svg>
  );
}

export function IconChat({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M5 7a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H15l-6 5v-5H8a3 3 0 0 1-3-3z"/></g>
      <circle cx="11.5" cy="13" r="1.5" fill="var(--icon-accent, #D2A34F)" stroke="none"/><circle cx="16" cy="13" r="1.5" fill="var(--icon-accent, #D2A34F)" stroke="none"/><circle cx="20.5" cy="13" r="1.5" fill="var(--icon-accent, #D2A34F)" stroke="none"/>
    </svg>
  );
}

export function IconCheckCircle({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="12"/></g>
      <path d="m10.5 16.5 4 4 7-8" stroke="var(--icon-accent, #D2A34F)" strokeWidth="2.6"/>
    </svg>
  );
}

export function IconClipboard({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="20" height="23" rx="3"/><path d="M12 6V5a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 20 5v1"/></g>
      <path d="m11 18 3.5 3.5L21 15" stroke="var(--icon-accent, #D2A34F)" strokeWidth="2.5"/>
    </svg>
  );
}

export function IconClock({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="12"/></g>
      <path d="M16 9v7l4.5 3" stroke="var(--icon-accent, #D2A34F)" strokeWidth="2.4"/>
    </svg>
  );
}

export function IconDoor({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M5 28V14a11 11 0 0 1 22 0v14M3 28h26"/></g>
      <path d="M12.5 28v-9a3.5 3.5 0 0 1 7 0v9z" fill="var(--icon-accent, #D2A34F)" stroke="none"/>
    </svg>
  );
}

export function IconHeadset({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M6 18v-3a10 10 0 0 1 20 0v3"/><rect x="4" y="17" width="5" height="8" rx="2.5"/><rect x="23" y="17" width="5" height="8" rx="2.5"/></g>
      <path d="M25.5 25c0 3-3 4-7.5 4" stroke="var(--icon-accent, #D2A34F)" strokeWidth="2.2"/><circle cx="17.5" cy="29" r="1.4" fill="var(--icon-accent, #D2A34F)" stroke="none"/>
    </svg>
  );
}

export function IconHome({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 15.5 16 5.5l11.5 10"/><path d="M7.5 13.5v13h17v-13"/></g>
      <path d="M13 26.5v-5.5a3 3 0 0 1 6 0v5.5z" fill="var(--icon-accent, #D2A34F)" stroke="none"/>
    </svg>
  );
}

export function IconIdCard({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="26" height="18" rx="3"/><path d="M18 13h7M18 18h5"/></g>
      <circle cx="11" cy="14" r="2.8" fill="var(--icon-accent, #D2A34F)" stroke="none"/><path d="M6.5 21.5c.8-2.3 2.5-3.3 4.5-3.3s3.7 1 4.5 3.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

export function IconImages({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="6" width="24" height="20" rx="3"/></g>
      <path d="m4 22 7-7 6 6 4-4 7 7" stroke="var(--icon-accent, #D2A34F)" strokeWidth="2.4"/><circle cx="21" cy="12" r="2" fill="var(--icon-accent, #D2A34F)" stroke="none"/>
    </svg>
  );
}

export function IconKey({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><circle cx="10.5" cy="17" r="5.5"/><path d="M16 17h12M24 17v5M28 17v4"/></g>
      <circle cx="10.5" cy="17" r="1.8" fill="var(--icon-accent, #D2A34F)" stroke="none"/>
    </svg>
  );
}

export function IconKitchen({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M6 14h20v7a6 6 0 0 1-6 6h-8a6 6 0 0 1-6-6zM3 17h3M26 17h3M9 14a7 7 0 0 1 14 0"/></g>
      <circle cx="16" cy="5.5" r="1.8" fill="var(--icon-accent, #D2A34F)" stroke="none"/>
    </svg>
  );
}

export function IconLayers({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="m4 21 12 6 12-6M4 15.5l12 6 12-6"/></g>
      <path d="M16 4 4 10l12 6 12-6z" fill="var(--icon-accent, #D2A34F)" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconMail({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="7" width="24" height="18" rx="3"/></g>
      <path d="m5 10 11 8 11-8" stroke="var(--icon-accent, #D2A34F)" strokeWidth="2.4"/>
    </svg>
  );
}

export function IconPhone({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="14" height="26" rx="3"/></g>
      <path d="M14 25h4" stroke="var(--icon-accent, #D2A34F)" strokeWidth="2.4"/>
    </svg>
  );
}

export function IconPin({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M16 29s9-8.5 9-15a9 9 0 0 0-18 0c0 6.5 9 15 9 15z"/></g>
      <circle cx="16" cy="14" r="3.5" fill="var(--icon-accent, #D2A34F)" stroke="none"/>
    </svg>
  );
}

export function IconQuestion({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="12"/></g>
      <path d="M12.5 12.7a3.5 3.5 0 1 1 5 3.1c-1 .6-1.5 1.2-1.5 2.3" stroke="var(--icon-accent, #D2A34F)" strokeWidth="2.4"/><circle cx="16" cy="22" r="1.4" fill="var(--icon-accent, #D2A34F)" stroke="none"/>
    </svg>
  );
}

export function IconReceipt({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M7 4h18v24l-3-2.2-3 2.2-3-2.2-3 2.2-3-2.2L7 28zM11.5 10h9"/></g>
      <path d="M11.5 15.5h9" stroke="var(--icon-accent, #D2A34F)" strokeWidth="2.4"/>
    </svg>
  );
}

export function IconRuler({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="10" width="26" height="12" rx="2.5"/></g>
      <path d="M9 10v4.5M14.5 10v6.5M20 10v4.5M25 10v6.5" stroke="var(--icon-accent, #D2A34F)" strokeWidth="2.2"/>
    </svg>
  );
}

export function IconSearch({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><circle cx="14" cy="14" r="8.5"/><path d="m20.5 20.5 7 7"/></g>
      <circle cx="14" cy="14" r="3" fill="var(--icon-accent, #D2A34F)" stroke="none"/>
    </svg>
  );
}

export function IconShield({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M16 4 26 8v8c0 6-4 9.5-10 12-6-2.5-10-6-10-12V8z"/></g>
      <path d="m11.5 16 3.5 3.5 6-6.5" stroke="var(--icon-accent, #D2A34F)" strokeWidth="2.6"/>
    </svg>
  );
}

export function IconShirt({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 4 10l3 5 4-2v14h10V13l4 2 3-5-7-5"/></g>
      <path d="M11 5a5 5 0 0 0 10 0" stroke="var(--icon-accent, #D2A34F)" strokeWidth="2.4"/>
    </svg>
  );
}

export function IconTag({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M4 16.4V6a2 2 0 0 1 2-2h10.4a2 2 0 0 1 1.4.6l9.6 9.6a2 2 0 0 1 0 2.8l-9.4 9.4a2 2 0 0 1-2.8 0l-9.6-9.6A2 2 0 0 1 4 16.4z"/></g>
      <circle cx="11" cy="11" r="2.5" fill="var(--icon-accent, #D2A34F)" stroke="none"/>
    </svg>
  );
}

export function IconTv({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="6" width="24" height="17" rx="3"/><path d="M11 27h10M16 23v4"/></g>
      <path d="m14 11 6 3.5-6 3.5z" fill="var(--icon-accent, #D2A34F)" stroke="none"/>
    </svg>
  );
}

export function IconUser({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="11" r="5.5"/><path d="M5 28c0-6 5-10 11-10s11 4 11 10"/></g>
      <circle cx="16" cy="24" r="1.7" fill="var(--icon-accent, #D2A34F)" stroke="none"/>
    </svg>
  );
}

export function IconWallet({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="9" width="24" height="17" rx="3.5"/><path d="M4 14h24M7 9l14-4.5V9"/></g>
      <circle cx="22.5" cy="20" r="2.2" fill="var(--icon-accent, #D2A34F)" stroke="none"/>
    </svg>
  );
}

export function IconWifi({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 13a16 16 0 0 1 23 0M9 17.5a9.5 9.5 0 0 1 14 0M13 22a4 4 0 0 1 6 0"/></g>
      <circle cx="16" cy="26" r="2" fill="var(--icon-accent, #D2A34F)" stroke="none"/>
    </svg>
  );
}

export function IconZap({ size = 24, strokeWidth = 2, filled, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" focusable="false" data-filled={filled ? true : undefined} {...props}>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M18 3 7 18h8l-2 11 12-16h-8z" fill="var(--icon-accent, #D2A34F)"/></g>
    </svg>
  );
}

export const icons = {
  "ac": IconAc,
  "bath": IconBath,
  "bed": IconBed,
  "bookmark": IconBookmark,
  "building": IconBuilding,
  "calendar": IconCalendar,
  "car": IconCar,
  "chat": IconChat,
  "check-circle": IconCheckCircle,
  "clipboard": IconClipboard,
  "clock": IconClock,
  "door": IconDoor,
  "headset": IconHeadset,
  "home": IconHome,
  "id-card": IconIdCard,
  "images": IconImages,
  "key": IconKey,
  "kitchen": IconKitchen,
  "layers": IconLayers,
  "mail": IconMail,
  "phone": IconPhone,
  "pin": IconPin,
  "question": IconQuestion,
  "receipt": IconReceipt,
  "ruler": IconRuler,
  "search": IconSearch,
  "shield": IconShield,
  "shirt": IconShirt,
  "tag": IconTag,
  "tv": IconTv,
  "user": IconUser,
  "wallet": IconWallet,
  "wifi": IconWifi,
  "zap": IconZap,
} as const satisfies Record<string, IconComponent>;

export type IconName = keyof typeof icons;
