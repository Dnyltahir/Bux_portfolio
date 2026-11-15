import type { Metadata } from "next";
import { FadeImage } from "@/components/FadeImage";
import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Gourmet Cola Rebranding — Muhammad Bux",
  description: "Case study: brand identity and packaging redesign for Gourmet Cola by Muhammad Bux.",
};

// Images load from Behance for now: replace with files in public/assets before launch.
const modules = "https://mir-s3-cdn-cf.behance.net/project_modules";
const cover = `${modules}/2800_webp/727252258267857.6af24c4722690.png`;
const gallery = [
  `${modules}/1400_webp/d942ef258267857.6af24c4723fae.png`,
  `${modules}/1400_webp/30f346258267857.6af24c4723acf.png`,
  `${modules}/1400_webp/32a8d7258267857.6af24c4722b62.png`,
  `${modules}/1400_webp/1c6690258267857.6af24c47235b5.png`,
  `${modules}/1400_webp/d32445258267857.6af24c4723009.png`,
];
const behanceProject = "https://www.behance.net/gallery/258267857/Gourmet-Cola-Rebranding";
const nextProject = "https://www.behance.net/gallery/258267909/Beverages-Label-Design";

const facts = [
  { term: "Project", detail: "Gourmet Cola" },
  { term: "Year", detail: "2026" },
  { term: "Scope", detail: "Brand identity, packaging redesign" },
];

/** A numbered case-study section: label on the left, text on the right, optional full-width content below. */
function Block({ number, title, id, children, wide }: { number: string; title: string; id?: string; children: ReactNode; wide?: ReactNode }) {
  return (
    <section id={id} className="gutter grid grid-cols-12 gap-x-[clamp(16px,2.6vw,40px)] gap-y-[clamp(24px,3vw,48px)] pt-[clamp(56px,8vw,120px)]">
      <Reveal className="col-span-12 md:col-span-4">
        <h2 className="text-[clamp(22px,2.2vw,32px)] font-medium tracking-[-0.03em]">
          <span className="mb-1.5 block text-sm tracking-normal text-accent tabular-nums">{number}</span>
          {title}
        </h2>
      </Reveal>
      <Reveal className="col-span-12 grid max-w-[760px] gap-[18px] md:col-span-8">{children}</Reveal>
      {wide && <div className="col-span-12">{wide}</div>}
    </section>
  );
}

function Lead({ children }: { children: ReactNode }) {
  return <p className="text-balance text-[clamp(24px,2.9vw,42px)] font-medium leading-[1.15] tracking-[-0.03em]">{children}</p>;
}

/** A note marking copy that Bux still needs to write. */
function Todo({ children }: { children: ReactNode }) {
  return <p className="max-w-[54ch] rounded-[14px] border border-dashed border-white/30 px-[18px] py-3.5 text-[15px] text-muted">To write: {children}</p>;
}

export default function GourmetColaPage() {
  return (
    <>
      <main>
        <section className="gutter pb-[clamp(28px,4vw,56px)] pt-[clamp(20px,3vw,40px)]">
          <Reveal>
            <Link href="/#work" className="text-[15px] text-muted hover:text-paper">
              ← All work
            </Link>
            <h1 className="mt-6 text-[clamp(38px,7.6vw,124px)] font-medium leading-[1.04] tracking-[-0.045em]">Gourmet Cola Rebranding</h1>
            <p className="mb-6 mt-[18px] max-w-[44ch] text-[clamp(19px,1.9vw,28px)] leading-[1.3] tracking-[-0.015em]">
              Brand identity and packaging redesign for Gourmet Cola.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Brand identity", "Packaging", "Label design"].map((tag) => (
                <span key={tag} className="rounded-full bg-mist px-3 py-1 text-[13px]">
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </section>

        <div className="gutter">
          <Reveal>
            <FadeImage
              src={cover}
              alt="Apna Gourmet Cola wordmark on a red background, with the line Brand Identity and Packaging Redesign"
              width={1400}
              height={787}
              preload
              sizes="100vw"
              className="h-auto w-full rounded-card bg-mist"
            />
          </Reveal>
          <dl className="grid grid-cols-2 gap-x-[clamp(16px,2.6vw,40px)] gap-y-5 border-b border-white/15 py-[22px] md:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.term}>
                <dt className="mb-1 text-[13px] text-muted">{fact.term}</dt>
                <dd className="max-w-[30ch]">{fact.detail}</dd>
              </div>
            ))}
            <div>
              <dt className="mb-1 text-[13px] text-muted">Also on</dt>
              <dd>
                <a href={behanceProject} target="_blank" rel="noopener" className="link-slide link-slide-on hover:text-accent">
                  Behance ↗
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <Block number="01" title="Brief" id="brief">
          <Lead>A new identity and bottle label for Gourmet Cola.</Lead>
          <Todo>two or three sentences on why the brand needed a redesign, who it is for, and what Bux was responsible for.</Todo>
        </Block>

        <Block
          number="02"
          title="The work"
          wide={
            <div className="grid gap-[clamp(10px,1.2vw,18px)]">
              {gallery.map((src, i) => (
                <Reveal key={src}>
                  <FadeImage
                    src={src}
                    alt={`Gourmet Cola rebranding, image ${i + 2}`}
                    width={1400}
                    height={787}
                    sizes="100vw"
                    className="h-auto w-full rounded-card bg-mist"
                  />
                </Reveal>
              ))}
            </div>
          }
        >
          <Lead>Wordmark, label layout and bottle mockups.</Lead>
          <Todo>a short caption for each image — what it shows and the decision behind it.</Todo>
        </Block>

        <Block number="03" title="Outcome">
          <Todo>
            where the work ended up — a concept, a pitch or a produced label — and anything that changed as a result. Only real results
            belong here.
          </Todo>
        </Block>

        <a
          href={nextProject}
          target="_blank"
          rel="noopener"
          className="gutter group mt-[clamp(64px,9vw,140px)] block rounded-t-[clamp(28px,5vw,72px)] bg-surface py-[clamp(48px,7vw,110px)] text-white"
        >
          <span className="mb-2 block text-[15px] text-white/60">Next project</span>
          <strong className="text-[clamp(40px,8vw,130px)] font-medium leading-none tracking-[-0.045em] transition-colors group-hover:text-accent">
            Beverages Label Design{" "}
            <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-[0.12em]">
              ↗
            </span>
          </strong>
        </a>
      </main>

      <footer className="gutter flex justify-between gap-4 border-t border-white/15 bg-surface py-5 text-sm text-white/60">
        <span>© 2026 Muhammad Bux</span>
        <Link href="/#work" className="hover:text-white">
          Back to all work
        </Link>
      </footer>
    </>
  );
}
