import { Briefcase, Download, MapPin, MapPinned } from "lucide-react";

import { profile } from "@/content/profile";
import { HeroConstellation } from "./hero-constellation";
import { Container, GitHubIcon, LinkedInIcon } from "./ui";

export function Hero() {
  return (
    // Transparent: the fiber-optic backdrop (LightField) is the hero's background.
    <section id="top" aria-labelledby="hero-title" className="on-hero relative text-hero-ink">
      <Container className="relative grid items-center gap-12 pt-14 pb-16 sm:pt-20 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-14 lg:pt-24 lg:pb-28">
        <div>
          <p className="enter inline-flex items-center gap-2 rounded-full border border-hero-line px-3.5 py-1.5 text-[14px] text-hero-ink">
            <span aria-hidden="true" className="size-2 rounded-full bg-hero-accent" />
            {profile.openTo}
          </p>
          <p className="enter mt-3 mb-7 flex flex-wrap [--i:1] items-center gap-x-5 gap-y-1.5 text-[14px] text-hero-muted">
            <span className="flex items-center gap-1.5">
              <MapPinned className="size-4" aria-hidden="true" />
              {profile.preferredCities}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="size-4" aria-hidden="true" />
              {profile.workModes}
            </span>
          </p>
          <p className="enter text-lg text-hero-muted [--i:2]">{profile.role}</p>
          <h1
            id="hero-title"
            className="enter mt-3 text-[2.75rem] leading-[1.02] [--i:3] font-semibold tracking-[-0.035em] text-balance sm:text-6xl lg:text-[4.25rem]"
          >
            {profile.name}
          </h1>
          <p className="enter mt-6 max-w-xl text-lg leading-relaxed text-hero-muted text-pretty [--i:4]">{profile.intro}</p>

          <div className="enter mt-9 flex flex-wrap items-center gap-3 [--i:5]">
            <a
              href="#work"
              className="inline-flex h-12 items-center rounded-full bg-hero-accent px-6 font-medium text-hero transition hover:bg-[#eba07d] active:scale-[0.98]"
            >
              See my work
            </a>
            <a
              href={profile.resume}
              download
              className="inline-flex h-12 items-center gap-2 rounded-full border border-hero-line px-6 font-medium text-hero-ink transition hover:border-hero-muted hover:bg-white/5 active:scale-[0.98]"
            >
              <Download className="size-4" aria-hidden="true" />
              Download resume
            </a>
          </div>

          <div className="enter mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 text-[15px] text-hero-muted [--i:6]">
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

        <div className="enter-panel">
          <HeroConstellation />
        </div>
      </Container>
    </section>
  );
}
