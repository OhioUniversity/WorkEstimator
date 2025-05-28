import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // base dir with index.html
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    open: true, // auto-open browser on dev server start
  }
});