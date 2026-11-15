"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Inertia scrolling for the whole site (Lenis).
 * The wheel and trackpad glide instead of stepping, and links to sections scroll smoothly.
 * Lenis turns its smoothing off by itself for visitors who prefer reduced motion, and leaves touch scrolling native.
 */
export function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    const instance = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1, stopInertiaOnNavigate: true });
    lenis.current = instance;
    return () => {
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  // After moving to another page, start at the top without leftover glide (unless the link points at a section).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!window.location.hash) lenis.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
