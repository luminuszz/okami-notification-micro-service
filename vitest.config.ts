import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    alias: {
      '@test': path.resolve(__dirname, 'test'),
      '@domain': path.resolve(__dirname, 'src/domain'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@': path.resolve(__dirname, 'src'),
      '@infra': path.resolve(__dirname, 'src/infra'),
    },
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      exclude: ['**/node_modules/**', '**/test/**', '**/dist/**'],
    },
  },
});
