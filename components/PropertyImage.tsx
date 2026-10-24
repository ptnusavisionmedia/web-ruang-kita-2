"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Menampilkan foto dari Supabase bila ada; jika tidak ada atau gagal dimuat,
 * memakai ilustrasi SVG lokal agar layout tidak pernah rusak.
 */

export const IMAGE_VIEWS = ["Kamar tidur", "Kamar mandi", "Area bersama", "Tampak depan"] as const;

const tones = [
  ["#e1eee9", "#c2ddd3", "#104437"],
  ["#e9f3ef", "#cde3da", "#0c352b"],
  ["#d8e9e3", "#b3d3c7", "#155645"],
  ["#e6f1ed", "#bcd8cd", "#104437"],
];

export default function PropertyImage({
  src,
  alt = "",
  seed = 0,
  view = 0,
  className,
}: {
  src?: string | null;
  alt?: string;
  seed?: number;
  view?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  const [bg, mid, dark] = tones[(seed + view) % tones.length];
  const v = view % 4;
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={alt || IMAGE_VIEWS[v]}
    >
      <rect width="400" height="300" fill={bg} />
      {v === 0 && (
        <>
          <rect x="250" y="40" width="90" height="110" rx="4" fill="#fff" opacity=".85" />
          <path d="M295 40v110M250 95h90" stroke={mid} strokeWidth="3" />
          <rect y="215" width="400" height="85" fill={mid} />
          <rect x="60" y="150" width="190" height="70" rx="8" fill="#fff" />
          <rect x="60" y="130" width="50" height="40" rx="8" fill={dark} opacity=".85" />
          <rect x="60" y="185" width="190" height="35" rx="6" fill={dark} opacity=".75" />
          <rect x="285" y="190" width="55" height="30" rx="4" fill="#d2a34f" />
        </>
      )}
      {v === 1 && (
        <>
          <rect y="200" width="400" height="100" fill={mid} />
          <rect x="40" y="60" width="130" height="140" fill="#fff" opacity=".7" />
          <circle cx="105" cy="130" r="26" fill={bg} />
          <rect x="230" y="150" width="120" height="70" rx="30" fill="#fff" />
          <rect x="220" y="140" width="140" height="18" rx="9" fill={dark} opacity=".8" />
        </>
      )}
      {v === 2 && (
        <>
          <rect y="210" width="400" height="90" fill={mid} />
          <rect x="40" y="110" width="170" height="60" rx="14" fill="#fff" />
          <rect x="40" y="165" width="170" height="30" rx="8" fill={dark} opacity=".8" />
          <rect x="250" y="70" width="100" height="75" rx="4" fill="#fff" opacity=".8" />
          <rect x="262" y="82" width="76" height="51" fill={mid} />
          <rect x="285" y="170" width="45" height="40" rx="4" fill="#fff" />
        </>
      )}
      {v === 3 && (
        <>
          <rect y="230" width="400" height="70" fill={mid} />
          <rect x="90" y="80" width="220" height="150" fill="#fff" />
          <path d="M70 85 200 30l130 55z" fill={dark} />
          <rect x="120" y="120" width="50" height="50" fill={bg} />
          <rect x="230" y="120" width="50" height="50" fill={bg} />
          <rect x="178" y="165" width="44" height="65" fill="#d2a34f" />
        </>
      )}
    </svg>
  );
}
