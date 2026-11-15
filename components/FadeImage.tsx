"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * next/image that fades in once it has loaded, instead of popping in.
 * Put it on a tinted container (for example `bg-mist`) so the empty state reads as a placeholder.
 */
export function FadeImage({ className = "", onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      {...props}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      className={`${className} transition-[opacity,transform] duration-800 ${loaded ? "opacity-100" : "opacity-0"}`}
    />
  );
}
