# Portfolio

Personal site of Pavan Kumar Battineni, Agentic AI Engineer.

The hero is a live agent trace: a run answering "Who is Pavan?", drawn as a span waterfall like the Tracing pages in [Trench](https://trenchai.vercel.app) and [Abyss](https://abyss-fleet.vercel.app).

## Stack

Next.js 16 (App Router, static), React 19, TypeScript, Tailwind CSS 4. Fonts: Schibsted Grotesk and IBM Plex Mono.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build      # production build
```

## Editing content

Everything the site says lives in [`src/content/profile.ts`](src/content/profile.ts): profile, hero trace, projects, experience, skills, education and certifications. The resume download is `public/Pavan_Kumar_Battineni_Resume.pdf`; replace that file to update it.

## Deploy

Import the repo in Vercel (framework preset: Next.js, no environment variables needed). Vercel's production URL is used automatically for metadata, the sitemap and the link preview image.
