import { About } from "@/components/About";
import { Clients } from "@/components/Clients";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Projects } from "@/components/Projects";
import { Resume } from "@/components/Resume";
import { Services } from "@/components/Services";

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <Clients />
        <Projects />
        <Marquee />
        <Services />
        <About />
        <Resume />
        <Contact />
      </main>
    </>
  );
}
