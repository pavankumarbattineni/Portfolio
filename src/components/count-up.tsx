"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A figure that counts up from zero the first time it scrolls into view
 * ("370+" counts to 370 and keeps its "+"). The real value is in the page
 * from the start (for search, screen readers and no-JS), and reduced motion
 * just shows it.
 */
export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const match = /^(\D*)(\d+(?:\.\d+)?)(.*)$/.exec(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, prefix, digits, suffix] = match;
    const target = Number(digits);
    const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;
    let frame = 0;
    // Start from zero only once it's about to be seen: below the fold, not on screen already.
    if (el.getBoundingClientRect().top < innerHeight * 0.9) return;
    setShown(`${prefix}${(0).toFixed(decimals)}${suffix}`);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const begin = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - begin) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          setShown(`${prefix}${(target * eased).toFixed(decimals)}${suffix}`);
          if (t < 1) frame = requestAnimationFrame(tick);
          else setShown(null);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // The value is fixed content; run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span ref={ref} className="tabular-nums">
      <span aria-hidden={shown !== null || undefined}>{shown ?? value}</span>
      {shown !== null && <span className="sr-only">{value}</span>}
    </span>
  );
}
