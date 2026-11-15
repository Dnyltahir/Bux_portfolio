"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE, SLOW } from "@/components/motion/tokens";

/**
 * Page transition. A template re-mounts on every navigation (unlike a layout),
 * so each page fades and rises into place instead of cutting in. The header lives in the layout and stays put.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: SLOW, ease: EASE }}>
      {children}
    </motion.div>
  );
}
