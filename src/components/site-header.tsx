"use client";

import { useState, useSyncExternalStore } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";

import { profile } from "@/content/profile";
import { Container, cx } from "./ui";

const NAV = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

type Theme = "light" | "dark";

/* The theme lives on <html data-theme>, set before paint by the layout script. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
const readTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => null);
  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("theme", next);
        } catch {
          // Private mode: the choice just lasts for this visit.
        }
      }}
      aria-label={theme ? `Switch to ${next} theme` : "Switch theme"}
      className="grid size-10 place-items-center rounded-full text-hero-muted transition-colors hover:bg-white/10 hover:text-hero-ink"
    >
      {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </button>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="on-hero sticky top-0 z-40 border-b border-hero-line bg-hero text-hero-ink">
      <Container className="flex h-16 items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2.5 font-semibold tracking-tight" onClick={() => setOpen(false)}>
          <span aria-hidden="true" className="relative grid size-8 place-items-center rounded-lg bg-hero-ink text-[13px] font-bold text-hero">
            PK
            <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-hero bg-hero-accent" />
          </span>
          <span>{profile.shortName}</span>
        </a>

        <nav aria-label="Sections" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-[15px] text-hero-muted transition-colors hover:text-hero-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <a
            href={profile.resume}
            download
            className="ml-1 hidden rounded-full border border-hero-accent/60 px-4 py-1.5 text-[15px] font-medium text-hero-ink transition-colors hover:border-hero-accent hover:bg-hero-accent hover:text-hero sm:inline-flex"
          >
            Resume
          </a>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-hero-muted hover:bg-white/10 hover:text-hero-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      <nav
        id="mobile-nav"
        aria-label="Sections"
        className={cx("border-t border-hero-line md:hidden", open ? "block" : "hidden")}
      >
        <Container className="flex flex-col py-2">
          {[...NAV, { href: profile.resume, label: "Download resume" }].map((item) => (
            <a
              key={item.href}
              href={item.href}
              download={item.href === profile.resume || undefined}
              onClick={() => setOpen(false)}
              className="rounded-md py-3 text-base text-hero-muted hover:text-hero-ink"
            >
              {item.label}
            </a>
          ))}
        </Container>
      </nav>
    </header>
  );
}
