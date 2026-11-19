"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Honour the OS "reduce motion" setting across every Framer Motion animation. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
