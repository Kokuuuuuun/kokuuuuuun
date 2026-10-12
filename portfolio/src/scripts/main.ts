import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, technologies } from '../data/profile';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const themeButton = document.querySelector<HTMLButtonElement>('.theme-toggle')!;
function updateThemeLabel() {
  themeButton.setAttribute('aria-label', root.dataset.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
}
updateThemeLabel();
themeButton.addEventListener('click', () => {
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = theme;
  try { localStorage.setItem('joel-theme', theme); } catch { /* Theme still works without storage. */ }
  updateThemeLabel();
});

const motion = gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.from('.hero-enter', { y: 22, opacity: 0, duration: .85, stagger: .09, ease: 'power3.out', clearProps: 'all' });
  gsap.utils.toArray<HTMLElement>('.reveal').forEach(element => {
    gsap.from(element, { y: 30, opacity: 0, duration: .8, ease: 'power2.out', clearProps: 'all',
      scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
  });
});
function updateProgress() {
  const max = root.scrollHeight - window.innerHeight;
  (document.querySelector('.page-progress') as HTMLElement).style.transform = 'scaleX(' + (max ? window.scrollY / max : 0) + ')';
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

// A trefoil thread drawn as a 3D curve, with perspective and layered fibers.
const canvas = document.querySelector<HTMLCanvasElement>('#thread-canvas')!;
const context = canvas.getContext('2d');
const tension = document.querySelector<HTMLInputElement>('#tension')!;
const tensionValue = document.querySelector<HTMLElement>('#tension-value')!;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
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
  const rotation = time * .08 + pointerX * .65;
  const tilt = -.35 + pointerY * .45;
  const scale = Math.min(width * .21, height * .18);
  const points: {x: number; y: number; z: number}[] = [];
  for (let i = 0; i <= 380; i++) {
    const t = i / 380 * Math.PI * 2;
    const radius = 1.4 + (.35 + tightness * .45) * Math.cos(3 * t);
    const x = radius * Math.cos(2 * t), y = radius * Math.sin(2 * t), z = (.6 + tightness * .45) * Math.sin(3 * t);
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

// Small illustrative pattern editor, not a replica of the full application.
const stitches = [...document.querySelectorAll<HTMLButtonElement>('.stitch')];
const flower = [13, 14, 15, 16, 22, 23, 26, 27, 31, 32, 34, 35, 37, 38, 41, 42, 44, 45, 47, 48, 52, 53, 56, 57, 63, 64, 65, 66];
function stitchCount() {
  document.querySelector('#stitch-count')!.textContent = String(stitches.filter(stitch => stitch.getAttribute('aria-pressed') === 'true').length);
}
stitches.forEach((stitch, index) => {
  stitch.tabIndex = index === 0 ? 0 : -1;
  stitch.setAttribute('aria-pressed', String(flower.includes(index)));
  stitch.addEventListener('click', () => { stitch.setAttribute('aria-pressed', String(stitch.getAttribute('aria-pressed') !== 'true')); stitchCount(); });
  stitch.addEventListener('keydown', event => {
    const steps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -10, ArrowDown: 10 };
    if (!(event.key in steps)) return;
    event.preventDefault();
    const next = stitches[Math.max(0, Math.min(stitches.length - 1, index + steps[event.key]!))]!;
    stitches.forEach(cell => cell.tabIndex = -1);
    next.tabIndex = 0;
    next.focus();
  });
});
stitchCount();
document.querySelector('#clear-pattern')!.addEventListener('click', () => { stitches.forEach(stitch => stitch.setAttribute('aria-pressed', 'false')); stitchCount(); });

const books = [...document.querySelectorAll<HTMLButtonElement>('.book')];
books.forEach((book, index) => book.addEventListener('click', () => {
  books.forEach(other => { other.classList.remove('selected'); other.setAttribute('aria-pressed', 'false'); });
  book.classList.add('selected'); book.setAttribute('aria-pressed', 'true');
  document.querySelector('#reader-selection')!.textContent = 'Study ' + String(index + 1).padStart(2, '0') + ' selected';
}));

const filters = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
const toolList = document.querySelector<HTMLElement>('#tool-list')!;
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => { filter.classList.remove('active'); filter.setAttribute('aria-pressed', 'false'); });
  button.classList.add('active'); button.setAttribute('aria-pressed', 'true');
  const tools = technologies[button.dataset.filter!];
  if (!tools) return;
  toolList.replaceChildren(...tools.map((tool, index) => {
    const item = document.createElement('div'); item.className = 'tool-item';
    const number = document.createElement('span'); number.className = 'mono'; number.textContent = String(index + 1).padStart(2, '0');
    const name = document.createElement('span'); name.textContent = tool;
    const plus = document.createElement('span'); plus.className = 'tool-plus'; plus.textContent = '+'; plus.setAttribute('aria-hidden', 'true');
    item.append(number, name, plus); return item;
  }));
  if (!reducedMotion.matches) gsap.fromTo('.tool-item', { opacity: 0, y: 7 }, { opacity: 1, y: 0, duration: .3, stagger: .025, clearProps: 'all' });
  ScrollTrigger.refresh(); updateProgress();
}));

const dialog = document.querySelector<HTMLDialogElement>('#project-dialog')!;
let dialogTrigger: HTMLButtonElement | null = null;
document.querySelectorAll<HTMLButtonElement>('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects.find(project => project.id === button.dataset.project);
  if (!project) return;
  dialogTrigger = button;
  document.querySelector('#dialog-title')!.textContent = project.name;
  document.querySelector('#dialog-kind')!.textContent = project.kind;
  document.querySelector('#dialog-description')!.textContent = project.detail;
  const notes = document.querySelector('#dialog-notes')!;
  notes.replaceChildren(...project.notes.map(note => { const li = document.createElement('li'); li.textContent = note; return li; }));
  document.querySelector<HTMLAnchorElement>('#dialog-repo')!.href = project.repo;
  dialog.showModal();
}));
document.querySelector('#close-dialog')!.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => dialogTrigger?.focus());
