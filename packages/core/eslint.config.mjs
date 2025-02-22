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
    name: 'siberiacancode/core/hooks',
    files: ['**/hooks/**/*.ts'],
    rules: {
      'jsdoc/no-defaults': 'off'
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
