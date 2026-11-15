import Image from "next/image";

/*
  "Worked with" logo carousel, in pure black on white (like a one-colour vector logo).
  The source files are colour JPEGs, so each one gets a CSS filter that turns it into black artwork on a
  white tile: greyscale first, then inverted if the original was light-on-dark, then pushed to full
  contrast so no greys are left. The numbers differ per logo because their original colours differ.
  Real one-colour vector files (SVG) would be sharper: drop them into public/assets/clients and remove the filter.
*/
const clients: { name: string; file: string; filter: string; fill?: boolean }[] = [
  { name: "WWF", file: "wwf.jpg", filter: "grayscale(1) contrast(1.4)" },
  // Orange on off-white: darken first, so the orange lands below the mid-point and turns black.
  { name: "Gourmet Foods", file: "gourmet-foods.jpg", filter: "grayscale(1) brightness(0.62) contrast(8)" },
  // White on a colour: invert, then lift the old background to white.
  { name: "Facia", file: "facia.jpg", filter: "grayscale(1) invert(1) contrast(4)", fill: true },
  { name: "AML Watcher", file: "aml-watcher.jpg", filter: "grayscale(1) invert(1) contrast(4)" },
  {
    name: "Tourism, Archaeology & Museums Department, Government of the Punjab",
    file: "tourism-punjab.jpg",
    filter: "grayscale(1) invert(1) brightness(1.7) contrast(5)",
  },
  { name: "Zain Zohaib, Sufi Qawwal", file: "zain-zohaib.jpg", filter: "grayscale(1) contrast(3)", fill: true },
  { name: "DAMN: Drama, Arts, Media, Narratives", file: "damn.jpg", filter: "grayscale(1) invert(1) contrast(3)" },
  { name: "Joy of Urdu", file: "joy-of-urdu.jpg", filter: "grayscale(1) contrast(1.6)" },
  { name: "Ravi Bachao", file: "ravi-bachao.jpg", filter: "grayscale(1) contrast(1.6)" },
];

// `fill: true` is for square files with a lot of empty margin: the image covers the tile, so the logo reads larger.
function Tile({ client, hidden = false }: { client: (typeof clients)[number]; hidden?: boolean }) {
  return (
    <li
      aria-hidden={hidden || undefined}
      className="relative h-[clamp(92px,9vw,124px)] w-[clamp(150px,15vw,208px)] shrink-0 overflow-hidden rounded-[clamp(12px,1.4vw,20px)] bg-white"
    >
      <Image
        src={`/assets/clients/${client.file}`}
        alt={hidden ? "" : client.name}
        fill
        sizes="208px"
        style={{ filter: client.filter }}
        className={client.fill ? "object-cover" : "object-contain p-[6%]"}
      />
    </li>
  );
}

/** Endless strip of client logos. It pauses while the pointer is over it. The list is doubled so the loop is seamless. */
export function Clients() {
  return (
    <section aria-labelledby="clients-title" className="py-[clamp(40px,5.5vw,84px)]">
      <h2 id="clients-title" className="gutter mb-[clamp(16px,2vw,28px)] text-[13px] uppercase tracking-[0.08em] text-muted">
        Worked with
      </h2>
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:overflow-x-auto">
        <ul className="flex w-max animate-marquee gap-[clamp(10px,1.2vw,18px)] pr-[clamp(10px,1.2vw,18px)] hover:[animation-play-state:paused]">
          {clients.map((client) => (
            <Tile key={client.file} client={client} />
          ))}
          {clients.map((client) => (
            <Tile key={`${client.file}-copy`} client={client} hidden />
          ))}
        </ul>
      </div>
    </section>
  );
}
