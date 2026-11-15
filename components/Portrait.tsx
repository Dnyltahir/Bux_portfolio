"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { PointerEvent } from "react";
import { Studio, Wall } from "./CharacterScene";
import { FadeImage } from "./FadeImage";
import { FOLLOW } from "./motion/tokens";

/*
  3D portrait for the About section, made from one flat illustration.
  The figure is cut out of the illustration along its outline and lifted towards the viewer.
  Behind it is a back plate showing the design studio at night (the wall and desk drawn for the character scene). The cut-out floats in front of the plate, its head
  rises above the plate's top edge, and the two layers shift against each other as the card tilts
  with the pointer. That difference in movement is what reads as depth.
*/

const SRC = "/assets/portrait.webp";
const ALT = "Illustrated portrait of Muhammad Bux in a dark jacket, in front of a design studio at night";

/** Outline of the figure, traced by hand just inside its white sketch line, as percentages of the image. Adjust the points if the artwork changes. */
const FIGURE = `polygon(
  51.0% 5.2%, 59.2% 7.0%, 65.4% 13.5%, 67.4% 21.8%, 66.9% 29.3%, 68.6% 31.3%, 68.3% 37.8%, 65.0% 41.9%,
  63.9% 45.6%, 66.9% 48.1%, 74.6% 51.6%, 84.2% 57.3%, 88.7% 63.5%, 90.8% 75.0%, 92.4% 100.0%, 9.2% 100.0%,
  11.4% 77.5%, 13.7% 65.5%, 17.7% 60.6%, 27.3% 55.6%, 36.4% 51.1%, 39.7% 46.7%, 38.5% 41.9%, 35.6% 39.8%,
  33.9% 32.5%, 35.2% 29.3%, 34.5% 21.8%, 35.6% 14.0%, 41.4% 7.6%
)`;
/** The back plate starts below the top of the head, so the head breaks out of the frame. */
const PLATE = "inset(12% 0% 0% 0% round 28px)";

export function Portrait() {
  const reduced = useReducedMotion() ?? false;
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, FOLLOW);
  const sy = useSpring(py, FOLLOW);
  const rotateY = useTransform(sx, (v) => v * 11);
  const rotateX = useTransform(sy, (v) => v * -9);
  // The plate drifts against the pointer and the figure with it, so they separate.
  const plateX = useTransform(sx, (v) => v * -7);
  const plateY = useTransform(sy, (v) => v * -5);
  const deskX = useTransform(sx, (v) => v * -3);
  const deskY = useTransform(sy, (v) => v * -2);
  const figureX = useTransform(sx, (v) => v * 12);
  const figureY = useTransform(sy, (v) => v * 8);

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    px.set(((event.clientX - box.left) / box.width) * 2 - 1);
    py.set(((event.clientY - box.top) / box.height) * 2 - 1);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div onPointerMove={onMove} onPointerLeave={onLeave} className="[perspective:1000px] max-md:mb-4">
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative aspect-square">
        {/* Back plate: the design studio at night, pushed back. The wall and the desk are separate layers, so they also shift against each other. */}
        <motion.div aria-hidden="true" style={{ z: -40, scale: 1.03, clipPath: PLATE }} className="absolute inset-0 overflow-hidden bg-[#12172f]">
          <motion.svg style={{ x: plateX, y: plateY }} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="absolute -inset-[5%] size-[110%]">
            <Wall />
          </motion.svg>
          <motion.svg style={{ x: deskX, y: deskY }} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="absolute -inset-[5%] size-[110%]">
            <Studio />
          </motion.svg>
        </motion.div>

        {/* Figure: cut out along its outline and lifted forward, with a shadow falling on the plate */}
        <motion.div
          style={{ x: figureX, y: figureY, z: 60 }}
          animate={reduced ? undefined : { translateY: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 drop-shadow-[0_22px_26px_rgba(0,0,0,0.55)]"
        >
          <div className="absolute inset-0" style={{ clipPath: FIGURE }}>
            <FadeImage src={SRC} alt={ALT} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
