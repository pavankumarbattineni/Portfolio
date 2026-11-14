"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";

import type { Screen } from "@/content/profile";
import { cx } from "./ui";

/**
 * Screenshots of a live app: the first large, the others beside it. Any of
 * them opens full size in a dialog (Esc or a click outside closes it).
 */
export function Screens({ name, screens }: { name: string; screens: Screen[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<Screen | null>(null);

  const show = (screen: Screen) => {
    setOpen(screen);
    dialogRef.current?.showModal();
  };

  return (
    <>
      <ul aria-label={`${name} screenshots`} className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2 lg:gap-5">
        {screens.map((screen, i) => (
          <li key={screen.src} className={cx("min-w-0", i === 0 && "lg:col-span-2 lg:row-span-2")}>
            <figure className="flex h-full flex-col">
              <button
                type="button"
                onClick={() => show(screen)}
                aria-label={`View full size: ${screen.alt}`}
                className={cx(
                  "group relative block w-full overflow-hidden rounded-xl border border-line bg-mist text-left shadow-[0_18px_40px_-28px_rgb(19_33_63/0.45)] transition-shadow hover:shadow-[0_22px_48px_-24px_rgb(19_33_63/0.55)]",
                  i === 0 ? "aspect-[16/10] lg:aspect-auto lg:flex-1" : "aspect-[16/10]",
                )}
              >
                <Image
                  src={screen.src}
                  alt={screen.alt}
                  fill
                  sizes={i === 0 ? "(min-width: 1024px) 760px, 100vw" : "(min-width: 1024px) 370px, 100vw"}
                  className="object-cover object-left-top transition-transform duration-300 group-hover:scale-[1.015]"
                />
                <span className="absolute right-3 bottom-3 grid size-8 place-items-center rounded-full bg-ink/80 text-paper opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Maximize2 className="size-4" aria-hidden="true" />
                </span>
              </button>
              <figcaption className="mt-2.5 text-[14px] leading-snug text-slate text-pretty">{screen.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={open?.alt ?? `${name} screenshot`}
        onClose={() => setOpen(null)}
        onClick={(event) => {
          // Anywhere but the screenshot itself closes it.
          if (!(event.target instanceof HTMLImageElement)) dialogRef.current?.close();
        }}
        className="m-auto max-h-[92dvh] w-[min(96vw,1400px)] max-w-none overflow-visible bg-transparent p-0 backdrop:bg-[#0a1226]/85 backdrop:backdrop-blur-sm"
      >
        {open && (
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
              src={open.src}
              alt={open.alt}
              width={open.width}
              height={open.height}
              sizes="96vw"
              className="mx-auto block h-auto max-h-[82dvh] w-auto max-w-full rounded-xl"
            />
            <figcaption className="mt-3 text-center text-[15px] text-white/80">{open.caption}</figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
