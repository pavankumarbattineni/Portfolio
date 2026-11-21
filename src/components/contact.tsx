"use client";

import { useState } from "react";
import { Briefcase, Check, Copy, Download, MapPinned, Phone } from "lucide-react";

import { profile } from "@/content/profile";
import { InView } from "./in-view";
import { Container, GitHubIcon, LinkedInIcon, Words } from "./ui";

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(profile.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard blocked: the address is right there to select.
        }
      }}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-hero-line px-4 text-[15px] text-hero-muted transition-colors hover:border-hero-muted hover:text-hero-ink"
    >
      {copied ? <Check className="size-4 text-hero-accent" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </button>
  );
}

const linkClass =
  "flex items-center gap-3 rounded-xl border border-hero-line px-4 py-3.5 text-hero-ink transition-colors hover:border-hero-muted hover:bg-white/5";

export function Contact() {
  return (
    // Transparent: the backdrop's flowing threads run behind it.
    <section id="contact" aria-labelledby="contact-title" className="on-hero relative text-hero-ink">
      <Container className="py-16 sm:py-24">
        <div className="morph-panel glass rounded-[32px] px-5 py-12 sm:px-12 sm:py-16">
        <InView amount={0.5} className="words">
          <h2
            id="contact-title"
            aria-label="Let's build something that ships."
            className="text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-6xl"
          >
            <span aria-hidden="true">
              <Words text="Let's build something that ships." />
            </span>
          </h2>
        </InView>
        <p className="mt-5 max-w-xl text-lg text-hero-muted text-pretty">
          I&apos;m open to GenAI Engineer and Agentic AI Engineer roles. Reach me by email, phone or LinkedIn.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href={`mailto:${profile.email}`}
            className="text-xl font-medium break-all text-hero-accent underline decoration-hero-accent/40 decoration-1 underline-offset-[6px] transition-colors hover:decoration-hero-accent sm:text-2xl"
          >
            {profile.email}
          </a>
          <CopyEmail />
        </div>

        <dl className="mt-10 grid max-w-2xl gap-x-10 gap-y-5 sm:grid-cols-2">
          <div>
            <dt className="flex items-center gap-1.5 text-[14px] text-hero-muted">
              <MapPinned className="size-4" aria-hidden="true" />
              Preferred locations
            </dt>
            <dd className="mt-1 text-lg text-hero-ink">{profile.preferredCities}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-[14px] text-hero-muted">
              <Briefcase className="size-4" aria-hidden="true" />
              Work mode
            </dt>
            <dd className="mt-1 text-lg text-hero-ink">{profile.workModes}</dd>
          </div>
        </dl>

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <li>
            <a href={profile.phoneHref} className={linkClass}>
              <Phone className="size-5 text-hero-muted" aria-hidden="true" />
              <span className="tabular-nums">{profile.phone}</span>
            </a>
          </li>
          <li>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
              <LinkedInIcon className="size-5 text-hero-muted" />
              LinkedIn
            </a>
          </li>
          <li>
            <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
              <GitHubIcon className="size-5 text-hero-muted" />
              GitHub
            </a>
          </li>
          <li>
            <a href={profile.resume} download className={linkClass}>
              <Download className="size-5 text-hero-muted" aria-hidden="true" />
              Resume (PDF)
            </a>
          </li>
        </ul>
        </div>
      </Container>

      <footer className="border-t border-white/[0.08] bg-[#0a1226]/50 backdrop-blur-md">
        <Container className="flex flex-col gap-2 py-6 text-[14px] text-hero-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {profile.name}</p>
          <p>
            <a href={profile.links.source} target="_blank" rel="noopener noreferrer" className="text-hero-ink underline decoration-hero-line underline-offset-4 hover:decoration-hero-muted">
              View source
            </a>
          </p>
        </Container>
      </footer>
    </section>
  );
}
