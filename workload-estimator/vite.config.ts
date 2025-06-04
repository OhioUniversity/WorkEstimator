import { viteSingleFile } from 'vite-plugin-singlefile';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/WorkEstimator/',
  plugins: [
    viteSingleFile()],
  build: {
    target: 'esnext',
    assetsInlineLimit: Infinity,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom', // Simulates DOM for component testing
    include: ['src/*.test.ts'],
  },
});
