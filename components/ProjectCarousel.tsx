"use client";

import { animate, motion, useMotionValue, useReducedMotion, type PanInfo } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { slides } from "@/lib/projects";

/** Seconds before the carousel moves on by itself. */
const SLIDE_SECONDS = 4;
/** Space between cards, in pixels. */
const GAP = 16;

const spring = { type: "spring", stiffness: 170, damping: 26 } as const;
const arrow =
  "grid size-11 cursor-pointer place-items-center rounded-full border border-white/40 text-lg text-white transition-colors hover:border-white hover:bg-white hover:text-ink";
const cardLink = "relative block size-full overflow-hidden rounded-card bg-white/5";

type Props = {
  /** False while the hero is off screen: the carousel stops advancing. */
  active: boolean;
};

/**
 * Carousel of every project that has a cover image.
 * Cards sit on one horizontal track. The current card is at the left edge at full size, and the next
 * ones peek in from the right. Move with the arrows, by dragging, or by clicking a peeking card.
 * The progress bar is the timer: when its CSS animation ends the track moves on, so pausing that
 * animation (on hover, keyboard focus or off screen) pauses the carousel.
 */
export function ProjectCarousel({ active }: Props) {
  const reduced = useReducedMotion() ?? false;
  const viewport = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [hold, setHold] = useState(false);
  const x = useMotionValue(0);

  const total = slides.length;
  const slide = slides[index];
  // Share of the visible width one card takes: about one card on phones, up to two and a bit on wide screens.
  const cardWidth = width * (width < 520 ? 0.84 : width < 1000 ? 0.6 : 0.42);
  const step = cardWidth + GAP;
  const go = (delta: number) => setIndex((i) => (i + delta + total) % total);
  const pad = (n: number) => String(n).padStart(2, "0");

  // Measure the visible area, so card width and slide distance follow the layout.
  useEffect(() => {
    const target = viewport.current;
    if (!target) return;
    setWidth(target.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Slide the track to the current card.
  useEffect(() => {
    if (!step) return;
    const controls = animate(x, -index * step, reduced ? { duration: 0 } : spring);
    return () => controls.stop();
  }, [index, step, reduced, x]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    // Distance plus a little of the release speed decides how many cards to move.
    const moved = -(info.offset.x + info.velocity.x * 0.15) / step;
    const next = Math.min(total - 1, Math.max(0, index + Math.round(moved)));
    if (next === index) animate(x, -index * step, spring);
    else setIndex(next);
    window.setTimeout(() => (dragged.current = false), 50);
  };

  // A drag must not open a link, and a click on a peeking card selects it instead of opening it.
  const onCardClick = (event: MouseEvent, i: number) => {
    if (dragged.current) {
      event.preventDefault();
    } else if (i !== index) {
      event.preventDefault();
      setIndex(i);
    }
  };

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="All projects"
      onPointerEnter={() => setHold(true)}
      onPointerLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
      className="flex size-full flex-col text-white"
    >
      {/* Track. Cards fade out towards the right edge. */}
      <div ref={viewport} className="min-h-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,black_90%,transparent)]">
        <motion.div
          drag="x"
          dragConstraints={{ left: -(total - 1) * step, right: 0 }}
          dragElastic={0.12}
          onDragStart={() => (dragged.current = true)}
          onDragEnd={onDragEnd}
          style={{ x, gap: GAP }}
          className="flex h-full cursor-grab active:cursor-grabbing"
        >
          {slides.map((item, i) => {
            const current = i === index;
            const picture = (
              <Image
                src={item.cover}
                alt=""
                fill
                sizes="(min-width: 1000px) 42vw, (min-width: 520px) 60vw, 84vw"
                loading={i < 3 ? "eager" : "lazy"}
                draggable={false}
                className="object-cover"
              />
            );
            const shared = {
              className: cardLink,
              tabIndex: current ? 0 : -1,
              draggable: false,
              onClick: (event: MouseEvent) => onCardClick(event, i),
            };
            return (
              <motion.div
                key={item.href}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${total}: ${item.title}`}
                aria-hidden={!current}
                animate={{ opacity: current ? 1 : 0.45, scale: current ? 1 : 0.93 }}
                transition={{ duration: 0.5 }}
                style={{ width: cardWidth }}
                className="h-full flex-none origin-left"
              >
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener" aria-label={`${item.title} (opens Behance)`} {...shared}>
                    {picture}
                  </a>
                ) : (
                  <Link href={item.href} aria-label={item.title} {...shared}>
                    {picture}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Caption, arrows and the progress bar that times the auto-advance. */}
      <div className="flex items-end justify-between gap-4 pt-[clamp(12px,1.6vw,22px)]">
        <div className="min-w-0">
          <p className="text-[13px] tabular-nums text-white/60">
            {pad(index + 1)} / {pad(total)}
          </p>
          <p aria-live="polite" dir="auto" className="mt-1 truncate text-[clamp(19px,2.3vw,34px)] font-medium leading-[1.15] tracking-[-0.03em]">
            {slide.title}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <motion.button type="button" aria-label="Previous project" onClick={() => go(-1)} whileTap={{ scale: 0.92 }} className={arrow}>
            ←
          </motion.button>
          <motion.button type="button" aria-label="Next project" onClick={() => go(1)} whileTap={{ scale: 0.92 }} className={arrow}>
            →
          </motion.button>
        </div>
      </div>
      <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/20">
        {!reduced && (
          <div
            key={index}
            onAnimationEnd={() => go(1)}
            className="slide-progress h-full origin-left bg-accent"
            style={{ animationDuration: `${SLIDE_SECONDS}s`, animationPlayState: active && !hold ? "running" : "paused" }}
          />
        )}
      </div>
    </div>
  );
}
