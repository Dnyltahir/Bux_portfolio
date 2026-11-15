"use client";

import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { ProjectCarousel3D } from "./ProjectCarousel3D";
import { EASE, SLOW } from "./motion/tokens";
import { fadeUp, stagger } from "./motion/variants";

const disciplines = ["Identity Design", "Brand Design", "Packaging Design", "Layout Design"];

// Corner points (in %) of the black panel: tilted at the top of the page, a full rectangle once scrolled.
const WIDE = [24, 14, 80, 34, 86, 100, 14, 94];
const NARROW = [5, 6, 92, 20, 100, 100, 0, 95];
const FULL = [0, 0, 100, 0, 100, 100, 0, 100];
const polygon = (p: number[]) => `polygon(${p[0]}% ${p[1]}%, ${p[2]}% ${p[3]}%, ${p[4]}% ${p[5]}%, ${p[6]}% ${p[7]}%)`;

export function Hero() {
  const reduced = useReducedMotion() ?? false;
  const reel = useRef<HTMLElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [inViewport, setInViewport] = useState(true);
  const clipPath = useMotionValue(polygon(WIDE));
  // The panel also grows slightly as it opens, so opening reads as one movement.
  const scale = useMotionValue(0.92);
  const { scrollY } = useScroll();

  // Rotate the discipline line.
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % disciplines.length), 2200);
    return () => window.clearInterval(id);
  }, [reduced]);

  // Open the tilted panel into a full rectangle as the page scrolls.
  const updateClip = useCallback(() => {
    const section = reel.current;
    if (!section) return;
    if (reduced) {
      clipPath.set(polygon(FULL));
      scale.set(1);
      return;
    }
    const travel = section.offsetHeight - window.innerHeight;
    const p = Math.min(1, Math.max(0, window.scrollY / (section.offsetTop + travel * 0.6)));
    const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    const from = window.innerWidth < 700 ? NARROW : WIDE;
    clipPath.set(polygon(from.map((v, i) => v + (FULL[i] - v) * eased)));
    scale.set(0.92 + 0.08 * eased);
  }, [clipPath, scale, reduced]);

  useMotionValueEvent(scrollY, "change", updateClip);
  useEffect(() => {
    updateClip();
    window.addEventListener("resize", updateClip);
    return () => window.removeEventListener("resize", updateClip);
  }, [updateClip]);

  // Stop the carousel while the hero is off screen.
  useEffect(() => {
    const target = sticky.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setInViewport(entry.isIntersecting), { threshold: 0.01 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="gutter pb-[clamp(20px,3vw,40px)] pt-[clamp(28px,5vw,72px)]">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <h1
            aria-label="Creative practitioner for identity, brand, packaging and layout design"
            className="text-[clamp(38px,7.6vw,124px)] font-medium leading-[1.04] tracking-[-0.045em]"
          >
            <motion.span variants={fadeUp} aria-hidden="true" className="block">
              Creative practitioner for
            </motion.span>
            <motion.span variants={fadeUp} aria-hidden="true" className="relative block h-[1.16em] overflow-hidden">
              <AnimatePresence initial={false}>
                <motion.span
                  key={disciplines[index]}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: SLOW, ease: EASE }}
                  className="absolute inset-x-0 top-0 block whitespace-nowrap leading-[1.16]"
                >
                  {disciplines[index]}
                </motion.span>
              </AnimatePresence>
            </motion.span>
          </h1>

          <motion.p variants={fadeUp} className="mt-5 max-w-[44ch] text-[clamp(17px,1.6vw,22px)] text-muted">
            Muhammad Bux — Communication Designer and Visual Artist based in Lahore, Pakistan.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
            <Button href="#work">View work</Button>
            <Button href="#contact" variant="outline">
              Start a project
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <section ref={reel} aria-label="Project carousel" className={reduced ? "h-screen" : "h-[135vh] md:h-[155vh]"}>
        <div ref={sticky} className="sticky top-0 h-screen overflow-hidden">
          <motion.div
            style={{ clipPath, scale }}
            className="absolute inset-0 bg-surface bg-[radial-gradient(60%_60%_at_50%_55%,rgba(255,75,31,0.28),transparent_70%)] text-white"
          >
            {/* Full-width 3D ring carousel of all projects. The top padding clears the sticky header.
                Phones: a fixed-ratio frame centred in the panel, so covers are not cropped to a tall strip. */}
            <div className="gutter absolute inset-0 flex items-center pb-[clamp(14px,2vw,32px)] pt-[76px] md:pt-[92px]">
              <div className="aspect-[5/6] w-full min-w-0 md:aspect-auto md:h-full">
                <ProjectCarousel3D active={inViewport} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
