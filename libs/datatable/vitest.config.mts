/// <reference types="vitest" />
import angular from '@analogjs/vite-plugin-angular';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [angular(), tsconfigPaths()],
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/datatable',
  server: {
    fs: {
      allow: ['../..'],
    },
  },
  test: {
    name: 'datatable',
    watch: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: process.env['CI'] ? ['default', 'github-actions'] : ['default'],
    coverage: {
      reportsDirectory: '../../coverage/libs/datatable',
      provider: 'v8' as const,
    },
    server: {
      deps: {
        inline: [/.*/],
      },
    },
  },
});
