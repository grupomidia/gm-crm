import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: process.env.INIT_CWD || process.cwd(),
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    globals: true,
  },
});
