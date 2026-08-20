import { vitest } from '@siberiacancode/vitest';
import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    ...vitest,
    setupFiles: './tests/setupTests.ts',
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text'],
      exclude: ['**/*.module.css', 'tests/**']
    }
  },
  resolve: {
    alias: {
      '@/tests': path.resolve(__dirname, './tests'),
      '@': path.resolve(__dirname, './src')
    }
  }
});
