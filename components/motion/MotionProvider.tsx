"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { EASE, FAST } from "./tokens";

/**
 * Sets the default transition for every hover and press on the site (fast, on the shared curve),
 * and turns off movement-based animation for visitors who ask their system for reduced motion.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user" transition={{ duration: FAST, ease: EASE }}>{children}</MotionConfig>;
}
