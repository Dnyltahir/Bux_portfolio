import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";
import { CursorDot } from "@/components/CursorDot";
import { Navbar } from "@/components/Navbar";
import { SmoothScroll } from "@/components/SmoothScroll";
import { MotionProvider } from "@/components/motion/MotionProvider";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Muhammad Bux — Communication Designer & Visual Artist",
  description:
    "Portfolio of Muhammad Bux, a communication designer and visual artist based in Lahore, Pakistan, working across identity, brand, packaging and layout design.",
  icons: { icon: "/assets/favicon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="font-sans text-[17px] leading-normal">
        <MotionProvider>
          <a
            href="#work"
            className="absolute left-4 -top-16 z-50 rounded-lg bg-white px-3 py-2 text-ink focus:top-2"
          >
            Skip to work
          </a>
          <SmoothScroll />
          <CursorDot />
          {/* Target for "Let’s go up": the very top of the page, above the sticky header. */}
          <span id="top" />
          <Navbar />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
