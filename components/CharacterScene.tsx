"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { FOLLOW } from "./motion/tokens";

/*
  Layered 2.5D character scene.
  Seven flat illustrated layers sit at different depths. The cursor tilts the card and shifts each
  layer by its depth, so the scene reads as 3D. All artwork is inline SVG on one 400 × 400 grid.
  Idle motion (blink, hair sway, floating fragments, rising dust) is CSS, defined in globals.css.
  The figure has no outlines: gradients give its flat shapes a soft, rounded 3D-cartoon look.
*/

const LINE = "#140c1f"; // outline colour
const JACKET_DARK = "#14141c";
const GLOW = "#4df5cf";
const ACCENT = "#ff4b1f";
// Shrinks the figure towards its feet, so the tall hair clears the top of the card.
const FIGURE = "translate(200 372) scale(0.9) translate(-200 -372)";
const BUX_B = "M0 0h100a50 50 0 0 1 0 100a50 50 0 0 1 0 100H0z";

type LayerProps = { depth: number; x: MotionValue<number>; y: MotionValue<number>; children: ReactNode };

/** One depth plane. Positive depth moves with the cursor (foreground), negative against it (background). */
function Layer({ depth, x, y, children }: LayerProps) {
  const tx = useTransform(x, (v) => v * depth);
  const ty = useTransform(y, (v) => v * depth * 0.6);
  return (
    <motion.div style={{ x: tx, y: ty }} className="absolute -inset-[7%]">
      <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden="true">
        {children}
      </svg>
    </motion.div>
  );
}

// Fixed positions (no random numbers, so server and browser render the same markup).
const dust = Array.from({ length: 12 }, (_, i) => ({
  x: 22 + ((i * 79) % 356),
  y: 290 + ((i * 41) % 90),
  r: 1.2 + (i % 3) * 0.6,
  delay: (i * 0.83) % 7,
  duration: 7 + (i % 4),
}));

/** Back wall of the studio: night-blue wall, light pools, a poster and a shelf of packaging. */
export function Wall() {
  return (
    <>
      <defs>
        <linearGradient id="cs-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#12172f" />
          <stop offset="1" stopColor="#27305c" />
        </linearGradient>
        <radialGradient id="cs-screenlight" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={GLOW} stopOpacity="0.5" />
          <stop offset="1" stopColor={GLOW} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cs-lamplight" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffc46b" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffc46b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="-40" y="-40" width="480" height="480" fill="url(#cs-wall)" />
      <circle cx="326" cy="222" r="150" fill="url(#cs-screenlight)" className="char-pulse" />
      <circle cx="66" cy="262" r="120" fill="url(#cs-lamplight)" />

      {/* Poster with the Bux mark */}
      <g stroke={LINE} strokeWidth="2" strokeLinejoin="round">
        <rect x="38" y="128" width="62" height="84" fill={ACCENT} transform="rotate(-3 69 170)" />
      </g>
      <g transform="rotate(-3 69 170) translate(54 148) scale(0.2)">
        <path d={BUX_B} fill="#f4f4f2" />
        <circle cx="175" cy="175" r="25" fill={JACKET_DARK} />
      </g>
      <circle cx="68" cy="131" r="2.4" fill="#f4f4f2" />

      {/* Shelf with packaging mockups */}
      <g stroke={LINE} strokeWidth="2" strokeLinejoin="round">
        <rect x="262" y="150" width="170" height="7" fill="#4a3a56" />
        {/* box */}
        <path d="M276 150V118L296 110L316 118V150Z" fill={ACCENT} />
        <path d="M276 118L296 126L316 118M296 126V150" fill="none" />
        {/* bottle */}
        <path d="M330 150V124C330 118 334 116 334 110V102H344V110C344 116 348 118 348 124V150Z" fill="#f4f4f2" />
        <rect x="330" y="128" width="18" height="12" fill={GLOW} />
        {/* can */}
        <rect x="360" y="122" width="20" height="28" rx="3" fill="#f6c58a" />
        <path d="M360 132H380" fill="none" />
      </g>
      <circle cx="296" cy="138" r="4" fill="#f4f4f2" />
    </>
  );
}

/** Desk level: monitor with an artboard on screen, desk lamp, mug and the desk itself. */
export function Studio() {
  return (
    <>
      <defs>
        <linearGradient id="cs-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bffcf0" />
          <stop offset="1" stopColor="#2c9a9a" />
        </linearGradient>
        <linearGradient id="cs-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cs-desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4b3a58" />
          <stop offset="1" stopColor="#251b30" />
        </linearGradient>
      </defs>

      {/* Monitor */}
      <g stroke={LINE} strokeWidth="2.4" strokeLinejoin="round">
        <path d="M318 268H336L340 304H314Z" fill="#1b1d2e" />
        <rect x="258" y="176" width="140" height="94" rx="6" fill="#0d0f1c" />
        <rect x="265" y="183" width="126" height="76" rx="2" fill="url(#cs-screen)" stroke="none" />
      </g>
      {/* Artboard on screen */}
      <rect x="300" y="192" width="58" height="58" fill="#f4f4f2" />
      <g transform="translate(314 204) scale(0.17)">
        <path d={BUX_B} fill={JACKET_DARK} />
        <circle cx="175" cy="175" r="25" fill={ACCENT} />
      </g>
      <g fill="#0d0f1c" opacity="0.55">
        <rect x="270" y="190" width="6" height="6" />
        <rect x="270" y="200" width="6" height="6" />
        <rect x="270" y="210" width="6" height="6" />
        <rect x="270" y="220" width="6" height="6" />
        <rect x="366" y="192" width="20" height="3" />
        <rect x="366" y="199" width="14" height="3" />
        <rect x="366" y="206" width="20" height="3" />
      </g>

      {/* Desk lamp with a warm cone of light */}
      <path d="M52 236L20 312H112Z" fill="url(#cs-cone)" />
      <g stroke={LINE} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M96 306L104 250L66 222" fill="none" stroke="#c8c8d8" strokeWidth="4" />
        <path d="M96 306L104 250L66 222" fill="none" strokeWidth="1" opacity="0.5" />
        <path d="M40 232L70 212L80 228L50 244Z" fill={ACCENT} />
        <rect x="82" y="300" width="30" height="8" rx="3" fill="#c8c8d8" />
      </g>
      <circle cx="104" cy="250" r="4" fill="#c8c8d8" stroke={LINE} strokeWidth="1.6" />

      {/* Desk */}
      <rect x="-40" y="306" width="480" height="140" fill="url(#cs-desk)" stroke={LINE} strokeWidth="2.4" />
      <path d="M-40 309H440" stroke="#8a74a0" strokeWidth="2" opacity="0.8" />

      {/* Mug with pens */}
      <g stroke={LINE} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M40 284L36 264M48 284L50 258M56 284L62 266" fill="none" stroke="#f4f4f2" strokeWidth="3" />
        <path d="M32 282H64V304C64 308 60 312 56 312H40C36 312 32 308 32 304Z" fill="#f4f4f2" />
      </g>
      <rect x="32" y="290" width="32" height="6" fill={GLOW} opacity="0.9" />
    </>
  );
}

function Dust() {
  return (
    <g fill="#ffe6b8">
      {dust.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={p.r}
          className={`char-rise ${i % 2 ? "max-sm:hidden" : ""}`}
          style={{ animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` }}
        />
      ))}
    </g>
  );
}

/** Ring on the floor around the figure, like a turntable: a circle squashed vertically, so the rotating dot traces an ellipse. */
function Orbit() {
  return (
    <g transform="translate(200 366) scale(0.58 0.11)">
      <circle r="176" fill="none" stroke={GLOW} strokeWidth="1.2" strokeDasharray="3 7" opacity="0.7" />
      <g className="char-orbit">
        <circle r="176" fill="none" />
        <ellipse cx="176" cy="0" rx="5" ry="22" fill={GLOW} />
      </g>
    </g>
  );
}

/** Shared gradients that give the flat shapes a soft, rounded 3D look. */
function Shading() {
  return (
    <defs>
      <radialGradient id="c3-skin" cx="0.38" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#f7c79d" />
        <stop offset="0.6" stopColor="#e7a678" />
        <stop offset="1" stopColor="#c98456" />
      </radialGradient>
      <radialGradient id="c3-jacket" cx="0.35" cy="0.25" r="0.9">
        <stop offset="0" stopColor="#4a4b61" />
        <stop offset="0.55" stopColor="#2b2c3a" />
        <stop offset="1" stopColor="#15151d" />
      </radialGradient>
      <linearGradient id="c3-sleeve" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#404155" />
        <stop offset="1" stopColor="#1b1b25" />
      </linearGradient>
      <linearGradient id="c3-leg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#59607a" />
        <stop offset="0.5" stopColor="#434a61" />
        <stop offset="1" stopColor="#2b3044" />
      </linearGradient>
      <radialGradient id="c3-shoe" cx="0.35" cy="0.25" r="0.9">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#c9cbd6" />
      </radialGradient>
      <linearGradient id="c3-hair" x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0" stopColor="#4b4063" />
        <stop offset="0.5" stopColor="#2a2236" />
        <stop offset="1" stopColor="#130e1a" />
      </linearGradient>
      <radialGradient id="c3-iris" cx="0.5" cy="0.65" r="0.6">
        <stop offset="0" stopColor="#b9773a" />
        <stop offset="0.6" stopColor="#6a3b1c" />
        <stop offset="1" stopColor="#2c160b" />
      </radialGradient>
      <radialGradient id="c3-blush" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#f2775c" stopOpacity="0.5" />
        <stop offset="1" stopColor="#f2775c" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/** Body of the cartoon figure: small rounded body, arms held slightly out, standing on the floor. */
function Body() {
  return (
    <g transform={FIGURE}>
      <Shading />
      <ellipse cx="200" cy="371" rx="66" ry="8" fill="#000" opacity="0.4" />
      <g className="char-breathe">
        {/* Legs, socks and trainers */}
        <path d="M168 280H198L196 344H170Z" fill="url(#c3-leg)" />
        <path d="M202 280H232L230 344H204Z" fill="url(#c3-leg)" />
        <rect x="171" y="340" width="24" height="14" rx="4" fill="#f4f4f6" />
        <rect x="205" y="340" width="24" height="14" rx="4" fill="#f4f4f6" />
        <path d="M160 362C160 353 168 349 178 349H190C196 349 199 353 199 359V366C199 369 197 371 194 371H166C162 371 160 368 160 362Z" fill="url(#c3-shoe)" />
        <path d="M240 362C240 353 232 349 222 349H210C204 349 201 353 201 359V366C201 369 203 371 206 371H234C238 371 240 368 240 362Z" fill="url(#c3-shoe)" />
        <path d="M176 349H194V357H176ZM206 349H224V357H206Z" fill={ACCENT} />
        <path d="M164 365H196M204 365H236" stroke="#9fa3b3" strokeWidth="2" strokeLinecap="round" />

        {/* Arms: thick rounded sleeves with hands */}
        <path d="M170 212L130 276" stroke="url(#c3-sleeve)" strokeWidth="24" strokeLinecap="round" />
        <path d="M230 212L270 276" stroke="url(#c3-sleeve)" strokeWidth="24" strokeLinecap="round" />
        <ellipse cx="122" cy="290" rx="11" ry="13" fill="url(#c3-skin)" transform="rotate(32 122 290)" />
        <ellipse cx="278" cy="290" rx="11" ry="13" fill="url(#c3-skin)" transform="rotate(-32 278 290)" />
        {/* Glowing wristband and sleeve pattern */}
        <path d="M262 270L277 280" stroke={GLOW} strokeWidth="6" strokeLinecap="round" className="char-pulse" />
        <path d="M240 226L250 232L246 242L256 248L252 258" fill="none" stroke={GLOW} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="char-pulse" />

        {/* Neck and shirt collar */}
        <rect x="191" y="176" width="18" height="22" rx="6" fill="#c98456" />
        {/* Puffy quilted jacket */}
        <path d="M164 208C164 196 180 190 200 190C220 190 236 196 236 208L242 278C243 290 226 296 200 296C174 296 157 290 158 278Z" fill="url(#c3-jacket)" />
        <g fill="none" stroke="#0c0c12" strokeWidth="1.6" opacity="0.55">
          <path d="M162 226Q200 234 238 226M160 250Q200 258 240 250M159 274Q200 282 241 274" />
        </g>
        <path d="M200 204V296" stroke="#70728a" strokeWidth="3" />
        <path d="M188 190L200 206L212 190Z" fill="#b7d1f2" />
        <path d="M180 192C184 188 190 187 193 189L200 206L186 204Z" fill="#33344a" />
        <path d="M220 192C216 188 210 187 207 189L200 206L214 204Z" fill="#33344a" />
        {/* Soft highlight on the lit shoulder, teal rim light on the far side */}
        <ellipse cx="180" cy="212" rx="12" ry="6" fill="#fff" opacity="0.1" />
        <path d="M239 216L243 276" stroke={GLOW} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </g>
    </g>
  );
}

/** One large glossy cartoon eye. */
function Eye({ cx }: { cx: number }) {
  return (
    <g>
      <ellipse cx={cx} cy="130" rx="13.5" ry="14.5" fill="#fff" />
      <circle cx={cx} cy="131" r="9.5" fill="url(#c3-iris)" />
      <circle cx={cx} cy="131" r="4.6" fill="#0e0706" />
      <circle cx={cx - 3.4} cy="126.6" r="3.1" fill="#fff" />
      <circle cx={cx + 3.6} cy="135" r="1.5" fill="#fff" opacity="0.85" />
      {/* soft shadow under the upper lid */}
      <path d={`M${cx - 13.500} 127Q${cx} 108 ${cx + 13.500} 127Q${cx} 117 ${cx - 13.500} 127Z`} fill="#3a2a2a" opacity="0.22" />
    </g>
  );
}

/** Oversized cartoon head: big eyes, small nose, short beard and a tall swept-up quiff. */
function Head() {
  return (
    <g transform={FIGURE}>
      <Shading />
      {/* Ears */}
      <ellipse cx="149" cy="136" rx="9" ry="13" fill="url(#c3-skin)" />
      <ellipse cx="251" cy="136" rx="9" ry="13" fill="url(#c3-skin)" />
      <ellipse cx="149" cy="137" rx="4" ry="7" fill="#c98456" />
      <ellipse cx="251" cy="137" rx="4" ry="7" fill="#c98456" />

      {/* Head */}
      <path d="M150 126C150 94 172 78 200 78C228 78 250 94 250 126C250 158 232 181 200 181C168 181 150 158 150 126Z" fill="url(#c3-skin)" />
      <ellipse cx="170" cy="149" rx="12" ry="9" fill="url(#c3-blush)" />
      <ellipse cx="230" cy="149" rx="12" ry="9" fill="url(#c3-blush)" />

      {/* Short beard and moustache, joined to the sideburns */}
      <path
        d="M151 132C152 160 170 182 200 182C230 182 248 160 249 132C246 148 238 158 227 161C222 155 212 153 200 153C188 153 178 155 173 161C162 158 154 148 151 132Z"
        fill="url(#c3-hair)"
      />
      <path d="M189 162Q200 172 211 162Q200 165 189 162Z" fill="#fff" stroke="#5a2a22" strokeWidth="1.2" strokeLinejoin="round" />

      {/* Nose */}
      <ellipse cx="200" cy="146" rx="6" ry="4.6" fill="#e9906c" />
      <ellipse cx="198.500" cy="144.600" rx="2.2" ry="1.4" fill="#fff" opacity="0.5" />

      {/* Eyes (blink together) and brows */}
      <g className="char-blink">
        <Eye cx={180} />
        <Eye cx={220} />
      </g>
      <g fill="none" stroke="#1d1626" strokeWidth="5" strokeLinecap="round">
        <path d="M167 111Q179 103 192 109" />
        <path d="M233 111Q221 103 208 109" />
      </g>

      {/* Hair: a tall quiff swept up and to one side, swaying slightly */}
      <g className="char-sway">
        <path
          d="M150 122C143 94 156 68 186 60C198 44 228 40 246 52C240 55 238 59 240 64C256 74 259 98 250 122C247 106 239 96 227 92C207 98 181 96 165 102C157 108 153 114 150 122Z"
          fill="url(#c3-hair)"
        />
        <path d="M178 64C182 46 198 38 210 40C203 47 199 56 199 64Z" fill="url(#c3-hair)" />
        <path d="M198 54C206 34 226 28 240 33C231 39 227 48 229 57Z" fill="url(#c3-hair)" />
        <path d="M226 50C238 38 254 38 262 47C253 49 247 55 247 63Z" fill="url(#c3-hair)" />
        <g fill="none" stroke="#6b5f8c" strokeWidth="2.6" strokeLinecap="round" opacity="0.8">
          <path d="M166 92Q182 72 206 66" />
          <path d="M188 84Q206 70 230 68" />
          <path d="M210 44Q220 38 232 37" />
        </g>
        <path d="M252 78C258 92 257 108 251 120" fill="none" stroke={GLOW} strokeWidth="2" strokeLinecap="round" opacity="0.65" />
      </g>

      {/* Soft highlight on the forehead */}
      <ellipse cx="180" cy="104" rx="14" ry="6" fill="#fff" opacity="0.12" />
    </g>
  );
}

/** Floating design-tool fragments in front of the figure: colour swatches and a type sample. */
function Fragments() {
  return (
    <>
      <g className="char-float" style={{ animationDelay: "0s" }}>
        <g transform="rotate(-8 62 86)">
          <rect x="30" y="68" width="64" height="36" rx="6" fill="#0d1226" fillOpacity="0.82" stroke={GLOW} strokeWidth="1.2" />
          <rect x="37" y="76" width="14" height="20" rx="2" fill={ACCENT} />
          <rect x="55" y="76" width="14" height="20" rx="2" fill={GLOW} />
          <rect x="73" y="76" width="14" height="20" rx="2" fill="#f4f4f2" />
        </g>
      </g>
      <g className="char-float" style={{ animationDelay: "1.4s" }}>
        <g transform="rotate(7 338 84)">
          <rect x="312" y="60" width="54" height="46" rx="6" fill="#0d1226" fillOpacity="0.82" stroke={GLOW} strokeWidth="1.2" />
          <text x="339" y="93" textAnchor="middle" fontSize="26" fontWeight="700" fill="#f4f4f2">
            Aa
          </text>
        </g>
      </g>
    </>
  );
}

export function CharacterScene() {
  const reduced = useReducedMotion() ?? false;
  const card = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [touch, setTouch] = useState(false);

  // Cursor position over the card, from -1 to 1. Springs give the elastic settle and the return to centre.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, FOLLOW);
  const sy = useSpring(py, FOLLOW);
  const rotateY = useTransform(sx, (v) => v * 9);
  const rotateX = useTransform(sy, (v) => v * -7);

  // Touch screens get the lighter version: no tilt, fewer moving parts.
  useEffect(() => {
    setTouch(window.matchMedia("(hover: none), (pointer: coarse)").matches);
  }, []);

  // Pause every idle animation while the scene is off screen.
  useEffect(() => {
    const target = card.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting), { threshold: 0.05 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const interactive = !reduced && !touch;

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const box = event.currentTarget.getBoundingClientRect();
    px.set(((event.clientX - box.left) / box.width) * 2 - 1);
    py.set(((event.clientY - box.top) / box.height) * 2 - 1);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div
      ref={card}
      role="img"
      aria-label="Cartoon character of Muhammad Bux in a soft 3D style: a big head with large eyes, a tall dark quiff and a short beard, wearing a black quilted jacket, trousers and white trainers, standing in a design studio at night."
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-paused={paused}
      data-lite={touch}
      className="char-scene relative aspect-square [perspective:1100px]"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative size-full overflow-hidden rounded-card bg-[#12172f] shadow-[0_30px_80px_-30px_rgba(18,23,47,0.75)]"
      >
        <Layer depth={-20} x={sx} y={sy}>
          <Wall />
        </Layer>
        <Layer depth={-13} x={sx} y={sy}>
          <Studio />
        </Layer>
        <Layer depth={-6} x={sx} y={sy}>
          <Dust />
        </Layer>
        <Layer depth={4} x={sx} y={sy}>
          <Orbit />
        </Layer>
        <Layer depth={10} x={sx} y={sy}>
          <Body />
        </Layer>
        <Layer depth={17} x={sx} y={sy}>
          <Head />
        </Layer>
        <Layer depth={30} x={sx} y={sy}>
          <Fragments />
        </Layer>

        {/* Corner brackets: fixed to the card, above all layers */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-3 sm:inset-4">
            <span className="absolute left-0 top-0 size-5 border-l border-t border-[#4df5cf]" />
            <span className="absolute right-0 top-0 size-5 border-r border-t border-[#4df5cf]" />
            <span className="absolute bottom-0 left-0 size-5 border-b border-l border-[#4df5cf]" />
            <span className="absolute bottom-0 right-0 size-5 border-b border-r border-[#4df5cf]" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
