//import { viteSingleFile } from 'vite-plugin-singlefile';
import { defineConfig } from 'vitest/config';
import path from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  base: '/WorkEstimator/',
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/index.ts'),
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
  plugins: [
    dts({
      entryRoot: 'src',
      outDir: 'dist',
      insertTypesEntry: true,
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/*.test.ts'],
  },
});
