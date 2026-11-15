"use client";

import { motion } from "framer-motion";
import type { FormEvent } from "react";
import { behanceProfile, contactEmail, contactPhone, instagramProfile, linkedinProfile } from "@/lib/projects";
import { BuxMark } from "./Logo";
import { Reveal } from "./motion/Reveal";
import { RevealText } from "./motion/RevealText";

const interests = ["Identity", "Brand", "Packaging", "Layout", "Other"];
const field =
  "w-full rounded-none border-0 border-b border-white/40 bg-transparent pb-3 pt-2 text-[19px] text-white outline-none transition-colors focus:border-accent";
const label = "mb-1.5 block text-[15px] text-white/70";

export function Contact() {
  // Opens the visitor's email app with the message filled in. There is no server-side form handler yet.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const chosen = data.getAll("interest").join(", ") || "Not specified";
    const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nInterested in: ${chosen}\n\n${data.get("message")}`;
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent("New project enquiry")}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="gutter scroll-mt-10 rounded-t-[clamp(28px,5vw,72px)] bg-surface pb-6 pt-[clamp(56px,8vw,120px)] text-white"
    >
      <Reveal>
        <h2 id="contact-title" className="text-[clamp(34px,5.6vw,88px)] font-medium leading-[1.04] tracking-[-0.04em]">
          <RevealText text="Let’s work" />
        </h2>
      </Reveal>

      <Reveal className="mt-[clamp(32px,5vw,64px)] max-w-[860px]">
        <form onSubmit={onSubmit} className="grid gap-7">
          <label>
            <span className={label}>Full name</span>
            <input type="text" name="name" autoComplete="name" required className={field} />
          </label>
          <label>
            <span className={label}>Email</span>
            <input type="email" name="email" autoComplete="email" required className={field} />
          </label>
          <fieldset>
            <legend className={label}>I am interested in</legend>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {interests.map((interest) => (
                <label key={interest} className="relative cursor-pointer">
                  <input type="checkbox" name="interest" value={interest} className="peer absolute inset-0 opacity-0" />
                  <span className="block rounded-full border border-white/40 px-[18px] py-2 text-[15px] transition-colors hover:border-white peer-checked:border-white peer-checked:bg-white peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                    {interest}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <label>
            <span className={label}>Tell me about the project</span>
            <textarea name="message" rows={3} className={`${field} resize-y`} />
          </label>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex cursor-pointer items-center justify-self-start overflow-hidden rounded-full bg-white px-7 py-4 font-semibold text-ink"
          >
            {/* Fill that sweeps up on hover, matching the Button component. */}
            <span aria-hidden="true" className="absolute inset-0 translate-y-[102%] rounded-full bg-accent transition-transform duration-500 group-hover:translate-y-0" />
            <span className="relative inline-flex items-center transition-colors group-hover:text-white">
              <span className="mr-2.5 inline-block size-[9px] animate-pulse-dot rounded-full bg-accent transition-colors group-hover:bg-white" />
              Send message
            </span>
          </motion.button>
        </form>
      </Reveal>

      <Reveal className="mt-[clamp(64px,9vw,130px)] flex flex-wrap justify-between gap-8 text-[15px]">
        <div>
          <h3 className="mb-1.5 text-[22px] font-medium">Lahore</h3>
          <p className="text-white/70">Pakistan</p>
          <p className="text-white/70">
            <a href={`mailto:${contactEmail}`} className="link-slide hover:text-accent">
              {contactEmail}
            </a>
          </p>
          <p className="text-white/70">
            <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="link-slide hover:text-accent">
              {contactPhone}
            </a>
          </p>
        </div>
        <ul className="flex gap-6 self-end">
          <li>
            <a href={behanceProfile} target="_blank" rel="noopener" className="link-slide hover:text-accent">
              Behance
            </a>
          </li>
          <li>
            <a href={instagramProfile} target="_blank" rel="noopener" className="link-slide hover:text-accent">
              Instagram
            </a>
          </li>
          <li>
            <a href={linkedinProfile} target="_blank" rel="noopener" className="link-slide hover:text-accent">
              LinkedIn
            </a>
          </li>
        </ul>
        <a href="#top" className="link-slide self-end font-semibold hover:text-accent">
          Let’s go up ↑
        </a>
      </Reveal>

      <Reveal>
        <BuxMark grid className="mx-auto mt-[clamp(40px,6vw,88px)] block w-[min(72vw,560px)]" />
      </Reveal>
      <p className="mt-4 text-center text-[13px] text-white/50">© 2026 Muhammad Bux</p>
    </section>
  );
}
