import type { Variants } from "framer-motion";
import { EASE, SLOW } from "./tokens";

/** A single block fading up into place. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: SLOW, ease: EASE } },
};

/** A parent that reveals its `fadeUp` children one after another. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

/** Shared scroll trigger: play once, when a fifth of the element is visible. */
export const inView = { once: true, amount: 0.2 } as const;
