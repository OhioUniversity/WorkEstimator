//import { viteSingleFile } from 'vite-plugin-singlefile';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  base: '/WorkEstimator/',
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/main.ts'),
      name: 'WorkEstimator',
      fileName: (format) => `work-estimator.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
      input: './index.html',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/*.test.ts'],
  },
});
