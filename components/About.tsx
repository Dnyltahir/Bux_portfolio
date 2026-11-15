"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Portrait } from "./Portrait";
import { Reveal } from "./motion/Reveal";
import { fadeUp, inView, stagger } from "./motion/variants";

const statement = "I turn ideas into visual experiences.";
const introduction =
  "I’m Muhammad Bux, a Communication Designer and Visual Artist based in Lahore. My practice moves between design, art, and experimentation, where I translate complex thoughts, stories, and information into engaging visual narratives.";

/** One word of the statement, which brightens as the reader scrolls past it. */
function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

function LahoreTime() {
  const [time, setTime] = useState("—");
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Karachi" });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);
  return <b className="font-semibold">{time}</b>;
}

const tile = "flex min-h-[190px] flex-col justify-between gap-10 rounded-card p-[clamp(20px,2.2vw,32px)] md:min-h-[240px]";
const tileNumber = "text-[clamp(44px,5.4vw,84px)] font-medium leading-none tracking-[-0.045em]";

export function About() {
  const heading = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: heading, offset: ["start 0.85", "end 0.35"] });
  const words = statement.split(" ");

  return (
    <section id="about" aria-labelledby="about-title" className="gutter scroll-mt-10 section-pad">
      <h2
        id="about-title"
        ref={heading}
        aria-label={statement}
        className="max-w-[24ch] text-[clamp(28px,4.4vw,68px)] font-medium leading-[1.1] tracking-[-0.035em]"
      >
        {words.map((word, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {word}
          </Word>
        ))}
      </h2>

      <Reveal className="mt-[clamp(20px,2.6vw,36px)]">
        <p className="max-w-[46ch] text-[clamp(19px,1.9vw,27px)] leading-[1.4] tracking-[-0.01em] text-paper/80">{introduction}</p>
      </Reveal>

      {/* Portrait beside the biography. On desktop the text column is as tall as the portrait:
          the first paragraph lines up with its top and the second with its bottom, and the type scales with the
          screen so the two paragraphs fill that height. */}
      <Reveal className="mt-[clamp(40px,6vw,96px)] grid items-stretch gap-[clamp(20px,3vw,56px)] md:grid-cols-2">
        <Portrait />
        <div className="flex flex-col justify-between gap-6 text-[clamp(16px,1.78vw,32px)] leading-[1.5] text-paper/90 md:pt-[12%]">
          <p>
            I’m an interdisciplinary artist and visual designer working across exhibition design, immersive experiences, environmental
            storytelling, projection mapping, digital media, and creative technology. My practice explores the relationship between art,
            design, research, and space, translating complex ideas and narratives into engaging visual and spatial experiences.
          </p>
          <p>
            I hold a Bachelor of Design in Interdisciplinary Expanded Design &amp; Arts from Beaconhouse National University, Lahore. My
            professional journey spans creative studios, cultural institutions, advertising, and the corporate sector, alongside
            commissioned artistic projects and exhibitions in Pakistan and internationally, including India and Switzerland.
          </p>
        </div>
      </Reveal>

      <motion.ul
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="mt-[clamp(40px,6vw,96px)] grid grid-cols-12 gap-[clamp(10px,1.2vw,18px)]"
      >
        <motion.li variants={fadeUp} className={`${tile} col-span-12 bg-accent text-white md:col-span-5`}>
          <strong className={tileNumber}>GCU</strong>
          <span className="max-w-[34ch]">
            F.A, Intermediate in Fine Arts
            <br />
            Government College University, Lahore
            <br />
            2017 – 2019
          </span>
        </motion.li>
        <motion.li variants={fadeUp} className={`${tile} col-span-12 bg-white text-ink md:col-span-7`}>
          <strong className={tileNumber}>BNU</strong>
          <span className="max-w-[34ch]">B.Des. in Interdisciplinary Expanded Design &amp; Arts, Beaconhouse National University, 2020 – 2024.</span>
        </motion.li>
        <motion.li variants={fadeUp} className={`${tile} col-span-12 bg-mist md:col-span-7`}>
          <strong className={tileNumber}>Lahore</strong>
          <span className="max-w-[34ch]">
            Based in Lahore, Pakistan. Available for freelance and full-time work. Local time <LahoreTime />.
          </span>
        </motion.li>
        <motion.li variants={fadeUp} className={`${tile} col-span-12 bg-mist md:col-span-5`}>
          <strong className={tileNumber}>Now</strong>
          <span className="max-w-[34ch]">Senior Graphic Designer at Gourmet Pakistan, since 2025.</span>
        </motion.li>
      </motion.ul>
    </section>
  );
}
