"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  external?: boolean;
};

// Resting colours, the colour that sweeps up on hover, and the text colour once it has.
const styles = {
  solid: { rest: "bg-white text-ink", fill: "bg-accent", hover: "group-hover:text-white" },
  outline: { rest: "border border-white/30 text-paper", fill: "bg-white", hover: "group-hover:text-ink" },
};

/** Pill link. On hover a fill sweeps up from the bottom; on tap it presses in slightly. */
export function Button({ href, children, variant = "solid", external = false }: Props) {
  const style = styles[variant];
  return (
    <motion.a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      whileTap={{ scale: 0.97 }}
      className={`group relative inline-flex items-center overflow-hidden rounded-full px-6 py-3.5 text-[15px] font-semibold ${style.rest}`}
    >
      <span aria-hidden="true" className={`absolute inset-0 translate-y-[102%] rounded-full transition-transform duration-500 group-hover:translate-y-0 ${style.fill}`} />
      <span className={`relative transition-colors ${style.hover}`}>{children}</span>
    </motion.a>
  );
}
