# Portfolio

Personal site of Pavan Kumar Battineni, Agentic AI Engineer.

The whole site sits on a living particle galaxy: a WebGL shader (`src/components/light-field.tsx`) places tens of thousands of points of light that swirl into a spiral galaxy behind the hero card, part around the pointer, and turn into a breathing sphere through the middle of the page and a sea of stardust at Contact. The hero shows the agent stack Pavan builds with, wired to his mark at the galaxy's core, with pulses running out to each part (`src/components/hero-constellation.tsx`).

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
