"use client";

import { motion } from "framer-motion";
import { EASE, SLOW } from "./tokens";
import { inView } from "./variants";

const group = { hidden: {}, show: { transition: { staggerChildren: 0.045 } } };
const word = { hidden: { y: "115%" }, show: { y: 0, transition: { duration: SLOW, ease: EASE } } };

/**
 * Heading text that rises out from behind a mask, word after word, when it scrolls into view.
 * Use inside a heading element: <h2><RevealText text="Selected Work" /></h2>.
 */
export function RevealText({ text }: { text: string }) {
  return (
    <motion.span variants={group} initial="hidden" whileInView="show" viewport={inView} aria-label={text} className="inline">
      {text.split(" ").map((item, i) => (
        // The mask: slightly taller than the line, so descenders are not clipped.
        <span key={i} aria-hidden="true" className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
          <motion.span variants={word} className="inline-block">
            {item}
            {" "}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
