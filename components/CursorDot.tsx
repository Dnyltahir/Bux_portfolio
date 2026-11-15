"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { FOLLOW } from "./motion/tokens";

const grow = { type: "spring", stiffness: 260, damping: 26 } as const;

/**
 * Accent dot that follows the mouse. Hidden on touch devices.
 * Over a link or button it grows into a ring. Over anything marked `data-cursor="…"` it grows
 * further and shows that word, for example "View" on project cards and "Drag" on the carousel.
 */
export function CursorDot() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, FOLLOW);
  const sy = useSpring(y, FOLLOW);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [overLink, setOverLink] = useState(false);

  useEffect(() => {
    if (reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target instanceof Element ? event.target : null;
      setLabel(target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? null);
      setOverLink(Boolean(target?.closest("a, button, label")));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, x, y]);

  if (!enabled) return null;

  const size = label ? 78 : overLink ? 44 : 14;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] grid place-items-center rounded-full bg-accent text-[13px] font-semibold text-white"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%", mixBlendMode: !label && overLink ? "difference" : "normal" }}
      animate={{ width: size, height: size }}
      transition={grow}
    >
      <motion.span animate={{ opacity: label ? 1 : 0, scale: label ? 1 : 0.6 }}>{label}</motion.span>
    </motion.div>
  );
}
