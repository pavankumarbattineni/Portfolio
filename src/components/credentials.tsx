import { certifications, education } from "@/content/profile";
import { Container } from "./ui";

export function Credentials() {
  return (
    <section aria-labelledby="education-title" id="education" className="border-t border-line py-20 sm:py-28">
      <Container className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <h2 id="education-title" className="text-[2rem] leading-tight font-semibold tracking-[-0.02em] sm:text-[2.5rem]">
            Education
          </h2>
          <div className="mt-8">
            <p className="text-[15px] text-slate tabular-nums">{education.period}</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-balance">{education.degree}</h3>
            <p className="mt-1 text-slate">{education.school}</p>
            <p className="mt-4 inline-flex rounded-full bg-accent-soft px-3 py-1 text-[15px] font-medium text-ink">
              {education.grade}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-[2rem] leading-tight font-semibold tracking-[-0.02em] sm:text-[2.5rem]">Certifications</h2>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {certifications.map((cert) => (
              <li key={cert.name} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <div>
                  <p className="font-medium text-pretty">{cert.name}</p>
                  <p className="text-[15px] text-slate">{cert.issuer}</p>
                </div>
                <p className="shrink-0 text-[15px] text-slate tabular-nums">{cert.date}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
