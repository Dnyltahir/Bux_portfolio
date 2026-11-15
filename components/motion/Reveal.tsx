"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, inView, stagger } from "./variants";

type Props = { children: ReactNode; className?: string };

/** Fades a block up when it scrolls into view. */
export function Reveal({ children, className }: Props) {
  return (
    <motion.div className={className} variants={fadeUp} initial="hidden" whileInView="show" viewport={inView}>
      {children}
    </motion.div>
  );
}

/** Reveals its `RevealItem` children in sequence when it scrolls into view. */
export function RevealGroup({ children, className }: Props) {
  return (
    <motion.div className={className} variants={stagger} initial="hidden" whileInView="show" viewport={inView}>
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: Props) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
