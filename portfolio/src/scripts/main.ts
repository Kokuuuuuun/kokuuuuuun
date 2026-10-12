import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { profile, projects, technologies } from '../data/profile';

gsap.registerPlugin(ScrollTrigger, Flip);
const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const themeButton = document.querySelector<HTMLButtonElement>('.theme-toggle')!;
const threadMotion = { rotation: 0 };
const shapeMotion = { orbit: 0, wave: 0 };
function updateThemeLabel() {
  themeButton.setAttribute('aria-label', root.dataset.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
}
updateThemeLabel();
themeButton.addEventListener('click', () => {
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = theme;
  try { localStorage.setItem('joel-theme', theme); } catch {}
  updateThemeLabel();
});

function updateProgress() {
  const max = root.scrollHeight - window.innerHeight;
  const progress = max ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
  document.querySelector<HTMLElement>('.page-progress')!.style.transform = 'scaleX(' + progress + ')';
  document.querySelector('#section-progress')!.textContent = String(Math.round(progress * 100)).padStart(2, '0');
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

const motion = gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)', () => {
  const cleanupLinks: (() => void)[] = [];
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.from('.title-line', { yPercent: 115, duration: 1.2, stagger: .12, ease: 'expo.out', clearProps: 'transform' })
    .from('.hero-enter:not(.thread-study)', { y: 16, autoAlpha: 0, duration: .7, stagger: .1, clearProps: 'all' }, .2)
    .from('.thread-study', { y: 30, autoAlpha: 0, duration: 1, clearProps: 'all' }, .4);
  gsap.utils.toArray<HTMLElement>('.reveal').forEach(element => {
    gsap.from(element, { y: 35, opacity: 0, duration: .9, ease: 'power3.out', clearProps: 'all',
      scrollTrigger: { trigger: element, start: 'top 93%', once: true } });
  });
  gsap.fromTo('.studio-lettermark > span', { y: 30, rotate: -8, opacity: .35 }, {
    y: 0, rotate: 0, opacity: 1, stagger: .1,
    scrollTrigger: { trigger: '.studio-signature', start: 'top 85%', end: 'center 50%', scrub: 1 },
  });
  gsap.to('.studio-orbit', { rotation: 45, transformOrigin: '50% 50%',
    scrollTrigger: { trigger: '.studio-signature', start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
  gsap.to('.contact-asterisk', { rotation: 180, transformOrigin: '50% 50%',
    scrollTrigger: { trigger: '#contact', start: 'top bottom', end: 'bottom top', scrub: 1 } });
  gsap.to(threadMotion, { rotation: Math.PI * 1.5, ease: 'none',
    scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: 1.2 } });
  gsap.utils.toArray<HTMLElement>('.text-link').forEach(link => {
    const arrow = link.querySelector('span');
    if (!arrow) return;
    const enter = () => gsap.to(arrow, { x: 3, y: -3, duration: .25, overwrite: true });
    const leave = () => gsap.to(arrow, { x: 0, y: 0, duration: .4, ease: 'elastic.out(1,.5)', overwrite: true });
    link.addEventListener('pointerenter', enter); link.addEventListener('pointerleave', leave);
    cleanupLinks.push(() => { link.removeEventListener('pointerenter', enter); link.removeEventListener('pointerleave', leave); });
  });
  return () => cleanupLinks.forEach(cleanup => cleanup());
});
motion.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
  const cleanups: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>('.magnetic').forEach(element => {
    const move = (event: PointerEvent) => {
      const bounds = element.getBoundingClientRect();
      gsap.to(element, { x: (event.clientX - bounds.left - bounds.width / 2) * .2, y: (event.clientY - bounds.top - bounds.height / 2) * .2, duration: .3, overwrite: true });
    };
    const leave = () => gsap.to(element, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)', overwrite: true });
    element.addEventListener('pointermove', move); element.addEventListener('pointerleave', leave);
    cleanups.push(() => { element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave); gsap.set(element, { clearProps: 'transform' }); });
  });
  return () => cleanups.forEach(cleanup => cleanup());
});

// Section identity follows the reading position, with no scroll locking.
const sections = [...document.querySelectorAll<HTMLElement>('[data-section]')];
const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('.nav-links a')];
function updateSection() {
  const section = sections.filter(section => section.getBoundingClientRect().top <= window.innerHeight * .4).at(-1) || sections[0]!;
  document.querySelector('#current-section')!.textContent = section.dataset.section!;
  navLinks.forEach(link => {
    if (link.hash === '#' + section.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', updateSection, { passive: true });
updateSection();

// A trefoil thread drawn as a 3D curve, with perspective and layered fibers.
const canvas = document.querySelector<HTMLCanvasElement>('#thread-canvas')!;
const context = canvas.getContext('2d');
const tension = document.querySelector<HTMLInputElement>('#tension')!;
const tensionValue = document.querySelector<HTMLElement>('#tension-value')!;
let width = 0, height = 0, time = 0, pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
let visible = true, frame = 0, lastTime = 0;
function sizeCanvas() {
  const bounds = canvas.getBoundingClientRect();
  width = bounds.width; height = bounds.height;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
  context?.setTransform(ratio, 0, 0, ratio, 0, 0);
  drawThread();
}
function drawThread() {
  if (!context || !width) return;
  context.clearRect(0, 0, width, height);
  const dark = root.dataset.theme === 'dark';
  const tightness = Number(tension.value) / 100;
  const rotation = time * .08 + pointerX * .65 + threadMotion.rotation;
  const tilt = -.35 + pointerY * .45;
  const scale = Math.min(width * .21, height * .18);
  const points: {x: number; y: number; z: number}[] = [];
  for (let i = 0; i <= 380; i++) {
    const t = i / 380 * Math.PI * 2;
    const radius = 1.4 + (.35 + tightness * .45) * Math.cos(3 * t);
    const original = 1 - shapeMotion.orbit - shapeMotion.wave;
    const orbitRadius = 1.35 + tightness * .55;
    const x = radius * Math.cos(2 * t) * original + orbitRadius * Math.cos(t) * shapeMotion.orbit + 1.8 * Math.sin(t) * shapeMotion.wave;
    const y = radius * Math.sin(2 * t) * original + orbitRadius * Math.sin(t) * shapeMotion.orbit + (1 + tightness * .6) * Math.sin(2 * t) * shapeMotion.wave;
    const z = (.6 + tightness * .45) * Math.sin(3 * t) * original + .65 * Math.sin(2 * t) * shapeMotion.orbit + .55 * Math.cos(3 * t) * shapeMotion.wave;
    const rx = x * Math.cos(rotation) + z * Math.sin(rotation);
    const rz = -x * Math.sin(rotation) + z * Math.cos(rotation);
    const ry = y * Math.cos(tilt) - rz * Math.sin(tilt);
    const depth = y * Math.sin(tilt) + rz * Math.cos(tilt);
    const perspective = 5 / (5 - depth * .3);
    points.push({ x: width / 2 + rx * scale * perspective, y: height / 2 + ry * scale * perspective, z: depth });
  }
  const segments = points.slice(0, -1).map((a, index) => ({ a, b: points[index + 1]! }));
  segments.sort((a, b) => a.a.z - b.a.z);
  context.lineCap = 'round';
  for (const { a, b } of segments) {
    const brightness = Math.max(0, Math.min(1, (a.z + 2) / 4));
    context.beginPath(); context.moveTo(a.x, a.y + 7); context.lineTo(b.x, b.y + 7);
    context.lineWidth = 10; context.strokeStyle = dark ? 'rgba(0,0,0,.12)' : 'rgba(52,47,30,.045)'; context.stroke();
    context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y);
    context.lineWidth = 6;
    context.strokeStyle = 'hsl(' + (dark ? 24 : 23) + ', ' + (dark ? 55 : 45) + '%, ' + (dark ? 35 + brightness * 30 : 32 + brightness * 25) + '%)';
    context.stroke();
    context.beginPath(); context.moveTo(a.x - .8, a.y - 1); context.lineTo(b.x - .8, b.y - 1);
    context.lineWidth = 1; context.strokeStyle = 'rgba(255,233,203,' + (.13 + brightness * .22) + ')'; context.stroke();
  }
}
function animateThread(stamp: number) {
  frame = 0;
  if (!visible || document.hidden || reducedMotion.matches) return;
  const delta = Math.min((stamp - lastTime) / 1000 || 0, .04); lastTime = stamp; time += delta;
  pointerX += (targetX - pointerX) * .06; pointerY += (targetY - pointerY) * .06;
  drawThread();
  frame = requestAnimationFrame(animateThread);
}
function startThread() {
  if (frame) cancelAnimationFrame(frame);
  frame = 0; lastTime = performance.now();
  if (!reducedMotion.matches && visible && !document.hidden) frame = requestAnimationFrame(animateThread);
  else drawThread();
}
canvas.addEventListener('pointermove', event => {
  const bounds = canvas.getBoundingClientRect();
  targetX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
  targetY = (event.clientY - bounds.top) / bounds.height * 2 - 1;
});
canvas.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; });
tension.addEventListener('input', () => { tensionValue.textContent = tension.value; drawThread(); });
document.querySelector('.reset-thread')!.addEventListener('click', () => {
  tension.value = '45'; tensionValue.textContent = '45'; pointerX = pointerY = targetX = targetY = time = 0; drawThread();
});
new ResizeObserver(sizeCanvas).observe(canvas);
new IntersectionObserver(entries => { visible = !!entries[0]?.isIntersecting; startThread(); }).observe(canvas);
document.addEventListener('visibilitychange', startThread);
reducedMotion.addEventListener('change', startThread);
themeButton.addEventListener('click', drawThread);
sizeCanvas(); startThread();
const shapeButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-shape]')];
shapeButtons.forEach(button => button.addEventListener('click', () => {
  const shape = button.dataset.shape!;
  shapeButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  const next = { orbit: shape === 'orbit' ? 1 : 0, wave: shape === 'wave' ? 1 : 0 };
  gsap.killTweensOf(shapeMotion);
  const title = shape === 'thread' ? 'Trefoil knot.' : shape === 'orbit' ? 'Orbital loop.' : 'Standing wave.';
  document.querySelector('.study-caption')!.textContent = title;
  canvas.setAttribute('aria-label', 'Interactive ' + title.toLowerCase() + ' Move your pointer or adjust the tension.');
  if (reducedMotion.matches) { gsap.set(shapeMotion, next); drawThread(); }
  else gsap.to(shapeMotion, { ...next, duration: 1.2, ease: 'power3.inOut', onUpdate: () => { if (!frame) drawThread(); } });
}));


// An image-free repository index. FLIP preserves spatial continuity when filtered.
const rows = [...document.querySelectorAll<HTMLElement>('.project-row')];
const projectFilters = [...document.querySelectorAll<HTMLButtonElement>('[data-project-filter]')];
const projectSearch = document.querySelector<HTMLInputElement>('#project-search')!;
let currentProjectFilter = 'all';
const normalizeSearch = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
function filterProjects(filter: string) {
  currentProjectFilter = filter;
  const query = normalizeSearch(projectSearch.value);
  Flip.killFlipsOf(rows);
  const state = reducedMotion.matches ? null : Flip.getState(rows);
  rows.forEach(row => {
    const match = filter === 'all' || (filter === 'forks' ? row.dataset.fork === 'true' :
      filter === 'personal' ? row.dataset.scope === 'personal' && row.dataset.fork !== 'true' : row.dataset.scope === filter);
    row.hidden = !match || !normalizeSearch(row.dataset.search || '').includes(query);
  });
  projectFilters.forEach(button => {
    const active = button.dataset.projectFilter === filter;
    button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
  });
  const count = rows.filter(row => !row.hidden).length;
  document.querySelector('#project-count')!.textContent = count + (count === 1 ? ' entry' : ' entries');
  document.querySelector<HTMLElement>('#project-empty')!.hidden = count !== 0;
  document.querySelector<HTMLElement>('#clear-search')!.hidden = !projectSearch.value;
  if (state) Flip.from(state, {
    duration: .6, ease: 'power3.inOut', absoluteOnLeave: true, fade: true,
    onEnter: elements => gsap.fromTo(elements, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: .4, clearProps: 'all' }),
    onComplete: () => { ScrollTrigger.refresh(); updateProgress(); updateSection(); },
  });
  else { ScrollTrigger.refresh(); updateProgress(); updateSection(); }
}
projectFilters.forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.projectFilter!)));
let searchTimer: ReturnType<typeof setTimeout>;
projectSearch.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => filterProjects(currentProjectFilter), 120); });
function clearProjectSearch() {
  clearTimeout(searchTimer); projectSearch.value = ''; filterProjects(currentProjectFilter); projectSearch.focus();
}
document.querySelector('#clear-search')!.addEventListener('click', clearProjectSearch);
document.querySelector('#reset-search')!.addEventListener('click', clearProjectSearch);
document.querySelector('#studio-projects')!.addEventListener('click', () => {
  projectSearch.value = '';
  filterProjects('studio');
  document.querySelector('#work')!.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
});

// A keyboard-first finder across sections, repositories, and the technology index.
const commandDialog = document.querySelector<HTMLDialogElement>('#command-dialog')!;
const commandSearch = document.querySelector<HTMLInputElement>('#command-search')!;
const commandResults = document.querySelector<HTMLUListElement>('#command-results')!;
let commandTrigger: HTMLElement | null = null;
let restoreFinderFocus = true;
type FinderItem = { name: string; detail: string; kind: string; action: () => void };
function closeFinder(restoreFocus = true) { restoreFinderFocus = restoreFocus; commandDialog.close(); }
function navigateTo(id: string) {
  closeFinder(false);
  const section = document.getElementById(id);
  section?.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  const heading = section?.querySelector<HTMLElement>('h2,h1');
  if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
}
const finderItems: FinderItem[] = [
  { name: 'Project index', detail: 'All 15 repositories and collaborations', kind: 'SECTION', action: () => navigateTo('work') },
  { name: 'GYK Studio', detail: 'Organization and Discord community · Owner', kind: 'SECTION', action: () => navigateTo('studio') },
  { name: 'Technology stack', detail: 'Eight categories, from languages to design', kind: 'SECTION', action: () => navigateTo('toolkit') },
  { name: 'Contact Joel', detail: profile.email, kind: 'SECTION', action: () => navigateTo('contact') },
  ...projects.map(project => ({
    name: project.name, detail: project.stack.join(' · '), kind: 'PROJECT',
    action: () => {
      projectSearch.value = ''; filterProjects('all'); closeFinder(false);
      const row = rows.find(row => row.dataset.id === project.id)!;
      const toggle = row.querySelector<HTMLButtonElement>('.project-toggle')!;
      if (toggle.getAttribute('aria-expanded') !== 'true') toggle.click();
      row.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'center' });
      toggle.focus({ preventScroll: true });
    },
  })),
  ...technologies.flatMap(group => group.tools.map(tool => ({
    name: tool.name, detail: group.name + ' / ' + tool.kind, kind: 'TECH',
    action: () => { selectTechnology(tabs.find(tab => tab.dataset.tech === group.id)!); navigateTo('toolkit'); },
  }))),
];
function renderFinder() {
  const query = normalizeSearch(commandSearch.value);
  const found = finderItems.filter(item => normalizeSearch(item.name + ' ' + item.detail).includes(query)).slice(0, query ? 9 : 7);
  commandResults.replaceChildren();
  found.forEach(item => {
    const li = document.createElement('li');
    const button = document.createElement('button'); button.type = 'button';
    const copy = document.createElement('span');
    const name = document.createElement('span'); name.className = 'command-result-name'; name.textContent = item.name;
    const detail = document.createElement('span'); detail.className = 'command-result-detail'; detail.textContent = item.detail;
    const kind = document.createElement('span'); kind.className = 'command-result-kind'; kind.textContent = item.kind;
    copy.append(name, detail); button.append(copy, kind); button.addEventListener('click', item.action); li.append(button); commandResults.append(li);
  });
  if (!found.length) {
    const li = document.createElement('li'); li.className = 'command-no-results'; li.textContent = 'No matches. Try a project name or technology.'; commandResults.append(li);
  }
}
function openFinder() {
  if (commandDialog.open) return;
  commandTrigger = document.activeElement as HTMLElement;
  restoreFinderFocus = true;
  commandSearch.value = ''; renderFinder(); commandDialog.showModal(); commandSearch.focus();
  if (!reducedMotion.matches) gsap.fromTo(commandDialog, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .25, clearProps: 'all' });
}
document.querySelector('#open-command')!.addEventListener('click', openFinder);
document.querySelector('#close-command')!.addEventListener('click', () => closeFinder());
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault(); commandDialog.open ? closeFinder() : openFinder();
  }
});
commandSearch.addEventListener('input', renderFinder);
commandDialog.addEventListener('keydown', event => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
  event.preventDefault();
  const buttons = [...commandResults.querySelectorAll<HTMLButtonElement>('button')];
  if (!buttons.length) return;
  const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
  const next = current < 0 ? (event.key === 'ArrowDown' ? 0 : buttons.length - 1) :
    (current + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
  buttons[next]!.focus();
});
commandSearch.addEventListener('keydown', event => {
  if (event.key === 'Enter') { event.preventDefault(); commandResults.querySelector<HTMLButtonElement>('button')?.click(); }
});
commandDialog.addEventListener('click', event => {
  const bounds = commandDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeFinder();
});
commandDialog.addEventListener('close', () => { if (restoreFinderFocus) commandTrigger?.focus({ preventScroll: true }); });

document.querySelectorAll<HTMLButtonElement>('.project-toggle').forEach(button => button.addEventListener('click', () => {
  const notes = document.getElementById(button.getAttribute('aria-controls')!)!;
  const icon = button.querySelector('.row-toggle-icon');
  const open = button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', String(open));
  gsap.killTweensOf(notes);
  if (reducedMotion.matches) {
    notes.hidden = !open;
    if (icon) gsap.set(icon, { rotation: open ? 45 : 0 });
    ScrollTrigger.refresh(); return;
  }
  if (icon) gsap.to(icon, { rotation: open ? 45 : 0, duration: .35, ease: 'power3.out' });
  if (open) {
    notes.hidden = false;
    gsap.fromTo(notes, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: .45, ease: 'power3.out', clearProps: 'height,opacity', onComplete: () => ScrollTrigger.refresh() });
    gsap.fromTo(notes.querySelectorAll('li, .project-tags'), { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: .35, stagger: .04, delay: .1, clearProps: 'all' });
  } else gsap.to(notes, { height: 0, opacity: 0, duration: .3, ease: 'power2.inOut',
    onComplete: () => { notes.hidden = true; gsap.set(notes, { clearProps: 'height,opacity' }); ScrollTrigger.refresh(); } });
}));

// Fully labelled tabs: separate runtimes, frameworks, databases, and tooling.
const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-tech]')];
const panels = [...document.querySelectorAll<HTMLElement>('.tech-panel')];
const marker = document.querySelector<HTMLElement>('.tech-active-marker')!;
const tabList = document.querySelector<HTMLElement>('.tech-tabs')!;
function positionMarker(animate = true) {
  const active = tabs.find(tab => tab.getAttribute('aria-selected') === 'true')!;
  tabList.setAttribute('aria-orientation', window.innerWidth > 760 ? 'vertical' : 'horizontal');
  if (reducedMotion.matches || !animate) gsap.set(marker, { y: active.offsetTop, height: active.offsetHeight });
  else gsap.to(marker, { y: active.offsetTop, height: active.offsetHeight, duration: .45, ease: 'power3.inOut', overwrite: true });
}
function selectTechnology(tab: HTMLButtonElement, focus = false) {
  tabs.forEach(button => { const selected = button === tab; button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1; });
  panels.forEach(panel => panel.hidden = panel.id !== tab.getAttribute('aria-controls'));
  const panel = panels.find(panel => !panel.hidden)!;
  if (!reducedMotion.matches) {
    gsap.killTweensOf(panel.querySelectorAll('.tech-panel-header, .tech-cell'));
    gsap.fromTo(panel.querySelectorAll('.tech-panel-header, .tech-cell'), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .45, stagger: .035, clearProps: 'all' });
  }
  positionMarker(); ScrollTrigger.refresh(); updateProgress();
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTechnology(tab));
  tab.addEventListener('keydown', event => {
    const steps: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(event.key in steps) && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + steps[event.key]! + tabs.length) % tabs.length;
    selectTechnology(tabs[next]!, true);
  });
});
positionMarker(false);
window.addEventListener('resize', () => positionMarker(false));

// Copying only copies locally; mailto opens the visitor's email client.
document.querySelector('#copy-email')!.addEventListener('click', async () => {
  const feedback = document.querySelector('#copy-feedback')!;
  try {
    await navigator.clipboard.writeText(profile.email);
    feedback.textContent = 'Email copied. See you in the inbox.';
    if (!reducedMotion.matches) gsap.fromTo(feedback, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: .3 });
  } catch {
    feedback.textContent = 'Could not copy automatically. Select the address or use the email link.';
  }
});
