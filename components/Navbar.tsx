"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BuxMark } from "./Logo";
import { EASE, SLOW } from "./motion/tokens";

const links = [
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

/**
 * Site header. It slides away while the visitor scrolls down and returns as soon as they scroll up,
 * and on the homepage it underlines the link for the section currently on screen.
 */
export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (y < 120 || y < previous - 2) setHidden(false);
    else if (y > previous + 2) setHidden(true);
  });

  // On each page change: show the header again, and on the homepage track which section sits across the middle of the screen.
  useEffect(() => {
    setCurrent(null);
    setHidden(false); // a new page starts at the top, so bring the header back
    if (pathname !== "/") return;
    const sections = links.map((link) => document.getElementById(link.id)).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: hidden ? "-100%" : 0 }}
      transition={{ duration: SLOW, ease: EASE }}
      className="gutter sticky top-0 z-40 grid h-16 grid-cols-[1fr_auto] items-center bg-base/80 backdrop-blur-md md:h-[72px] md:grid-cols-[1fr_auto_1fr]"
    >
      <Link href="/" aria-label="Bux — home" className="inline-flex items-center gap-2.5 justify-self-start text-[26px] font-bold tracking-[-0.05em]">
        <BuxMark className="size-7" />
        <span>Bux</span>
      </Link>

      <nav aria-label="Main" className="hidden gap-[clamp(18px,2.6vw,36px)] text-[15px] md:flex">
        {links.map((link) => (
          <Link
            key={link.id}
            href={`/#${link.id}`}
            aria-current={current === link.id ? "true" : undefined}
            className="link-slide opacity-70 hover:opacity-100 aria-[current=true]:opacity-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Link href="/#contact" className="inline-flex items-center justify-self-end text-[15px] font-semibold">
        <span className="mr-2.5 inline-block size-[9px] animate-pulse-dot rounded-full bg-accent" />
        <span className="link-slide">Let’s work</span>
      </Link>
    </motion.header>
  );
}
