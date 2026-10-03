import { defineConfig } from 'vite';

export default defineConfig({
  cacheDir: '.vite',
  optimizeDeps: {
    exclude: ['gsap'],
  },
});
