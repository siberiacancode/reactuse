import { eslint } from '@siberiacancode/eslint';

export default eslint(
  {
    typescript: true,
    javascript: true,
    react: true,
    jsx: true,
    vue: true
  },
  {
    name: 'siberiacancode/core/ignores',
    ignores: ['**/bundle/**/*.js']
  },
  {
    name: 'siberiacancode/core/hooks',
    files: ['**/{hooks,helpers}/**/*.{ts,tsx}'],
    rules: {
      'react-dom/no-flush-sync': 'warn',
      'jsdoc/no-defaults': 'off',
      'react-hooks/rules-of-hooks': 'warn',
      'react/no-use-context': 'off',
      'react/no-context-provider': 'off'
    }
  },
  {
    name: 'siberiacancode/core/tests',
    files: ['**/*.test.ts'],
    rules: {
      'react/no-create-ref': 'off'
    }
  },
  {
    name: 'siberiacancode/core/demo',
    files: ['**/*.demo.tsx'],
    rules: {
      'no-alert': 'off'
    }
  }
);
