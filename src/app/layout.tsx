import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Schibsted_Grotesk } from "next/font/google";

import { profile } from "@/content/profile";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/** Vercel sets this in production; fall back to local dev. */
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const description =
  "Agentic AI Engineer building production multi-agent systems with FastAPI, LangGraph, MCP and PostgreSQL. Creator of Trench and Abyss.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name}, ${profile.role}`,
    template: `%s | ${profile.name}`,
  },
  description,
  authors: [{ name: profile.name, url: profile.links.github }],
  keywords: ["AI engineer", "backend engineer", "LangGraph", "FastAPI", "MCP", "multi-agent", "RAG", "portfolio"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    title: `${profile.name}, ${profile.role}`,
    description,
    url: "/",
    siteName: profile.name,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name}, ${profile.role}`,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#13213f" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1226" },
  ],
};

/**
 * Sets the theme before the first paint (saved choice, else the system), so
 * the page never flashes the wrong colours.
 */
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${schibsted.variable} ${plexMono.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-accent px-4 py-2 font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
