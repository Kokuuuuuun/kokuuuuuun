export const profile = {
  name: 'Joel B. Báez',
  handle: 'kokuuuuuun',
  github: 'https://github.com/Kokuuuuuun',
  location: 'Dominican Republic',
};

export const projects = [
  {
    id: 'crochet',
    number: '01',
    name: 'Rincón del Crochet',
    kind: 'Desktop application',
    description: 'A place to keep the pattern, the yarn, and the row you forgot you were on.',
    detail: 'An offline crochet app with a visual pattern editor, row and stitch counters, yarn inventory, and local media storage. Patterns can be drawn on a grid and exported as JSON.',
    stack: ['TypeScript', 'Next.js', 'Electron', 'SQLite'],
    repo: 'https://github.com/Kokuuuuuun/crochet',
    notes: [
      'The visual editor turns stitch symbols on a grid into written pattern instructions.',
      'Project counters, session timers, yarn inventory, and media metadata persist locally.',
      'Electron wraps the Next.js interface; SQLite stores the application data.',
    ],
  },
  {
    id: 'mihon',
    number: '02',
    name: 'Mihon Desktop',
    kind: 'Open source · Desktop fork',
    description: 'Taking a manga reader off the phone and onto the Linux desktop.',
    detail: 'My desktop fork of Mihon, using Kotlin and Compose Multiplatform. It embeds a local Suwayomi server for the library, browsing, downloads, and reader experience. Linux is the current target.',
    stack: ['Kotlin', 'Compose Multiplatform', 'Linux'],
    repo: 'https://github.com/Kokuuuuuun/Mihon-desktop',
    notes: [
      'Compose Multiplatform adapts the interface to a desktop environment.',
      'An embedded Suwayomi server is managed by the app at launch.',
      'This is an independent fork. The original reader and source architecture belong to the Mihon contributors.',
    ],
  },
];

export const technologies: Record<string, string[]> = {
  Languages: ['TypeScript', 'JavaScript', 'Kotlin', 'Python', 'Rust', 'Go', 'Java', 'PHP'],
  Frontend: ['React', 'Next.js', 'Svelte', 'Astro', 'Tailwind CSS', 'HTML', 'CSS', 'SCSS', 'Radix UI', 'shadcn/ui'],
  Backend: ['Node.js', 'Express', 'Django', 'MySQL', 'MongoDB', 'SQLite', 'Redis'],
  Tools: ['AWS', 'Docker', 'Git', 'GitHub', 'Postman', 'Vercel', 'Netlify', 'Electron', 'Compose Multiplatform', 'Figma', 'Blender'],
};
