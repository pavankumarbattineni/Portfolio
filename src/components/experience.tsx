import { experience } from "@/content/profile";
import { Chip, Container, SectionHeading } from "./ui";

export function Experience() {
  return (
    <section aria-labelledby="experience-title" id="experience" className="bg-mist py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="experience-title"
          title="Experience"
          lead="Production multi-agent systems for investment research."
        />

        <div className="mt-12 rounded-3xl border border-line bg-paper p-6 sm:mt-16 sm:p-10">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">{experience.company}</h3>
              <p className="mt-1 text-lg text-slate">{experience.role}</p>
            </div>
            <div className="text-[15px] text-slate sm:text-right">
              <p className="tabular-nums">{experience.period}</p>
              <p>{experience.location}</p>
            </div>
          </div>

          <ul className="mt-10 grid gap-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
            {experience.highlights.map((item) => (
              <li key={item.unit} className="md:px-8 md:first:pl-0 md:last:pr-0">
                <p className="flex items-baseline gap-2">
                  <span className="text-5xl font-semibold tracking-[-0.03em] tabular-nums">{item.metric}</span>
                  <span className="font-medium text-accent">{item.unit}</span>
                </p>
                <p className="mt-3 text-slate text-pretty">{item.text}</p>
              </li>
            ))}
          </ul>

          <h4 className="mt-14 text-lg font-semibold">Projects at {experience.company.split(" ")[0]}</h4>
          <ol className="mt-6 space-y-10 border-l border-line pl-6 sm:pl-8">
            {experience.projects.map((project) => (
              <li key={project.name} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute top-2 -left-[29px] size-2.5 rounded-full border-2 border-paper bg-accent outline outline-1 outline-line sm:-left-[37px]"
                />
                <div className="flex flex-col gap-x-4 sm:flex-row sm:items-baseline sm:justify-between">
                  <h5 className="text-xl font-semibold tracking-tight">{project.name}</h5>
                  <p className="text-[15px] text-slate tabular-nums">{project.period}</p>
                </div>
                <ul className="mt-3 max-w-3xl space-y-2">
                  {project.points.map((point) => (
                    <li key={point} className="text-pretty">
                      {point}
                    </li>
                  ))}
                </ul>
                <ul aria-label={`${project.name} tech stack`} className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <li key={tech}>
                      <Chip>{tech}</Chip>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
