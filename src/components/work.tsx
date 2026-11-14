import type { CSSProperties } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";

import { projects, type Project } from "@/content/profile";
import { InView } from "./in-view";
import { Screens } from "./screens";
import { Chip, Container, SectionHeading, cx } from "./ui";

/** Bullets shown before "More details". */
const VISIBLE_BULLETS = 3;

/** Each product's own mark on its own tile, as the apps draw it. */
function ProductMark({ project }: { project: Project }) {
  const { tile, ink, dot } = project.brand;
  return (
    <span
      aria-hidden="true"
      className="grid size-12 shrink-0 place-items-center rounded-[13px] sm:size-14 sm:rounded-[15px]"
      style={{ background: tile, color: ink }}
    >
      <svg viewBox="0 0 40 40" className="size-[62%]">
        {project.id === "trench" ? (
          <>
            <rect x="6" y="7" width="28" height="6" rx="3" fill="currentColor" />
            <rect x="6" y="17" width="20" height="6" rx="3" fill="currentColor" />
            <rect x="6" y="27" width="12" height="6" rx="3" fill="currentColor" />
          </>
        ) : (
          <>
            <circle cx="20" cy="18.5" r="11.5" fill="none" stroke="currentColor" strokeWidth="3.6" />
            <circle cx="20" cy="22" r="6.4" fill="currentColor" />
            <circle cx="20" cy="24.2" r="2.3" fill={dot} />
          </>
        )}
      </svg>
    </span>
  );
}

/**
 * The project's request as a trace, in the hero's visual language: one row
 * per span, bars placed on the run's timeline so order and overlap show.
 */
function ProjectTrace({ project }: { project: Project }) {
  return (
    <InView as="figure" amount={0.35} className="on-hero overflow-hidden rounded-2xl border border-hero-line bg-hero text-hero-ink">
      <div className="flex items-center justify-between gap-3 border-b border-hero-line px-4 py-3 sm:px-5">
        <p className="text-[13px] text-hero-muted">Request trace</p>
        <p className="font-mono text-[12px] text-hero-muted">{project.trace.length} spans</p>
      </div>
      <ol className="space-y-1 px-2 py-3 sm:px-3">
        {project.trace.map((span) => (
          <li
            key={span.name}
            style={{ "--d": span.start * 14 } as CSSProperties}
            className="trace-row grid grid-cols-1 items-center gap-x-3 gap-y-2 rounded-lg px-2 py-1.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
          >
            <div className="min-w-0" style={{ paddingLeft: `${span.depth * 0.7}rem` }}>
              <p className="flex items-center gap-1.5 font-mono text-[12.5px] text-hero-ink">
                <span
                  aria-hidden="true"
                  className={cx("size-1.5 shrink-0 rounded-full", span.depth === 0 ? "bg-hero-accent" : "bg-hero-muted")}
                />
                <span className="truncate">{span.name}</span>
              </p>
              <p className="mt-0.5 pl-3 text-[12px] leading-snug text-hero-muted">{span.note}</p>
            </div>
            <div className="relative ml-3 h-2 rounded-full bg-white/[0.05] sm:ml-0" aria-hidden="true">
              <span
                className={cx(
                  "trace-draw absolute inset-y-0 rounded-full",
                  span.depth === 0 ? "bg-hero-accent" : "bg-hero-muted/60",
                )}
                style={{ left: `${span.start}%`, width: `${span.end - span.start}%` }}
              />
            </div>
          </li>
        ))}
      </ol>
      <figcaption className="border-t border-hero-line px-4 py-3 text-[13px] text-hero-muted sm:px-5">
        {project.traceCaption}
      </figcaption>
    </InView>
  );
}

function Bullet({ children }: { children: string }) {
  return (
    <li className="flex gap-3 text-pretty">
      <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
      <span>{children}</span>
    </li>
  );
}

function ProjectStudy({ project, flip }: { project: Project; flip: boolean }) {
  const titleId = `${project.id}-title`;
  const shown = project.built.slice(0, VISIBLE_BULLETS);
  const more = project.built.slice(VISIBLE_BULLETS);
  return (
    <article id={project.id} aria-labelledby={titleId} className="scroll-mt-20 border-t border-line pt-12 sm:pt-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={cx(flip && "lg:order-2")}>
          <div className="flex items-center gap-4">
            <ProductMark project={project} />
            <div>
              <h3 id={titleId} className="text-4xl leading-none font-semibold tracking-[-0.03em] sm:text-5xl">
                {project.name}
              </h3>
              <p className="mt-1.5 text-[15px] text-slate tabular-nums">{project.period}</p>
            </div>
          </div>
          <p className="mt-5 text-xl text-slate text-balance">{project.tagline}</p>
          {project.origin && (
            <p className="mt-4 max-w-xl rounded-xl bg-accent-soft px-4 py-3 text-[15px] text-ink text-pretty">
              {project.origin}
            </p>
          )}

          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 font-medium text-on-accent transition hover:bg-accent-hover active:scale-[0.98]"
          >
            Open {project.name}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>

          <p className="mt-8 text-pretty">{project.problem}</p>

          <h4 className="mt-8 text-lg font-semibold">What I built</h4>
          <ul className="mt-3 space-y-3">
            {shown.map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </ul>
          {more.length > 0 && (
            <details className="smooth group mt-3">
              <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-md text-[15px] font-medium text-accent hover:text-accent-hover [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">Show {more.length} more</span>
                <span className="hidden group-open:inline">Show less</span>
                <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <ul className="mt-3 space-y-3">
                {more.map((item) => (
                  <Bullet key={item}>{item}</Bullet>
                ))}
              </ul>
            </details>
          )}

          <ul aria-label="Tech stack" className="mt-8 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li key={tech}>
                <Chip>{tech}</Chip>
              </li>
            ))}
          </ul>
        </div>

        <div className={cx("space-y-6 lg:sticky lg:top-24 lg:self-start", flip && "lg:order-1")}>
          <ProjectTrace project={project} />

          <dl className="grid grid-cols-3 divide-x divide-line rounded-2xl border border-line">
            {project.facts.map((fact) => (
              <div key={fact.label} className="flex flex-col px-3 py-4 sm:px-5">
                <dt className="mt-1 text-[13px] leading-snug text-slate">{fact.label}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight tabular-nums">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="rounded-2xl border border-line p-5 sm:p-6">
            <p className="text-[13px] text-accent">The hard part</p>
            <p className="mt-1 text-lg font-semibold text-balance">{project.hardPart.title}</p>
            <p className="mt-2 text-slate text-pretty">{project.hardPart.body}</p>
          </div>
        </div>
      </div>

      <div className="mt-12 sm:mt-14">
        <Screens name={project.name} screens={project.screens} />
      </div>
    </article>
  );
}

export function Work() {
  return (
    <section aria-labelledby="work-title" id="work" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="work-title"
          size="lg"
          title="Selected work"
          lead="Two products I designed, built and deployed end to end. Both are live; open them and try them."
        />
        <div className="mt-12 space-y-16 sm:mt-16 sm:space-y-24">
          {projects.map((project, i) => (
            <ProjectStudy key={project.id} project={project} flip={i % 2 === 1} />
          ))}
        </div>
      </Container>
    </section>
  );
}
