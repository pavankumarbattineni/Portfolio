"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
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

function applyTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    // Private mode: the choice just lasts for this visit.
  }
}

function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => null);
  const next: Theme = theme === "dark" ? "light" : "dark";
  // The icon only turns when the reader switches, not when the page loads.
  const [switched, setSwitched] = useState(false);

  /** The new theme spreads in a circle from the toggle, where supported. */
  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    setSwitched(true);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !document.startViewTransition) {
      applyTheme(next);
      return;
    }
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(() => applyTheme(next));
    transition.ready
      .then(() =>
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 650, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
        ),
      )
      .catch(() => {});
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme ? `Switch to ${next} theme` : "Switch theme"}
      className="grid size-10 place-items-center rounded-full text-hero-muted transition hover:bg-white/10 hover:text-hero-ink active:scale-90"
    >
      {/* Keyed so each change replays the quarter-turn swap. */}
      <span key={theme ?? "none"} className={switched ? "icon-swap" : undefined}>
        {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
      </span>
    </button>
  );
}

/**
 * Which section is being read: the one crossing the upper middle of the
 * viewport. Drives the nav's sliding indicator.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!sections.length || typeof IntersectionObserver === "undefined") return;
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // The last section in page order that is crossing the line.
        const current = [...ids].reverse().find((id) => visible.has(id)) ?? null;
        setActive(current);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

const SECTION_IDS = NAV.map((item) => item.href.slice(1));

function DesktopNav() {
  const active = useActiveSection(SECTION_IDS);
  const navRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  // Place the pill under the active link, and keep it there on resize.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const place = () => {
      const link = active ? nav.querySelector<HTMLElement>(`a[href="#${active}"]`) : null;
      setPill(link ? { left: link.offsetLeft, width: link.offsetWidth } : null);
    };
    const frame = requestAnimationFrame(place);
    addEventListener("resize", place);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", place);
    };
  }, [active]);

  return (
    <nav ref={navRef} aria-label="Sections" className="relative hidden items-center gap-1 md:flex">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 rounded-full bg-white/[0.08] transition-[left,width,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ left: pill?.left ?? 0, width: pill?.width ?? 0, opacity: pill ? 1 : 0 }}
      />
      {NAV.map((item) => {
        const isActive = active === item.href.slice(1);
        return (
          <a
            key={item.href}
            href={item.href}
            aria-current={isActive ? "location" : undefined}
            className={cx(
              "relative rounded-full px-3.5 py-2 text-[15px] transition-colors duration-300",
              isActive ? "text-hero-ink" : "text-hero-muted hover:text-hero-ink",
            )}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  // As with the theme icon: only turn once the reader has used the menu.
  const [menuUsed, setMenuUsed] = useState(false);
  return (
    <header className="on-hero sticky top-0 z-40 border-b border-white/[0.08] bg-[#0a1226]/[0.86] text-hero-ink backdrop-blur-xl backdrop-saturate-150">
      <Container className="flex h-16 items-center justify-between gap-4">
        <a href="#top" className="group flex items-center gap-2.5 font-semibold tracking-tight" onClick={() => setOpen(false)}>
          <span
            aria-hidden="true"
            className="relative grid size-8 place-items-center rounded-lg bg-hero-ink text-[13px] font-bold text-hero transition-transform duration-300 group-hover:-rotate-6"
          >
            PK
            <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-hero bg-hero-accent transition-transform duration-300 group-hover:scale-125" />
          </span>
          <span>{profile.shortName}</span>
        </a>

        <DesktopNav />

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <a
            href={profile.resume}
            download
            className="ml-1 hidden rounded-full border border-hero-accent/60 px-4 py-1.5 text-[15px] font-medium text-hero-ink transition hover:border-hero-accent hover:bg-hero-accent hover:text-hero active:scale-[0.97] sm:inline-flex"
          >
            Resume
          </a>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-hero-muted transition hover:bg-white/10 hover:text-hero-ink active:scale-90 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => {
              setMenuUsed(true);
              setOpen((value) => !value);
            }}
          >
            <span key={open ? "x" : "menu"} className={menuUsed ? "icon-swap" : undefined}>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </span>
          </button>
        </div>
      </Container>

      {/* Phone menu: opens to its height; inert while closed so it can't be tabbed into. */}
      <div
        className={cx(
          "grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <nav id="mobile-nav" aria-label="Sections" inert={!open} className="overflow-hidden">
          <Container className={cx("flex flex-col border-t border-hero-line py-2 transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}>
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
      </div>

      {/* Reading progress, drawn like a trace bar along the header's edge. */}
      <span aria-hidden="true" className="scroll-progress absolute inset-x-0 -bottom-px h-[2px] bg-hero-accent" />
    </header>
  );
}
