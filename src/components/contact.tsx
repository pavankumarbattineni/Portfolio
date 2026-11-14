"use client";

import { useState } from "react";
import { Check, Copy, Download, Phone } from "lucide-react";

import { profile } from "@/content/profile";
import { Container, GitHubIcon, LinkedInIcon } from "./ui";

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
    <section id="contact" aria-labelledby="contact-title" className="on-hero bg-hero text-hero-ink">
      <Container className="py-20 sm:py-28">
        <h2 id="contact-title" className="text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-6xl">
          Let&apos;s build something that ships.
        </h2>
        <p className="mt-5 max-w-xl text-lg text-hero-muted text-pretty">
          I&apos;m open to GenAI Engineer and Agentic AI Engineer roles. Email is the fastest way to reach me.
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
      </Container>

      <footer className="border-t border-hero-line">
        <Container className="flex flex-col gap-2 py-6 text-[14px] text-hero-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {profile.name}</p>
          <p>
            Built with Next.js and Tailwind CSS.{" "}
            <a href={profile.links.source} target="_blank" rel="noopener noreferrer" className="text-hero-ink underline decoration-hero-line underline-offset-4 hover:decoration-hero-muted">
              View source
            </a>
          </p>
        </Container>
      </footer>
    </section>
  );
}
