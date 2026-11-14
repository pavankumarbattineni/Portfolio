"use client";

import { useEffect, useState } from "react";
import { Check, RotateCcw } from "lucide-react";

import { heroOutput, heroTrace, type SpanKind, type TraceSpan } from "@/content/profile";
import { cx } from "./ui";

/** Length of the run itself (ms), then the answer types out. */
const RUN_END = Math.max(...heroTrace.map((s) => s.start + s.duration));
const TYPE_START = RUN_END + 150;
const MS_PER_CHAR = 18;
const END = TYPE_START + heroOutput.length * MS_PER_CHAR;
/** Axis ticks every half second. */
const TICKS = Array.from({ length: Math.floor(RUN_END / 500) + 1 }, (_, i) => i * 500);

const KIND_LABEL: Record<SpanKind, string> = {
  agent: "agent",
  llm: "model call",
  retriever: "retrieval",
  tool: "tool",
  stream: "stream",
};

function formatMs(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${Math.round(ms)}ms`;
}

function spanState(span: TraceSpan, t: number) {
  if (t < span.start) return "pending" as const;
  if (t < span.start + span.duration) return "running" as const;
  return "done" as const;
}

/**
 * An agent run answering "Who is Pavan?", drawn as a span waterfall like the
 * Tracing pages in Trench and Abyss. It plays once; anyone who prefers reduced
 * motion sees it finished. Spans are buttons that explain themselves.
 */
export function HeroTrace() {
  const [t, setT] = useState(0);
  const [run, setRun] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const elapsed = reduce ? END : now - startedAt;
      setT(Math.min(elapsed, END));
      if (elapsed < END) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run]);

  const finished = t >= RUN_END;
  const typed = heroOutput.slice(0, Math.max(0, Math.floor((t - TYPE_START) / MS_PER_CHAR)));
  const typing = t >= TYPE_START && t < END;
  const active = selected !== null ? heroTrace[selected] : null;

  return (
    <figure
      aria-label="An agent run answering who Pavan is, shown as a trace"
      className="overflow-hidden rounded-2xl border border-hero-line bg-hero-raised shadow-[0_24px_60px_-28px_rgb(0_0_0/0.6)]"
    >
      {/* Run header */}
      <div className="flex items-center justify-between gap-3 border-b border-hero-line px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <p className="truncate font-mono text-[13px] text-hero-ink"><span className="hidden sm:inline">run: </span>&ldquo;Who is Pavan?&rdquo;</p>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-[13px]" aria-live="polite">
          {finished ? (
            <>
              <span className="flex items-center gap-1.5 text-hero-muted">
                <Check className="size-3.5 text-hero-accent" aria-hidden="true" />
                <span className="font-mono">{formatMs(RUN_END)}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setRun((n) => n + 1);
                }}
                className="flex items-center gap-1 rounded-full px-2 py-1 text-hero-muted transition-colors hover:bg-white/10 hover:text-hero-ink"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Replay
              </button>
            </>
          ) : (
            <span className="flex items-center gap-1.5 text-hero-accent">
              <span className="running-dot size-2 rounded-full bg-hero-accent" aria-hidden="true" />
              <span>Running</span>
            </span>
          )}
        </div>
      </div>

      {/* Waterfall */}
      <div className="px-2 pt-3 pb-2 sm:px-3">
        <div className="grid grid-cols-[minmax(0,9.75rem)_1fr_3.5rem] items-center gap-x-3 px-2 pb-1.5 sm:grid-cols-[minmax(0,12.5rem)_1fr_4rem]">
          <span className="text-[12px] text-hero-muted">Span</span>
          <div className="relative h-4" aria-hidden="true">
            {TICKS.map((tick) => (
              <span
                key={tick}
                className={cx(
                  "absolute top-0 -translate-x-1/2 font-mono text-[11px] text-hero-muted/80 first:translate-x-0",
                  // Phones only have room for whole seconds.
                  tick % 1000 !== 0 && "hidden sm:block",
                )}
                style={{ left: `${(tick / RUN_END) * 100}%` }}
              >
                {tick === 0 ? "0" : `${tick / 1000}s`}
              </span>
            ))}
          </div>
          <span className="text-right text-[12px] text-hero-muted">Time</span>
        </div>

        <ol className="space-y-0.5">
          {heroTrace.map((span, i) => {
            const state = spanState(span, t);
            const progress = Math.min(1, Math.max(0, (t - span.start) / span.duration));
            const isSelected = selected === i;
            return (
              <li key={span.name}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelected(isSelected ? null : i)}
                  className={cx(
                    "grid w-full grid-cols-[minmax(0,9.75rem)_1fr_3.5rem] items-center gap-x-3 rounded-lg px-2 py-2 text-left transition-colors sm:grid-cols-[minmax(0,12.5rem)_1fr_4rem]",
                    isSelected ? "bg-white/10" : "hover:bg-white/5",
                  )}
                >
                  <span
                    className={cx(
                      "flex min-w-0 items-center gap-1.5 font-mono text-[12.5px] transition-colors sm:text-[13px]",
                      state === "pending" ? "text-hero-muted/50" : "text-hero-ink",
                    )}
                    style={{ paddingLeft: `${span.depth * 0.75}rem` }}
                  >
                    <span
                      aria-hidden="true"
                      className={cx(
                        "size-1.5 shrink-0 rounded-full",
                        state === "running" ? "running-dot bg-hero-accent" : state === "done" ? "bg-hero-muted" : "bg-hero-muted/30",
                      )}
                    />
                    <span className="truncate">{span.name}</span>
                  </span>
                  <span className="relative h-2.5 rounded-full" aria-hidden="true">
                    <span className="absolute inset-y-0 right-0 left-0 rounded-full bg-white/[0.04]" />
                    <span
                      className={cx(
                        "absolute inset-y-0 rounded-full",
                        state === "running" ? "bg-hero-accent" : isSelected ? "bg-hero-accent/80" : "bg-hero-muted/55",
                      )}
                      style={{
                        left: `${(span.start / RUN_END) * 100}%`,
                        width: `${((span.duration * progress) / RUN_END) * 100}%`,
                      }}
                    />
                  </span>
                  <span className="text-right font-mono text-[12px] text-hero-muted tabular-nums">
                    {state === "pending" ? "" : formatMs(span.duration * progress)}
                  </span>
                  <span className="sr-only">
                    {`, ${KIND_LABEL[span.kind]}, ${state === "done" ? "finished" : state}. ${isSelected ? "Selected." : "Select to explain."}`}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Inspector: the selected span, or the run's answer */}
      <div className="min-h-[7.5rem] border-t border-hero-line bg-black/10 px-4 py-4 sm:min-h-[6.75rem] sm:px-5" aria-live="polite">
        {active ? (
          <div>
            <p className="flex flex-wrap items-baseline gap-x-2 text-[13px] text-hero-muted">
              <span className="font-mono text-hero-ink">{active.name}</span>
              <span>{KIND_LABEL[active.kind]}</span>
              <span className="font-mono">{formatMs(active.duration)}</span>
            </p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-hero-ink">{active.explain}</p>
          </div>
        ) : (
          <div>
            <p className="text-[13px] text-hero-muted">Answer</p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-hero-ink sm:text-base">
              {/* The full answer is always there for screen readers; sighted users watch it type. */}
              <span className="sr-only">{heroOutput}</span>
              <span aria-hidden="true">
                {typed}
                {(typing || (!finished && t > 0)) && (
                  <span className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] bg-hero-accent" />
                )}
              </span>
            </p>
            {t >= END && <p className="mt-2 text-[13px] text-hero-muted">Select any span to see what it does.</p>}
          </div>
        )}
      </div>
    </figure>
  );
}
