# Joel's portfolio

A standalone Astro + TypeScript portfolio with GSAP, an interactive Canvas thread study, a crochet pattern demo, a reader UI study, theme switching, and project notes.

## Run

Requires Node.js 22.12 or newer and pnpm.

```sh
pnpm install
pnpm dev
```

## Verify and build

```sh
pnpm check
pnpm build
pnpm preview
```

Move this entire folder into its own repository whenever ready. No files outside this folder are required. The static build is in `dist/` and can be deployed to static hosting.

## Content

Edit `src/data/profile.ts` for project descriptions, repository links, and technology groups. Layout lives in `src/pages/index.astro`, styling in `src/styles/global.css`, and interactions in `src/scripts/main.ts`.

Project visuals are interactive interface studies, not screenshots of the shipped applications. Mihon Desktop is described as a fork and credits the upstream project.

The site respects reduced motion, supports keyboard interaction, and uses no analytics, trackers, or contact form backend. Contact points to Joel's GitHub profile.
