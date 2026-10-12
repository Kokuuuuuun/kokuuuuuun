# Joel's portfolio

A standalone Astro + TypeScript portfolio with GSAP timelines, ScrollTrigger, FLIP filtering, a morphing Canvas thread study, a searchable project index, a keyboard quick finder, a GYK Studio section, a categorized technology browser, and direct contact.

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

The project index includes personal repositories, forks, Elysium as a collaboration, and public GYK Studio repositories. It is a curated build-time snapshot, not a live GitHub feed. Forks and organization repositories are labelled explicitly.

The site respects reduced motion and supports keyboard navigation through the technology tabs and project disclosures. Contact opens an email client or copies the address locally; there is no contact form backend or analytics.

The email and studio links live in `src/data/profile.ts`. Set `profile.studio.discordUrl` to a public invitation to show a Discord contact link. It is intentionally empty until Joel supplies one.

## Interactions

- Search project names, technologies, or categories; search combines with the active project filter.
- Use Ctrl/Command + K to find a section, project, or technology. Arrow keys navigate the results, Enter opens one, and Escape closes the finder.
- Switch the Canvas study between a trefoil knot, orbital loop, and standing wave. GSAP interpolates between the shapes; reduced motion switches immediately.
