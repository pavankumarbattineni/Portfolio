"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Site-wide motion that needs script:
 * - Inertial scrolling (Lenis) with a mouse or trackpad; touch keeps the
 *   phone's own scrolling, and reduced motion keeps the browser's.
 *   In-page links glide to their section, leaving room for the header.
 * - A soft light that follows the pointer across any [data-spotlight] card
 *   (CSS draws it from --mx/--my).
 */
export function Motion() {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const card = (event.target as Element | null)?.closest?.<HTMLElement>("[data-spotlight]");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };
    addEventListener("pointermove", onMove, { passive: true });

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => removeEventListener("pointermove", onMove);
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      anchors: { offset: -80 },
      // Dialogs (the screenshot viewer) scroll on their own.
      prevent: (node) => !!node.closest("dialog"),
    });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
