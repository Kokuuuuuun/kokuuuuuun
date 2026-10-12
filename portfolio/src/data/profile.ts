export const profile = {
  name: 'Joel B. Báez',
  handle: 'kokuuuuuun',
  github: 'https://github.com/Kokuuuuuun',
  email: 'joelbonillabaez@gmail.com',
  location: 'Dominican Republic',
  studio: { name: 'GYK Studio', url: 'https://github.com/GYK-Studio', role: 'Owner', discordUrl: '' },
};

export type Project = {
  id: string;
  name: string;
  scope: 'personal' | 'studio' | 'collaboration';
  fork: boolean;
  category: string;
  description: string;
  stack: string[];
  repo: string;
  notes: string[];
};

export const projects: Project[] = [
  {
    id: 'crochet', name: 'Rincón del Crochet', scope: 'personal', fork: false, category: 'Desktop',
    description: 'An offline crochet app with a pattern editor, row counters, and yarn inventory.',
    stack: ['TypeScript', 'Next.js', 'Electron', 'SQLite'], repo: 'https://github.com/Kokuuuuuun/crochet',
    notes: ['Draw stitch patterns on a grid and export them as JSON.', 'Keep counters, timers, yarn inventory, and media locally.', 'A Next.js interface inside Electron, with SQLite for persistence.'],
  },
  {
    id: 'mihon', name: 'Mihon Desktop', scope: 'personal', fork: true, category: 'Desktop',
    description: 'A desktop adaptation of the Mihon manga reader, starting with Linux.',
    stack: ['Kotlin', 'Compose Multiplatform', 'Suwayomi'], repo: 'https://github.com/Kokuuuuuun/Mihon-desktop',
    notes: ['Compose Multiplatform for the desktop interface.', 'An embedded Suwayomi server managed at launch.', 'Independent fork of mihonapp/mihon. Original reader and source architecture credited to the Mihon contributors.'],
  },
  {
    id: 'moku', name: 'Moku', scope: 'personal', fork: true, category: 'Desktop',
    description: 'A fork of the desktop reader for manga, light novels, and anime.',
    stack: ['Svelte', 'Tauri', 'Tsunagu'], repo: 'https://github.com/Kokuuuuuun/Moku',
    notes: ['A Tauri frontend for the Tsunagu backend.', 'A shared library for manga, novels, and anime.', 'Fork of Moku; upstream authorship is preserved in the repository.'],
  },
  {
    id: 'nuvio-providers', name: 'Nuvio Latino Hub Providers', scope: 'personal', fork: false, category: 'Integration',
    description: 'Spanish-language media providers for Nuvio Media Hub.',
    stack: ['JavaScript', 'Node.js'], repo: 'https://github.com/Kokuuuuuun/Nuvio-Latino-Hub-Providers',
    notes: ['Providers for Latin American Spanish movies, series, anime, and dramas.', 'Provider manifests and JavaScript bundles are maintained in the repository.'],
  },
  {
    id: 'zoodom', name: 'Zoodom Solicitudes', scope: 'personal', fork: false, category: 'Web',
    description: 'A request-management project written in PHP.',
    stack: ['PHP'], repo: 'https://github.com/Kokuuuuuun/zoodom_solicitudes',
    notes: ['Public PHP project. Implementation details are available in the source repository.'],
  },
  {
    id: 'serversito', name: 'Serversito', scope: 'personal', fork: true, category: 'Utility',
    description: 'A fork of a Python menu for running a Minecraft server in CodeS.',
    stack: ['Python', 'Minecraft'], repo: 'https://github.com/Kokuuuuuun/serversito',
    notes: ['Forked server utility; original attribution remains in the repository.'],
  },
  {
    id: 'stremio', name: 'Vimeus Stremio Add-on', scope: 'personal', fork: true, category: 'Integration',
    description: 'A fork of a Stremio add-on that connects to the Vimeus API.',
    stack: ['Stremio', 'API integration'], repo: 'https://github.com/Kokuuuuuun/vimeus_stremio_addon',
    notes: ['Forked integration project. See the repository for the upstream source and implementation.'],
  },
  {
    id: 'oasis', name: 'The Oasis', scope: 'personal', fork: false, category: 'Web',
    description: 'An online beverage shop made as a personal high-school project.',
    stack: ['HTML', 'CSS', 'JavaScript'], repo: 'https://github.com/Kokuuuuuun/The-Oasis',
    notes: ['Product presentation and browser interactions built with web fundamentals.'],
  },
  {
    id: 'portfolio', name: 'Portfolio', scope: 'personal', fork: false, category: 'Web',
    description: 'My earlier web portfolio.',
    stack: ['HTML', 'CSS', 'JavaScript'], repo: 'https://github.com/Kokuuuuuun/Portafolio',
    notes: ['The source of the earlier portfolio hosted on Netlify.'],
  },
  {
    id: 'profile', name: 'Kokuuuuuun', scope: 'personal', fork: false, category: 'Profile',
    description: 'My GitHub profile and this standalone Astro portfolio.',
    stack: ['Markdown', 'Astro', 'TypeScript', 'GSAP'], repo: 'https://github.com/Kokuuuuuun/kokuuuuuun',
    notes: ['The portfolio lives in its own folder and can move into a separate repository.'],
  },
  {
    id: 'elysium', name: 'Elysium', scope: 'collaboration', fork: false, category: 'Web',
    description: 'A collaborative platform for school communication and academic administration.',
    stack: ['HTML', 'CSS', 'SCSS', 'JavaScript'], repo: 'https://github.com/Elysium-Proyecto/Elysium',
    notes: ['A group project for academic and administrative workflows.'],
  },
  {
    id: 'studio-backend', name: 'Self-host M', scope: 'studio', fork: false, category: 'Backend',
    description: 'The GYK Studio repository for a self-hosted Nuvio backend.',
    stack: ['PL/pgSQL', 'Self-hosting'], repo: 'https://github.com/GYK-Studio/self-host-M',
    notes: ['Organization repository maintained under GYK Studio.'],
  },
  {
    id: 'studio-nuvio', name: 'NuvioWeb', scope: 'studio', fork: true, category: 'Web',
    description: 'GYK Studio’s website adaptation of the NuvioTVSmart fork.',
    stack: ['JavaScript'], repo: 'https://github.com/GYK-Studio/NuvioWeb',
    notes: ['Organization fork. Original project attribution remains in the repository.'],
  },
  {
    id: 'studio-site', name: 'GYK Studio Website', scope: 'studio', fork: false, category: 'Web',
    description: 'The studio’s web portfolio.',
    stack: ['Astro'], repo: 'https://github.com/GYK-Studio/Website',
    notes: ['Organization website repository.'],
  },
  {
    id: 'studio-profile', name: 'GYK Studio Profile', scope: 'studio', fork: false, category: 'Profile',
    description: 'The organization profile, team information, and contribution guidelines.',
    stack: ['Markdown'], repo: 'https://github.com/GYK-Studio/.github',
    notes: ['The public organization profile identifies me as an owner of GYK Studio.'],
  },
];

export const projectFilters = [
  { id: 'all', name: 'All', count: projects.length },
  { id: 'personal', name: 'Personal', count: projects.filter(p => p.scope === 'personal' && !p.fork).length },
  { id: 'forks', name: 'Forks', count: projects.filter(p => p.fork).length },
  { id: 'studio', name: 'GYK Studio', count: projects.filter(p => p.scope === 'studio').length },
  { id: 'collaboration', name: 'Collaborations', count: projects.filter(p => p.scope === 'collaboration').length },
];

export type TechnologyGroup = { id: string; name: string; description: string; tools: { name: string; kind: string }[] };
export const technologies: TechnologyGroup[] = [
  { id: 'languages', name: 'Languages', description: 'The code itself. Typed applications, scripts, and systems.', tools: [
    { name: 'TypeScript', kind: 'Typed JavaScript' }, { name: 'JavaScript', kind: 'Web & application code' },
    { name: 'Kotlin', kind: 'JVM & multiplatform' }, { name: 'Python', kind: 'Scripting & backend' },
    { name: 'Rust', kind: 'Systems programming' }, { name: 'Go', kind: 'Systems & services' },
    { name: 'Java', kind: 'JVM applications' }, { name: 'PHP', kind: 'Server-side web' },
  ] },
  { id: 'frontend', name: 'Frontend', description: 'Interfaces, styling, and browser applications.', tools: [
    { name: 'React', kind: 'UI library' }, { name: 'Next.js', kind: 'React framework' },
    { name: 'Svelte', kind: 'UI framework' }, { name: 'Astro', kind: 'Web framework' },
    { name: 'HTML', kind: 'Document structure' }, { name: 'CSS / SCSS', kind: 'Styling' },
    { name: 'Tailwind CSS', kind: 'Utility CSS' }, { name: 'Radix / shadcn', kind: 'UI components' },
    { name: 'React Hook Form', kind: 'Form state' }, { name: 'Zod', kind: 'Schema validation' },
  ] },
  { id: 'backend', name: 'Backend', description: 'Application logic and the services behind the interface.', tools: [
    { name: 'Node.js', kind: 'JavaScript runtime' }, { name: 'Express', kind: 'Node.js web framework' },
    { name: 'Django', kind: 'Python web framework' },
  ] },
  { id: 'data', name: 'Databases & cache', description: 'Persistent data and caching, kept separate from backend frameworks.', tools: [
    { name: 'MySQL', kind: 'Relational database' }, { name: 'MongoDB', kind: 'Document database' },
    { name: 'SQLite', kind: 'Embedded SQL database' }, { name: 'Redis', kind: 'Key-value store & cache' },
  ] },
  { id: 'desktop', name: 'Desktop', description: 'Web technology and native interfaces beyond the browser.', tools: [
    { name: 'Electron', kind: 'Chromium + Node.js' }, { name: 'Compose Multiplatform', kind: 'Kotlin UI framework' },
    { name: 'Tauri', kind: 'Web UI + Rust shell' },
  ] },
  { id: 'cloud', name: 'Cloud & delivery', description: 'Infrastructure, containers, and deployment.', tools: [
    { name: 'AWS', kind: 'Cloud platform' }, { name: 'Docker', kind: 'Containers' },
    { name: 'Vercel', kind: 'Web hosting' }, { name: 'Netlify', kind: 'Web hosting' },
  ] },
  { id: 'workflow', name: 'Developer tools', description: 'Version control, packages, and API development.', tools: [
    { name: 'Git', kind: 'Version control' }, { name: 'GitHub', kind: 'Code collaboration' },
    { name: 'Postman', kind: 'API tooling' }, { name: 'npm / pnpm', kind: 'Package management' },
  ] },
  { id: 'design', name: 'Design & 3D', description: 'The visual side of the work.', tools: [
    { name: 'Figma', kind: 'Interface design' }, { name: 'Blender', kind: '3D workflows' },
  ] },
];
