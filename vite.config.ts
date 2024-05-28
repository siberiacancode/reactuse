import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.test.ts', '**/*.test.tsx'],
    globals: true,
    setupFiles: './tests/setupTests.ts',
    environment: 'jsdom',
    coverage: {
      reporter: ['lcov', 'text']
    },
    outputFile: 'coverage/sonar-report.xml'
  },
  resolve: {
    alias: {
      '@/tests': path.resolve(__dirname, './tests'),
      '@': path.resolve(__dirname, './src')
    }
  }
});
