import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  vite: {
    server: { allowedHosts: ['localhost'] },
    optimizeDeps: { exclude: ['gsap', 'gsap/ScrollTrigger'] },
  },
});
