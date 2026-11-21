# Portfolio

Personal site of Pavan Kumar Battineni, Agentic AI Engineer.

The whole site sits on fiber-optic light: a WebGL shader (`src/components/light-field.tsx`) draws glowing strands with light travelling along them, shaped as a radiant burst at the top, aurora curtains through the middle and flowing threads at Contact. The hero shows the agent stack Pavan builds with, wired to his mark, with pulses running out to each part (`src/components/hero-constellation.tsx`).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build      # production build
```

## Editing content

Everything the site says lives in [`src/content/profile.ts`](src/content/profile.ts): profile, projects, experience, skills, education and certifications. The resume download is `public/Pavan_Kumar_Battineni_Resume.pdf`; replace that file to update it.

## Deploy

Import the repo in Vercel (the framework is detected automatically; no environment variables needed). Vercel's production URL is used automatically for metadata, the sitemap and the link preview image.
