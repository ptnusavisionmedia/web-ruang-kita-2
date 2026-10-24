"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { IconHome, type IconComponent } from "@/components/icons";

import { cn } from "@/lib/utils";

export type BottomNavItem = {
  label: string;
  icon: IconComponent;
  /** Jika diisi, item menjadi tautan. Tanpa href, item hanya mengubah state aktif. */
  href?: string;
};

const defaultItems: BottomNavItem[] = [{ label: "Home", icon: IconHome }];

const MotionLink = motion.create(Link);

type BottomNavBarProps = {
  className?: string;
  items?: BottomNavItem[];
  /** Mode terkendali: indeks aktif ditentukan dari luar (mis. dari pathname). */
  activeIndex?: number;
  defaultIndex?: number;
  stickyBottom?: boolean;
  /** Lebar area label saat item terbuka (px). Perbesar untuk label panjang. */
  labelWidth?: number;
  /** Buka label juga saat kursor di atas item (berguna untuk desktop). */
  expandOnHover?: boolean;
  ariaLabel?: string;
};

type ItemProps = {
  item: BottomNavItem;
  active: boolean;
  pillId: string;
  labelWidth: number;
  expandOnHover: boolean;
  onSelect: () => void;
};

function NavItem({ item, active, pillId, labelWidth, expandOnHover, onSelect }: ItemProps) {
  const [hover, setHover] = useState(false);
  const Icon = item.icon;
  const open = active || (expandOnHover && hover);

  const className = cn(
    "relative flex h-10 min-h-[40px] min-w-[44px] max-h-[44px] items-center gap-0 rounded-full px-3 py-2 transition-colors duration-200",
    active ? "text-white" : "bg-transparent text-ink/70 hover:text-ink",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600",
  );

  const content = (
    <>
      {active && (
        <motion.span
          layoutId={pillId}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="absolute inset-0 rounded-full border-2 border-ink bg-brand-700"
          aria-hidden
        />
      )}
      {!active && hover && expandOnHover && (
        <span className="absolute inset-0 rounded-full bg-accent-100" aria-hidden />
      )}
      <Icon size={22} strokeWidth={2} aria-hidden className="relative transition-colors duration-200" />

      <motion.div
        initial={false}
        animate={{
          width: open ? `${labelWidth}px` : "0px",
          opacity: open ? 1 : 0,
          marginLeft: open ? "8px" : "0px",
        }}
        transition={{
          width: { type: "spring", stiffness: 350, damping: 32 },
          opacity: { duration: 0.19 },
          marginLeft: { duration: 0.19 },
        }}
        style={{ maxWidth: labelWidth }}
        className="relative flex items-center overflow-hidden"
      >
        <span
          className={cn(
            "select-none overflow-hidden text-ellipsis whitespace-nowrap text-[clamp(0.625rem,0.5263rem+0.5263vw,1rem)] font-medium leading-[1.9] transition-opacity duration-200",
            open ? (active ? "font-bold text-white" : "font-bold text-ink") : "opacity-0",
          )}
          title={item.label}
        >
          {item.label}
        </span>
      </motion.div>
    </>
  );

  const shared = {
    className,
    onClick: onSelect,
    onHoverStart: () => setHover(true),
    onHoverEnd: () => setHover(false),
    onFocus: () => setHover(true),
    onBlur: () => setHover(false),
    whileTap: { scale: 0.97 },
    "aria-label": item.label,
  } as const;

  return item.href ? (
    <MotionLink href={item.href} {...shared} aria-current={active ? "page" : undefined}>
      {content}
    </MotionLink>
  ) : (
    <motion.button type="button" {...shared} aria-pressed={active}>
      {content}
    </motion.button>
  );
}

export function BottomNavBar({
  className,
  items = defaultItems,
  activeIndex: controlledIndex,
  defaultIndex = 0,
  stickyBottom = false,
  labelWidth = 72,
  expandOnHover = false,
  ariaLabel = "Navigasi bawah",
}: BottomNavBarProps) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const activeIndex = controlledIndex ?? internalIndex;
  // Setiap instance punya penanda aktif sendiri agar tidak saling "terbang" antar bar.
  const pillId = `nav-pill-${useId()}`;

  return (
    <MotionConfig reducedMotion="user">
      <motion.nav
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        aria-label={ariaLabel}
        className={cn(
          "flex h-[54px] max-w-[95vw] items-center space-x-1 rounded-full border-2 border-ink bg-white p-2 shadow-brut-sm",
          stickyBottom && "fixed inset-x-0 bottom-4 z-40 mx-auto w-fit min-w-[320px]",
          className,
        )}
      >
        {items.map((item, idx) => (
          <NavItem
            key={item.label}
            item={item}
            active={activeIndex === idx}
            pillId={pillId}
            labelWidth={labelWidth}
            expandOnHover={expandOnHover}
            onSelect={() => setInternalIndex(idx)}
          />
        ))}
      </motion.nav>
    </MotionConfig>
  );
}

export default BottomNavBar;
