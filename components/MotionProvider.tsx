"use client";

import { MotionConfig } from "framer-motion";

/** Satu pengaturan untuk seluruh animasi: hormati preferensi "reduce motion" pengguna. */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
