import { Fragment } from "react";

import { skillGroups, workLabels, type WorkRef } from "@/content/profile";
import { Container, SectionHeading } from "./ui";

const COLUMNS: { ref: WorkRef; short: string }[] = [
  { ref: "trench", short: "Trench" },
  { ref: "abyss", short: "Abyss" },
  { ref: "innoboon", short: "Work" },
  { ref: "degree", short: "Degree" },
];

/**
 * Skills against the work that used them: a dot wherever a skill was put to
 * use, so depth shows at a glance and every claim points at something real.
 */
export function Skills() {
  const unmapped = skillGroups.flatMap((group) => group.skills.filter((skill) => !skill.usedIn));

  return (
    <section aria-labelledby="skills-title" id="skills" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="skills-title"
          title="Skills"
          lead="Each skill against the work I used it in."
        />

        <div className="mt-12 overflow-hidden rounded-2xl border border-line sm:mt-16">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Skills and where each was used</caption>
            <thead className="bg-mist">
              <tr>
                <th scope="col" className="px-4 py-3.5 text-[13px] font-medium text-slate sm:px-6">
                  Skill
                </th>
                {COLUMNS.map((column) => (
                  <th key={column.ref} scope="col" className="w-12 px-0.5 py-3.5 text-center sm:w-32 sm:px-1">
                    <a href={workLabels[column.ref].href} className="text-[12px] font-semibold text-ink hover:text-accent sm:text-[13px]">
                      <span className="sm:hidden">{column.short}</span>
                      <span className="hidden sm:inline">{workLabels[column.ref].label}</span>
                    </a>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {skillGroups.map((group) => {
                const rows = group.skills.filter((skill) => skill.usedIn);
                return (
                  <Fragment key={group.title}>
                    <tr className="border-t border-line">
                      <th
                        scope="colgroup"
                        colSpan={COLUMNS.length + 1}
                        className="px-4 pt-6 pb-2 text-[15px] font-semibold text-ink sm:px-6"
                      >
                        {group.title}
                      </th>
                    </tr>
                    {rows.map((skill) => (
                      <tr key={skill.name} className="transition-colors hover:bg-mist/70">
                        <th scope="row" className="py-2.5 pr-2 pl-4 text-[15px] leading-snug font-normal sm:px-6">
                          {skill.name}
                        </th>
                        {COLUMNS.map((column) => {
                          const used = skill.usedIn!.includes(column.ref);
                          return (
                            <td key={column.ref} className="px-0.5 py-2.5 text-center sm:px-1">
                              {used ? (
                                <span className="inline-block size-2.5 rounded-full bg-accent" aria-label="Used" role="img" />
                              ) : (
                                <span className="inline-block size-1 rounded-full bg-line" aria-hidden="true" />
                              )}
                              {!used && <span className="sr-only">Not used</span>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          {unmapped.length > 0 && (
            <p className="border-t border-line px-4 py-4 text-[15px] text-slate sm:px-6">
              Also: {unmapped.map((skill) => skill.name).join(", ")}.
            </p>
          )}
        </div>
        <p className="mt-3 text-[13px] text-slate sm:hidden">
          Work: Innoboon Technologies. Degree: B.Tech, AI and ML.
        </p>
      </Container>
    </section>
  );
}
