import react from '@vitejs/plugin-react';
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import pkg from './package.json';

export default defineConfig({
  plugins: [
    react(),
    dts({
      afterBuild: () => {
        const esmEntry = 'dist/types/index.d.mts';

        copyFileSync('dist/types/index.d.ts', esmEntry);

        const declarations = readFileSync(esmEntry, 'utf8')
          .replace("from './helpers';", "from './helpers/index.js';")
          .replace("from './hooks';", "from './hooks/index.js';")
          .replace("from './utils/helpers';", "from './utils/helpers/index.js';");

        writeFileSync(esmEntry, declarations);
      },
      exclude: ['**/*.test.{ts,tsx}', '**/*.stories.{ts,tsx}'],
      entryRoot: 'src',
      outDirs: 'dist/types',
      tsconfigPath: './tsconfig.build.json'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      entry: path.resolve(import.meta.dirname, 'src/index.ts'),
      name: pkg.name,
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      input: {
        index: path.resolve(import.meta.dirname, 'src/index.ts')
      },
      external: [
        ...Object.keys(pkg.peerDependencies || {}),
        'react/jsx-runtime',
        'react-dom/client'
      ],
      output: [
        {
          format: 'es',
          dir: 'dist/esm',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].mjs'
        },
        {
          format: 'cjs',
          dir: 'dist/cjs',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].cjs',
          exports: 'named'
        }
      ]
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
});
