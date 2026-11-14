import { Bot, Library, Server, ShieldCheck, type LucideIcon } from "lucide-react";

import { skillGroups } from "@/content/profile";
import { Container, SectionHeading, cx } from "./ui";

/** Per group, in content order: its icon and its place in the grid. */
const LAYOUT: { icon: LucideIcon; span: string; featured?: boolean }[] = [
  { icon: Bot, span: "md:col-span-2", featured: true },
  { icon: Library, span: "" },
  { icon: Server, span: "" },
  { icon: ShieldCheck, span: "md:col-span-2" },
];

/**
 * Skills as a bento grid. The core group (agents and LLMs) is the large navy
 * card, in the hero's colours; the others sit around it on mist.
 */
export function Skills() {
  return (
    <section aria-labelledby="skills-title" id="skills" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="skills-title"
          title="Skills"
          lead="Agentic AI first, on a backend built to run it in production."
        />

        <ul className="mt-12 grid gap-4 sm:mt-16 md:grid-cols-3 md:gap-5">
          {skillGroups.map((group, i) => {
            const { icon: Icon, span, featured } = LAYOUT[i] ?? { icon: Server, span: "" };
            return (
              <li
                key={group.title}
                className={cx(
                  "relative flex flex-col overflow-hidden rounded-3xl p-6 sm:p-8",
                  span,
                  featured ? "on-hero bg-hero text-hero-ink" : "bg-mist",
                )}
              >
                {featured && (
                  /* The hero's timeline grid, faintly, so the core card reads as part of it. */
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,var(--hero-line)_1px,transparent_1px)] [background-size:72px_100%] [mask-image:linear-gradient(to_left,black,transparent_70%)]"
                  />
                )}
                <div className="relative flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className={cx(
                      "grid size-11 shrink-0 place-items-center rounded-xl",
                      featured ? "bg-hero-accent text-hero" : "bg-paper text-accent ring-1 ring-line",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className={cx("font-semibold tracking-tight", featured ? "text-2xl" : "text-xl")}>{group.title}</h3>
                    <p className={cx("mt-1 text-[15px] text-pretty", featured ? "text-hero-muted" : "text-slate")}>
                      {group.blurb}
                    </p>
                  </div>
                </div>

                <ul aria-label={group.title} className="relative mt-7 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill.name}
                      className={cx(
                        "rounded-full px-3.5 py-1.5 text-[15px]",
                        featured
                          ? "border border-hero-line bg-white/[0.06] text-hero-ink"
                          : "border border-line bg-paper text-ink",
                      )}
                    >
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
