import { Briefcase, Download, MapPin, MapPinned } from "lucide-react";

import { profile } from "@/content/profile";
import { HeroTrace } from "./hero-trace";
import { Container, GitHubIcon, LinkedInIcon } from "./ui";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="on-hero relative overflow-hidden bg-hero text-hero-ink">
      {/* A faint timeline grid, the trace's axis carried across the hero. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,var(--hero-line)_1px,transparent_1px)] [background-size:96px_100%] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />
      <Container className="relative grid items-center gap-12 pt-14 pb-16 sm:pt-20 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-14 lg:pt-24 lg:pb-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-hero-line px-3.5 py-1.5 text-[14px] text-hero-ink">
            <span aria-hidden="true" className="size-2 rounded-full bg-hero-accent" />
            {profile.openTo}
          </p>
          <p className="mt-3 mb-7 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[14px] text-hero-muted">
            <span className="flex items-center gap-1.5">
              <MapPinned className="size-4" aria-hidden="true" />
              {profile.preferredCities}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="size-4" aria-hidden="true" />
              {profile.workModes}
            </span>
          </p>
          <p className="text-lg text-hero-muted">{profile.role}</p>
          <h1
            id="hero-title"
            className="mt-3 text-[2.75rem] leading-[1.02] font-semibold tracking-[-0.035em] text-balance sm:text-6xl lg:text-[4.25rem]"
          >
            {profile.name}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-hero-muted text-pretty">{profile.intro}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="inline-flex h-12 items-center rounded-full bg-hero-accent px-6 font-medium text-hero transition-colors hover:bg-[#eba07d]"
            >
              See my work
            </a>
            <a
              href={profile.resume}
              download
              className="inline-flex h-12 items-center gap-2 rounded-full border border-hero-line px-6 font-medium text-hero-ink transition-colors hover:border-hero-muted hover:bg-white/5"
            >
              <Download className="size-4" aria-hidden="true" />
              Download resume
            </a>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 text-[15px] text-hero-muted">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden="true" />
              {profile.location}
            </span>
            <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 transition-colors hover:text-hero-ink">
              <GitHubIcon className="size-4" />
              GitHub
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 transition-colors hover:text-hero-ink">
              <LinkedInIcon className="size-4" />
              LinkedIn
            </a>
          </div>
        </div>

        <HeroTrace />
      </Container>
    </section>
  );
}
