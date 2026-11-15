/*
  The site's motion language, in one place.
  One easing curve, two durations, and two springs. Use these instead of ad-hoc numbers.
  The CSS side (hover colours, shadows, image zooms) uses the same curve and durations: see @theme in app/globals.css.
*/

/** Easing for everything that is not a spring: quick start, long soft landing. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Seconds. FAST for hovers and presses, SLOW for reveals and entrances. */
export const FAST = 0.25;
export const SLOW = 0.8;

/** Spring for things that travel a distance and settle, such as the carousel ring. */
export const SETTLE = { type: "spring", stiffness: 140, damping: 22, mass: 0.9 } as const;

/** Spring for things that follow the pointer, such as the cursor dot and card tilt. */
export const FOLLOW = { stiffness: 220, damping: 24, mass: 0.6 } as const;
