import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main id="main" className="on-hero grid min-h-dvh place-items-center bg-hero px-4 text-hero-ink">
      <div className="max-w-md">
        <p className="font-mono text-[13px] text-hero-accent">404: span not found</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em]">This page doesn&apos;t exist.</h1>
        <p className="mt-3 text-hero-muted">The link may be old or mistyped. Everything lives on the home page.</p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-hero-accent px-6 font-medium text-hero transition-colors hover:bg-[#eba07d]"
        >
          Go to the home page
        </Link>
      </div>
    </main>
  );
}
