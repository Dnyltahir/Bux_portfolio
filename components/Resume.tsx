import { cvFile } from "@/lib/projects";
import { Button } from "./Button";
import { Reveal } from "./motion/Reveal";
import { RevealText } from "./motion/RevealText";

/* Experience, exhibitions, education and tools, taken from Bux's CV (2026). */

const experience = [
  { role: "Senior Graphic Designer", place: "Gourmet Pakistan", when: "2025 – Present" },
  { role: "Commissioned Artist, “Indus in Motion”", place: "WWF Pakistan", when: "2025" },
  { role: "Graphic Designer", place: "Market Pro (advertising agency)", when: "2024 – 2025" },
  { role: "Design and Documentation Team Member", place: "Design Summit 01, Lahore", when: "2024" },
  { role: "Photographer & Video Editor", place: "Rashid Rana Studio", when: "2023" },
  { role: "Visual Designer Intern", place: "Tourism and Archaeology Department, Government of Punjab", when: "6 months" },
  { role: "Visual Designer", place: "Bits N Bytes STEM Educational Institute", when: "2022 – 2023" },
  { role: "Visual Designer", place: "QAUS e QAZAH Productions", when: "2018 – 2021" },
];

const exhibitions = [
  { title: "Climate Coloniality Conference by IoFC USA at BNU", when: "2026" },
  { title: "Beaconhouse’s SOT, 3rd Edition at Flatties Lahore", when: "2025" },
  { title: "Breathing Algorithms, 5th Edition LDF at RSpace Lahore", when: "2025" },
  { title: "GESDA Summit, Geneva, Switzerland", when: "2025" },
  { title: "South Asian Playground at Mool, Delhi, India", when: "2025" },
  { title: "UNESCO The Atlas Of Elsewhere at BNU", when: "2024" },
  { title: "Member, WANWU council at Lahore Biennale 03", when: "2024" },
  { title: "Annual Degree Show, Beaconhouse National University", when: "2024" },
  { title: "Institute of Architects Pakistan (IAP), Islamabad chapter", when: "2024" },
  { title: "2nd International Buddhist Conference, QAU Islamabad", when: "2024" },
  { title: "1st International Buddhist Conference, PNCA Islamabad", when: "2022" },
  { title: "Annual Art Exhibition, Government College University Lahore", when: "2019" },
];

const education = [
  { title: "Bachelor of Design (B.Des.), Interdisciplinary Expanded Design & Arts (IEDA)", place: "Beaconhouse National University, Lahore", when: "2020 – 2024" },
  { title: "F.A, Intermediate in Fine Arts", place: "Government College University, Lahore", when: "2017 – 2019" },
];

const tools = [
  { group: "Design", items: ["Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Adobe XD", "Figma"] },
  { group: "Motion & video", items: ["Premiere Pro", "After Effects"] },
  { group: "3D & interactive media", items: ["Cinema 4D", "TouchDesigner"] },
];

const heading = "mb-4 text-[13px] uppercase tracking-[0.08em] text-muted";
const row = "flex items-baseline justify-between gap-6 border-t border-white/15 py-3.5";

export function Resume() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="gutter scroll-mt-10 section-pad">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="experience-title" className="text-[clamp(34px,5.6vw,88px)] font-medium leading-[1.04] tracking-[-0.04em]">
          <RevealText text="Experience" />
        </h2>
        <Button href={cvFile} variant="outline" external>
          Download CV (PDF)
        </Button>
      </Reveal>

      <div className="mt-[clamp(28px,4vw,56px)] grid gap-x-[clamp(24px,4vw,72px)] gap-y-12 md:grid-cols-2">
        <Reveal>
          <h3 className={heading}>Work</h3>
          <ul>
            {experience.map((item) => (
              <li key={item.role + item.place} className={row}>
                <span>
                  <span className="block text-[19px] font-medium leading-snug tracking-[-0.01em]">{item.role}</span>
                  <span className="block text-muted">{item.place}</span>
                </span>
                <span className="shrink-0 text-[15px] tabular-nums text-muted">{item.when}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <h3 className={heading}>Exhibitions and displays</h3>
          <ul>
            {exhibitions.map((item) => (
              <li key={item.title} className={row}>
                <span className="leading-snug">{item.title}</span>
                <span className="shrink-0 text-[15px] tabular-nums text-muted">{item.when}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <h3 className={heading}>Education</h3>
          <ul>
            {education.map((item) => (
              <li key={item.title} className={row}>
                <span>
                  <span className="block text-[19px] font-medium leading-snug tracking-[-0.01em]">{item.title}</span>
                  <span className="block text-muted">{item.place}</span>
                </span>
                <span className="shrink-0 text-[15px] tabular-nums text-muted">{item.when}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <h3 className={heading}>Tools</h3>
          <ul className="grid gap-5 border-t border-white/15 pt-4">
            {tools.map((tool) => (
              <li key={tool.group}>
                <span className="mb-2 block font-medium">{tool.group}</span>
                <span className="flex flex-wrap gap-1.5">
                  {tool.items.map((item) => (
                    <span key={item} className="rounded-full bg-mist px-3 py-1 text-[14px]">
                      {item}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
