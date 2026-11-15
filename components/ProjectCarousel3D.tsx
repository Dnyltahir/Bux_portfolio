"use client";

import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { FadeImage } from "./FadeImage";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import { slides, type Slide } from "@/lib/projects";
import { FOLLOW, SETTLE } from "./motion/tokens";

/*
  3D ring carousel, built with CSS 3D transforms and Framer Motion (no WebGL).
  Cards stand around a cylinder: card i is turned by i × STEP degrees and pushed out by the radius.
  The whole ring is pulled back by the radius, so the front card sits on the screen plane, and turning
  the ring brings another card to the front. Only transform and opacity are animated.
*/

const TOTAL = slides.length;
/** Angle between neighbouring cards, in degrees. */
const STEP = 360 / TOTAL;
const PERSPECTIVE = 1200;
/** Height of the text area under each card's image, in pixels. */
const INFO_HEIGHT = 96;
/** Height of a cover as a share of its width. Behance covers are 808 × 632, so this shows them uncropped. */
const COVER_RATIO = 632 / 808;

const mod = (n: number, m: number) => ((n % m) + m) % m;
/** Smallest signed number of steps from card `from` to card `to` around the ring. */
const shortest = (from: number, to: number) => {
  const d = mod(to - from, TOTAL);
  return d > TOTAL / 2 ? d - TOTAL : d;
};

const arrow =
  "grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-white/40 text-lg text-white transition-colors hover:border-white hover:bg-white hover:text-ink";

type CardProps = {
  slide: Slide;
  i: number;
  rotation: MotionValue<number>;
  current: boolean;
  width: number;
  radius: number;
  tilt: boolean;
  onSelect: (event: MouseEvent, i: number) => void;
};

function Card({ slide, i, rotation, current, width, radius, tilt, onSelect }: CardProps) {
  // Angle between this card and the front of the ring, 0 to 180 degrees.
  const distance = useTransform(rotation, (v) => Math.abs(mod(i * STEP + v + 180, 360) - 180));
  // Depth of field: the front card is full strength, cards further round fade and shrink.
  const opacity = useTransform(distance, [0, STEP, STEP * 3, 90], [1, 0.7, 0.45, 0.2]);
  const scale = useTransform(distance, [0, STEP, 90], [1, 0.94, 0.86]);

  // Hover tilt and moving highlight on the front card.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, (v) => v * 7), FOLLOW);
  const rotateX = useSpring(useTransform(py, (v) => v * -7), FOLLOW);
  const shineX = useTransform(px, (v) => `${v * 30}%`);
  const shineY = useTransform(py, (v) => `${v * 30}%`);
  const interactive = current && tilt;

  const onMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const box = event.currentTarget.getBoundingClientRect();
    px.set(((event.clientX - box.left) / box.width) * 2 - 1);
    py.set(((event.clientY - box.top) / box.height) * 2 - 1);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const body = (
    <>
      <span className="relative block overflow-hidden bg-white/5" style={{ height: width * COVER_RATIO }}>
        <FadeImage
          src={slide.cover}
          alt=""
          fill
          sizes="(min-width: 1000px) 30vw, 70vw"
          loading={i < 3 || i > TOTAL - 3 ? "eager" : "lazy"}
          draggable={false}
          className="object-cover"
        />
        {/* Highlight that follows the pointer on the front card. */}
        <motion.span
          aria-hidden="true"
          style={{ x: shineX, y: shineY }}
          className={`pointer-events-none absolute -inset-1/2 bg-[radial-gradient(closest-side,rgba(255,255,255,0.38),transparent)] transition-opacity ${
            interactive ? "opacity-0 group-hover:opacity-100" : "opacity-0"
          }`}
        />
      </span>
      <span className="flex flex-col justify-center gap-1.5 px-4" style={{ height: INFO_HEIGHT }}>
        <span dir="auto" className="truncate text-[17px] font-medium leading-tight tracking-[-0.02em]">
          {slide.title}
        </span>
        <span className="flex items-center justify-between gap-3">
          <span className="flex min-w-0 gap-1.5 overflow-hidden max-sm:hidden">
            {slide.tags.map((tag) => (
              <span key={tag} className="shrink-0 rounded-full bg-white/12 px-2.5 py-0.5 text-[12px] text-white/85">
                {tag}
              </span>
            ))}
          </span>
          <span className={`shrink-0 text-[13px] font-medium text-accent transition-opacity ${current ? "opacity-100" : "opacity-0"}`}>
            {slide.external ? "View on Behance ↗" : "View case study →"}
          </span>
        </span>
      </span>
    </>
  );

  const linkProps = {
    tabIndex: current ? 0 : -1,
    // The front card opens the project; everywhere else on the stage the cursor says "Drag".
    "data-cursor": current ? "View" : undefined,
    draggable: false,
    onClick: (event: MouseEvent) => onSelect(event, i),
    className: "block",
  };

  return (
    // Position on the ring. The hidden back face keeps cards on the far side from showing mirrored.
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${i + 1} of ${TOTAL}: ${slide.title}`}
      aria-hidden={!current}
      className="absolute left-1/2 top-1/2 [backface-visibility:hidden]"
      style={{
        width,
        marginLeft: -width / 2,
        marginTop: -(width * COVER_RATIO + INFO_HEIGHT) / 2,
        transform: `rotateY(${i * STEP}deg) translateZ(${radius}px)`,
      }}
    >
      <motion.div style={{ opacity, scale }}>
        <motion.div
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          style={{ rotateX, rotateY, transformPerspective: 900 }}
          className={`group overflow-hidden rounded-[clamp(14px,1.6vw,22px)] bg-[#24242b] text-white transition-shadow ${
            current
              ? "shadow-[0_0_0_1.5px_var(--color-accent),0_30px_70px_-20px_rgba(255,75,31,0.55)]"
              : "shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
          }`}
        >
          {slide.external ? (
            <a href={slide.href} target="_blank" rel="noopener" aria-label={`${slide.title} (opens Behance)`} {...linkProps}>
              {body}
            </a>
          ) : (
            <Link href={slide.href} aria-label={`${slide.title}: view case study`} {...linkProps}>
              {body}
            </Link>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

type Props = {
  /** True while the hero is on screen: arrow keys then turn the ring. */
  active: boolean;
};

export function ProjectCarousel3D({ active }: Props) {
  const reduced = useReducedMotion() ?? false;
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; startRotation: number; lastX: number; lastTime: number; velocity: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const running = useRef<ReturnType<typeof animate> | null>(null);

  const [size, setSize] = useState({ width: 0, height: 0 });
  // Unbounded step count, so the ring can keep turning in one direction. The front card is position mod TOTAL.
  const [position, setPosition] = useState(0);
  const [finePointer, setFinePointer] = useState(false);
  const rotation = useMotionValue(0);

  const front = mod(position, TOTAL);

  // Card width follows the stage: about 30% of it on wide screens, 70% on phones, and never too tall to fit.
  const byWidth = size.width < 520 ? size.width * 0.7 : size.width * 0.3;
  const byHeight = (size.height * 0.94 - INFO_HEIGHT) / COVER_RATIO;
  const cardWidth = Math.max(180, Math.min(byWidth, byHeight, 440));
  // Radius that places TOTAL cards of this width side by side around the ring, with a small gap.
  const radius = Math.round((cardWidth * 1.08) / 2 / Math.tan(Math.PI / TOTAL));
  const degreesPerPixel = 180 / Math.PI / radius;

  useEffect(() => {
    const target = stage.current;
    if (!target) return;
    const measure = () => setSize({ width: target.clientWidth, height: target.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(target);
    setFinePointer(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    return () => observer.disconnect();
  }, []);

  /** Turn the ring so the given position is at the front. Reduced motion: jump without inertia. */
  const turnTo = useCallback(
    (next: number) => {
      setPosition(next);
      running.current?.stop();
      running.current = animate(rotation, -next * STEP, reduced ? { duration: 0 } : SETTLE);
    },
    [reduced, rotation]
  );

  // Left and right arrow keys, while the hero is on screen and the visitor is not typing in a field.
  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (event.key === "ArrowRight") turnTo(position + 1);
      else if (event.key === "ArrowLeft") turnTo(position - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, position, turnTo]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    running.current?.stop();
    drag.current = { startX: event.clientX, startRotation: rotation.get(), lastX: event.clientX, lastTime: event.timeStamp, velocity: 0, moved: false };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state) return;
    const dx = event.clientX - state.startX;
    if (!state.moved && Math.abs(dx) > 6) {
      state.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (!state.moved) return;
    const dt = event.timeStamp - state.lastTime;
    if (dt > 0) state.velocity = (event.clientX - state.lastX) / dt; // pixels per millisecond
    state.lastX = event.clientX;
    state.lastTime = event.timeStamp;
    rotation.set(state.startRotation + dx * degreesPerPixel);
  };

  const onPointerUp = () => {
    const state = drag.current;
    drag.current = null;
    if (!state?.moved) return;
    // Momentum: carry on in the release direction, then snap to the nearest card.
    const projected = rotation.get() + state.velocity * 220 * degreesPerPixel;
    turnTo(Math.round(-projected / STEP));
    suppressClick.current = true;
    window.setTimeout(() => (suppressClick.current = false), 60);
  };

  // A drag never opens a link. A click on a side card brings it to the front; a click on the front card opens it.
  const onSelect = (event: MouseEvent, i: number) => {
    if (suppressClick.current) {
      event.preventDefault();
    } else if (i !== front) {
      event.preventDefault();
      turnTo(position + shortest(front, i));
    }
  };

  return (
    <div role="group" aria-roledescription="carousel" aria-label="All projects" className="flex size-full flex-col text-white">
      <div
        ref={stage}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        data-cursor="Drag"
        className="relative min-h-0 flex-1 cursor-grab touch-pan-y select-none active:cursor-grabbing"
        style={{ perspective: PERSPECTIVE }}
      >
        {size.width > 0 && (
          <motion.div style={{ z: -radius, rotateY: rotation, transformStyle: "preserve-3d" }} className="absolute inset-0">
            {slides.map((slide, i) => (
              <Card
                key={slide.href}
                slide={slide}
                i={i}
                rotation={rotation}
                current={i === front}
                width={cardWidth}
                radius={radius}
                tilt={finePointer && !reduced}
                onSelect={onSelect}
              />
            ))}
          </motion.div>
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        Project {front + 1} of {TOTAL}: {slides[front].title}
      </p>

      {/* Previous and next buttons with a dot for every project. */}
      <div className="flex items-center justify-center gap-[clamp(10px,2vw,24px)] pt-[clamp(10px,1.4vw,18px)]">
        <motion.button type="button" aria-label="Previous project" onClick={() => turnTo(position - 1)} whileTap={{ scale: 0.92 }} className={arrow}>
          ←
        </motion.button>
        <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5">
          {slides.map((slide, i) => (
            <button
              key={slide.href}
              type="button"
              aria-label={`Go to project ${i + 1}: ${slide.title}`}
              aria-current={i === front}
              onClick={() => turnTo(position + shortest(front, i))}
              className="grid size-5 cursor-pointer place-items-center"
            >
              <span className={`block size-2 rounded-full transition-[transform,background-color] ${i === front ? "scale-125 bg-accent" : "bg-white/35 hover:bg-white/70"}`} />
            </button>
          ))}
        </div>
        <motion.button type="button" aria-label="Next project" onClick={() => turnTo(position + 1)} whileTap={{ scale: 0.92 }} className={arrow}>
          →
        </motion.button>
      </div>
    </div>
  );
}
