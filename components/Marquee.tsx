const items = ["Logos", "Visual identities", "Rebranding", "Packaging", "Labels", "Editorial layout", "Infographics", "Social media", "Exhibition design", "Motion graphics", "Projection mapping"];

/** Endless strip of what Bux makes. The list is doubled so the loop is seamless. */
export function Marquee() {
  return (
    <div aria-hidden="true" className="overflow-hidden py-[clamp(40px,5.5vw,84px)]">
      <div className="flex w-max animate-marquee">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center whitespace-nowrap px-[clamp(20px,3vw,44px)] text-[clamp(16px,1.5vw,20px)] text-muted after:ml-[clamp(40px,6vw,88px)] after:size-[5px] after:rounded-full after:bg-accent after:content-['']"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
