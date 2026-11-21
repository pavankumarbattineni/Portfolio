import type { ComponentProps, CSSProperties, ReactNode } from "react";

import { InView } from "./in-view";

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** The page column: 16px gutters on phones, wider from tablet up. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

/**
 * A heading's words, each in its own span so they can arrive one after
 * another (.words / .word in globals.css). The text reads the same.
 */
export function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s+)/).map((part, i) =>
        /^\s+$/.test(part) ? (
          part
        ) : (
          <span key={i} className="word" style={{ "--w": Math.floor(i / 2) } as CSSProperties}>
            {part}
          </span>
        ),
      )}
    </>
  );
}

export function SectionHeading({
  id,
  title,
  lead,
  size = "md",
}: {
  id: string;
  title: string;
  lead?: ReactNode;
  /** "lg" marks the page's main section. */
  size?: "md" | "lg";
}) {
  return (
    <InView as="header" amount={0.4} className="words max-w-2xl">
      <h2
        id={id}
        aria-label={title}
        className={cx(
          "leading-tight font-semibold text-balance",
          size === "lg"
            ? "text-[2.5rem] leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-7xl"
            : "text-[2rem] tracking-[-0.02em] sm:text-[2.5rem]",
        )}
      >
        <span aria-hidden="true">
          <Words text={title} />
        </span>
      </h2>
      {lead && <p className="mt-3 text-lg text-slate text-pretty">{lead}</p>}
    </InView>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-paper px-2.5 py-0.5 text-sm text-slate">
      {children}
    </span>
  );
}

/* Brand marks (not in the icon set). */
export function GitHubIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.17c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export function LinkedInIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
