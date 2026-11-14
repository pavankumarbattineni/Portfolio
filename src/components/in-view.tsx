"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Marks its element with data-inview the first time it scrolls into view;
 * CSS (.reveal, .trace-draw in globals.css) does the animating. Once shown,
 * it stays shown.
 */
export function InView({
  as: Tag = "div",
  className,
  children,
  /** How far into the viewport (0-1) before it counts as seen. */
  amount = 0.2,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  amount?: number;
  [attr: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.dataset.inview = "";
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          el.dataset.inview = "";
          observer.disconnect();
        }
      },
      { threshold: amount, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [amount]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
