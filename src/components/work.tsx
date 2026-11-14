import { ArrowUpRight } from "lucide-react";

import { projects, type Project, type Stage } from "@/content/profile";
import { Chip, Container, SectionHeading, cx } from "./ui";

/** A short connector between stages. */
function Connector() {
  return (
    <div aria-hidden="true" className="flex justify-center py-1">
      <svg width="10" height="22" viewBox="0 0 10 22" className="text-slate/60">
        <path d="M5 0v17" stroke="currentColor" strokeWidth="1.25" />
        <path d="M1.5 14 5 18.5 8.5 14" fill="none" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    </div>
  );
}

function StageBox({ label, detail, emphasis }: { label: string; detail?: string; emphasis?: boolean }) {
  return (
    <div
      className={cx(
        "rounded-xl border bg-paper px-4 py-3 text-center",
        emphasis ? "border-accent/50" : "border-line",
      )}
    >
      <p className="text-[15px] leading-snug font-medium">{label}</p>
      {detail && <p className="mt-0.5 text-[13px] leading-snug text-slate">{detail}</p>}
    </div>
  );
}

/** How one request moves through the system, top to bottom. */
function Flow({ stages, caption }: { stages: Stage[]; caption: string }) {
  return (
    <figure className="rounded-2xl bg-mist p-4 sm:p-6">
      <ol aria-label="Request flow">
        {stages.map((stage, i) => (
          <li key={stage.label}>
            {i > 0 && <Connector />}
            {stage.parallel ? (
              <div className="rounded-xl border border-dashed border-slate/40 p-2.5 sm:p-3">
                <p className="mb-2 text-center text-[13px] font-medium text-slate">{stage.label}</p>
                <ul className={cx("grid gap-2", stage.parallel.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
                  {stage.parallel.map((step) => (
                    <li key={step.label}>
                      <StageBox label={step.label} detail={step.detail} emphasis />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <StageBox label={stage.label} detail={stage.detail} />
            )}
          </li>
        ))}
      </ol>
      <figcaption className="mt-4 text-center text-[13px] text-slate">{caption}</figcaption>
    </figure>
  );
}

function ProjectStudy({ project, flip }: { project: Project; flip: boolean }) {
  const titleId = `${project.id}-title`;
  return (
    <article id={project.id} aria-labelledby={titleId} className="scroll-mt-20 border-t border-line pt-12 sm:pt-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={cx(flip && "lg:order-2")}>
          <p className="text-[15px] text-slate">{project.period}</p>
          <h3 id={titleId} className="mt-1 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            {project.name}
          </h3>
          <p className="mt-2 text-xl text-slate text-balance">{project.tagline}</p>
          {project.origin && (
            <p className="mt-4 max-w-xl rounded-xl bg-accent-soft px-4 py-3 text-[15px] text-ink text-pretty">
              {project.origin}
            </p>
          )}

          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-5 inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 font-medium text-on-accent transition-colors hover:bg-accent-hover"
          >
            Open {project.name}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>

          <p className="mt-8 text-pretty">{project.problem}</p>

          <h4 className="mt-8 text-lg font-semibold">What I built</h4>
          <ul className="mt-3 space-y-3">
            {project.built.map((item) => (
              <li key={item} className="flex gap-3 text-pretty">
                <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <ul aria-label="Tech stack" className="mt-8 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li key={tech}>
                <Chip>{tech}</Chip>
              </li>
            ))}
          </ul>
        </div>

        <div className={cx("space-y-6 lg:sticky lg:top-24 lg:self-start", flip && "lg:order-1")}>
          <Flow stages={project.flow} caption={project.flowCaption} />

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
    </article>
  );
}

export function Work() {
  return (
    <section aria-labelledby="work-title" id="work" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="work-title"
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
