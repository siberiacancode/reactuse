import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/bin.ts'],
  format: ['cjs'],
  sourcemap: true,
  minify: true,
  target: 'esnext',
  outDir: 'dist'
});
