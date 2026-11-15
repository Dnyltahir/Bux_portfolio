"use client";

import { motion } from "framer-motion";
import { FadeImage } from "./FadeImage";
import { RevealText } from "./motion/RevealText";
import Link from "next/link";
import { behanceProfile, moreProjects, projects, type ArchiveProject, type Project } from "@/lib/projects";
import { Reveal } from "./motion/Reveal";
import { fadeUp, inView, stagger } from "./motion/variants";

const spans: Record<Project["span"], string> = {
  4: "md:col-span-4",
  6: "md:col-span-6",
  8: "md:col-span-8",
};

const cardClass = "group block";

/**
 * A featured project: the whole cover in its own proportions (nothing cropped), with the title and
 * tags underneath so they never sit on top of the artwork.
 */
function CardContent({ project }: { project: Project }) {
  return (
    <>
      <span className="relative block aspect-[808/632] overflow-hidden rounded-card bg-mist transition-shadow group-hover:shadow-[0_0_0_2px_var(--color-accent),0_26px_60px_-20px_rgba(255,75,31,0.6)] group-focus-visible:shadow-[0_0_0_2px_var(--color-accent)]">
        <FadeImage
          src={project.cover}
          alt={project.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover group-hover:scale-[1.03]"
        />
      </span>
      <span className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <span className="text-[clamp(17px,1.5vw,21px)] font-medium leading-snug tracking-[-0.01em] transition-colors group-hover:text-accent">
          {project.title}
          <span aria-hidden="true">{project.external ? " ↗" : " →"}</span>
        </span>
        <span className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-mist px-3 py-1 text-[13px] text-paper/85">
              {tag}
            </span>
          ))}
        </span>
      </span>
    </>
  );
}

/** Compact card for the full project list: cover image with the title underneath. Opens the Behance project. */
function ArchiveCard({ project }: { project: ArchiveProject }) {
  return (
    <motion.li variants={fadeUp} initial="hidden" whileInView="show" viewport={inView} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
      <a href={project.href} target="_blank" rel="noopener" data-cursor="View" className="group block">
        <span className="relative block aspect-[808/632] overflow-hidden rounded-[clamp(12px,1.4vw,20px)] bg-mist transition-shadow group-hover:shadow-[0_0_0_2px_var(--color-accent),0_18px_40px_-18px_rgba(255,75,31,0.6)]">
          {project.cover ? (
            <FadeImage
              src={project.cover}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover group-hover:scale-105"
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center bg-surface px-4 text-center text-sm text-white/70">View on Behance</span>
          )}
        </span>
        <span dir="auto" className="mt-2.5 block text-[15px] font-medium leading-snug transition-colors group-hover:text-accent">
          {project.title} <span aria-hidden="true">↗</span>
        </span>
      </a>
    </motion.li>
  );
}

export function Projects() {
  return (
    <section id="work" aria-labelledby="work-title" className="gutter scroll-mt-20 pb-[clamp(52px,7vw,112px)]">
      <Reveal>
        <h2 id="work-title" className="mb-[clamp(20px,3vw,40px)] text-[clamp(30px,3.6vw,54px)] font-medium leading-[1.05] tracking-[-0.035em]">
          <RevealText text="Selected Work" />
        </h2>
      </Reveal>

      <motion.ul
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-12 gap-x-[clamp(10px,1.2vw,18px)] gap-y-[clamp(24px,3vw,44px)]"
      >
        {projects.map((project) => (
          <motion.li
            key={project.title}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.99 }}
            className={`col-span-12 ${spans[project.span]}`}
          >
            {project.external ? (
              <a href={project.href} target="_blank" rel="noopener" data-cursor="View" className={cardClass}>
                <CardContent project={project} />
              </a>
            ) : (
              <Link href={project.href} data-cursor="View" className={cardClass}>
                <CardContent project={project} />
              </Link>
            )}
          </motion.li>
        ))}
      </motion.ul>

      <Reveal className="mt-[clamp(48px,7vw,104px)] flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-[clamp(24px,2.6vw,38px)] font-medium leading-[1.05] tracking-[-0.03em]">More work</h3>
        <p className="text-[15px] text-muted">
          {moreProjects.length} more projects · {projects.length + moreProjects.length} in total
        </p>
      </Reveal>
      <ul className="mt-[clamp(16px,2.4vw,32px)] grid grid-cols-2 gap-x-[clamp(10px,1.2vw,18px)] gap-y-[clamp(20px,2.4vw,34px)] sm:grid-cols-3 lg:grid-cols-4">
        {moreProjects.map((project) => (
          <ArchiveCard key={project.href} project={project} />
        ))}
      </ul>

      <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={inView} className="mt-[clamp(28px,4vw,48px)] text-[clamp(18px,1.6vw,22px)] font-medium">
        <a href={behanceProfile} target="_blank" rel="noopener" className="link-slide link-slide-on hover:text-accent">
          Open the full Behance profile <span aria-hidden="true">↗</span>
        </a>
      </motion.p>
    </section>
  );
}
