import { Contact } from "@/components/contact";
import { Credentials } from "@/components/credentials";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { Skills } from "@/components/skills";
import { Work } from "@/components/work";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Work />
        <Experience />
        <Skills />
        <Credentials />
      </main>
      <Contact />
    </>
  );
}
