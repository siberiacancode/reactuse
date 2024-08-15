import { eslint } from '@siberiacancode/eslint';

export default eslint(
  {
    typescript: true,
    react: true,
    jsx: true,
    vue: true,
    stylistic: true
  },
  {
    name: 'siberiacancode/hooks',
    files: ['**/hooks/**/*.ts'],
    rules: {
      'jsdoc/no-defaults': 'off'
    }
  },
  {
    name: 'siberiacancode/demo',
    files: ['**/*.demo.tsx'],
    rules: {
      'no-alert': 'off'
    }
  },
  {
    name: 'siberiacancode/md',
    files: ['**/*.md'],
    rules: {
      'style/max-len': 'off'
    }
  },
  {
    name: 'siberiacancode/docs',
    files: ['**/docs/**/*.ts'],
    rules: {
      'regexp/no-super-linear-backtracking': 'off'
    }
  }
);
