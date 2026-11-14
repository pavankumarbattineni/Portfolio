"use client";

import { useState } from "react";

import { skillGroups, workLabels } from "@/content/profile";
import { Container, SectionHeading, cx } from "./ui";

/**
 * Skills grouped by what they're for. Selecting one shows where it was used,
 * so every skill is backed by work.
 */
export function Skills() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section aria-labelledby="skills-title" id="skills" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="skills-title"
          title="Skills"
          lead="Select a skill to see where I've used it."
        />

        <div className="mt-12 grid gap-5 sm:mt-16 md:grid-cols-2">
          {skillGroups.map((group) => {
            const active = group.skills.find((skill) => skill.name === selected);
            return (
              <div key={group.title} className="flex flex-col rounded-2xl border border-line p-5 sm:p-7">
                <h3 className="text-lg font-semibold">{group.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill) => {
                    const isSelected = selected === skill.name;
                    return (
                      <li key={skill.name}>
                        {skill.usedIn ? (
                          <button
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => setSelected(isSelected ? null : skill.name)}
                            className={cx(
                              "rounded-full border px-3.5 py-1.5 text-[15px] transition-colors",
                              isSelected
                                ? "border-accent bg-accent text-on-accent"
                                : "border-line hover:border-accent/60 hover:bg-accent-soft",
                            )}
                          >
                            {skill.name}
                          </button>
                        ) : (
                          <span className="inline-block rounded-full border border-transparent bg-mist px-3.5 py-1.5 text-[15px]">
                            {skill.name}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-auto min-h-6 pt-5 text-[15px] text-slate" aria-live="polite">
                  {active?.usedIn && (
                    <>
                      {active.name}, used in{" "}
                      {active.usedIn.map((ref, i) => (
                        <span key={ref}>
                          {i > 0 && (i === active.usedIn!.length - 1 ? " and " : ", ")}
                          <a href={workLabels[ref].href} className="prose-link">
                            {workLabels[ref].label}
                          </a>
                        </span>
                      ))}
                    </>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
