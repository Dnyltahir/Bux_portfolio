"use client";

import { motion } from "framer-motion";
import { Reveal } from "./motion/Reveal";
import { RevealText } from "./motion/RevealText";
import { fadeUp, inView, stagger } from "./motion/variants";

const services = [
  { title: "Identity", items: ["Logos & wordmarks", "Visual systems", "Typography & colour", "Identity guidelines"] },
  { title: "Brand", items: ["Brand design", "Rebranding", "Brand kits", "Social media design"] },
  { title: "Packaging", items: ["Boxes & pouches", "Bottle labels", "Dielines", "Print-ready artwork"] },
  { title: "Layout", items: ["Editorial design", "Infographics", "Posters", "Reports & case studies"] },
];

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="gutter relative scroll-mt-[72px] overflow-hidden bg-[radial-gradient(60%_70%_at_0%_100%,rgba(255,75,31,0.38),transparent_70%),radial-gradient(50%_60%_at_100%_30%,rgba(255,75,31,0.22),transparent_70%)] section-pad"
    >
      <Reveal>
        <h2 id="services-title" className="max-w-[16ch] text-balance text-[clamp(34px,5.6vw,88px)] font-medium leading-[1.04] tracking-[-0.04em]">
          <RevealText text="Making ideas impossible to overlook." />
        </h2>
        <p className="mt-5 max-w-[46ch] text-[clamp(17px,1.5vw,21px)] text-white/70">
          I bring brands and concepts to life through visual identities, packaging, digital design, and creative storytelling.
        </p>
      </Reveal>

      <motion.ul
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="-mr-[clamp(16px,2.6vw,40px)] mt-[clamp(36px,5vw,72px)] flex snap-x snap-mandatory gap-[clamp(10px,1.2vw,18px)] overflow-x-auto pb-2 pr-[clamp(16px,2.6vw,40px)] lg:mr-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pr-0"
      >
        {services.map((service) => (
          <motion.li
            key={service.title}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="min-h-[280px] w-[min(78vw,320px)] shrink-0 snap-start rounded-card border border-white/20 bg-white/5 p-[clamp(20px,2vw,30px)] backdrop-blur-md transition-colors hover:bg-white/10 lg:w-auto"
          >
            <h3 className="mb-5 text-[clamp(24px,2.2vw,34px)] font-medium tracking-[-0.03em]">{service.title}</h3>
            <ul className="space-y-2">
              {service.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
