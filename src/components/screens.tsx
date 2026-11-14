"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

import type { Screen } from "@/content/profile";
import { InView } from "./in-view";
import { cx } from "./ui";

/** Swipe distance (px) that counts as a swipe rather than a tap. */
const SWIPE_PX = 40;

/**
 * Where a card sits relative to the front one: 0 is the front, positive
 * distances go to the right, negative to the left, alternating as you browse.
 */
function placement(index: number, active: number, count: number) {
  let offset = (index - active + count) % count;
  if (offset > count / 2) offset -= count;
  const depth = Math.abs(offset);
  return {
    offset,
    depth,
    style: {
      transform: `translateX(${offset * 26}%) scale(${1 - depth * 0.12}) rotate(${offset * 1.2}deg)`,
      zIndex: 30 - depth * 10,
    } as CSSProperties,
  };
}

/**
 * Screenshots of a live app as an overlapping stack: the current one in
 * front, the others peeking out left and right behind it. Arrows, arrow keys
 * or a swipe bring the next one forward; the front one opens full size. The
 * stack falls into place when it first scrolls into view.
 */
export function Screens({ name, screens }: { name: string; screens: Screen[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipeFrom = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [viewing, setViewing] = useState<Screen | null>(null);
  const count = screens.length;

  const go = (step: number) => setActive((current) => (current + step + count) % count);
  const open = (screen: Screen) => {
    setViewing(screen);
    dialogRef.current?.showModal();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  };
  const onPointerDown = (event: PointerEvent) => {
    swipeFrom.current = event.pointerType === "mouse" ? null : event.clientX;
  };
  const onPointerUp = (event: PointerEvent) => {
    if (swipeFrom.current === null) return;
    const dx = event.clientX - swipeFrom.current;
    swipeFrom.current = null;
    if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? 1 : -1);
  };

  const current = screens[active];

  return (
    <section aria-roledescription="carousel" aria-label={`${name} screenshots`} onKeyDown={onKeyDown}>
      {/* Clip sideways only: side cards may reach past a phone's edge, but cards still fall in from above. */}
      <div className="relative overflow-x-clip">
        <InView
          amount={0.25}
          className="relative mx-auto aspect-[4/3] w-full touch-pan-y sm:aspect-[16/9] lg:aspect-[2/1]"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          {screens.map((screen, i) => {
            const { offset, depth, style } = placement(i, active, count);
            const isFront = depth === 0;
            return (
              <div
                key={screen.src}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={!isFront}
                className="absolute inset-y-[6%] left-[10%] w-[80%] transition-[transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:left-[18%] sm:w-[64%]"
                style={style}
              >
                {/* Back cards land first, the front card last. */}
                <div className="fall h-full" style={{ "--i": count - 1 - depth } as CSSProperties}>
                  <button
                    type="button"
                    tabIndex={isFront ? 0 : -1}
                    onClick={() => (isFront ? open(screen) : setActive(i))}
                    aria-label={isFront ? `View full size: ${screen.alt}` : `Show screenshot ${i + 1}`}
                    className={cx(
                      "group relative block h-full w-full overflow-hidden rounded-2xl border border-line bg-mist text-left transition-shadow duration-500",
                      isFront
                        ? "cursor-zoom-in shadow-[0_18px_36px_-22px_rgb(19_33_63/0.5)] sm:shadow-[0_30px_70px_-30px_rgb(19_33_63/0.55)]"
                        : "cursor-pointer shadow-[0_18px_40px_-28px_rgb(19_33_63/0.4)]",
                    )}
                  >
                    <Image
                      src={screen.src}
                      alt={screen.alt}
                      fill
                      sizes="(min-width: 1024px) 700px, 80vw"
                      className="object-cover object-left-top"
                    />
                    {/* Cards behind recede into the page. */}
                    <span
                      aria-hidden="true"
                      className={cx(
                        "absolute inset-0 bg-paper transition-opacity duration-700",
                        isFront ? "opacity-0" : "opacity-45 group-hover:opacity-25",
                      )}
                    />
                    {isFront && (
                      <span className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-ink/80 text-paper opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                        <Maximize2 className="size-4" aria-hidden="true" />
                      </span>
                    )}
                    <span className="sr-only">{offset === 0 ? "" : offset < 0 ? "(left)" : "(right)"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </InView>

        {count > 1 && (
          <>
            <ArrowButton side="left" onClick={() => go(-1)} />
            <ArrowButton side="right" onClick={() => go(1)} />
          </>
        )}
      </div>

      <div className="mx-auto mt-5 flex max-w-2xl items-start justify-between gap-6 sm:mt-6">
        <p key={current.src} className="caption-swap text-[15px] leading-snug text-slate text-pretty" aria-live="polite">
          {current.caption}
        </p>
        {count > 1 && (
          <div className="flex shrink-0 items-center gap-1.5 pt-1.5">
            <SmallArrow side="left" onClick={() => go(-1)} />
            {screens.map((screen, i) => (
              <span
                key={screen.src}
                className={cx(
                  "h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  i === active ? "w-6 bg-accent" : "w-1.5 bg-line",
                )}
                aria-hidden="true"
              />
            ))}
            <SmallArrow side="right" onClick={() => go(1)} />
          </div>
        )}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={viewing?.alt ?? `${name} screenshot`}
        onClick={(event) => {
          // Anywhere but the screenshot itself closes it.
          if (!(event.target instanceof HTMLImageElement)) dialogRef.current?.close();
        }}
        className="shot-dialog m-auto max-h-[92dvh] w-[min(96vw,1400px)] max-w-none overflow-visible bg-transparent p-0"
      >
        {viewing && (
          <figure className="relative">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close"
              className="absolute -top-12 right-0 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            <Image
              src={viewing.src}
              alt={viewing.alt}
              width={viewing.width}
              height={viewing.height}
              sizes="96vw"
              className="mx-auto block h-auto max-h-[82dvh] w-auto max-w-full rounded-xl"
            />
            <figcaption className="mt-3 text-center text-[15px] text-white/80">{viewing.caption}</figcaption>
          </figure>
        )}
      </dialog>
    </section>
  );
}

function ArrowButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous screenshot" : "Next screenshot"}
      className={cx(
        "absolute top-1/2 z-40 hidden size-12 -translate-y-1/2 place-items-center rounded-full sm:grid border border-line bg-paper/90 text-ink shadow-[0_10px_30px_-12px_rgb(19_33_63/0.45)] backdrop-blur transition hover:border-accent hover:text-accent active:scale-90 sm:size-12",
        side === "left" ? "left-2" : "right-2",
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}

/** The same arrows for phones, beside the dots, so they never cover the screenshot. */
function SmallArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous screenshot" : "Next screenshot"}
      className={cx(
        "grid size-9 place-items-center rounded-full border border-line text-ink transition active:scale-90 sm:hidden",
        side === "left" ? "mr-1" : "ml-1",
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  );
}
