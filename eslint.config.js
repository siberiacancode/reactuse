import { eslint } from '@siberiacancode/eslint';

export default eslint(
  {
    typescript: true,
    react: true,
    jsx: true
  },
  {
    name: 'hooks',
    files: ['**/hooks/**/*.ts'],
    rules: {
      'jsdoc/no-defaults': 'off'
    }
  },
  {
    name: 'demo',
    files: ['**/*.demo.tsx'],
    rules: {
      'no-alert': 'off'
    }
  },
  {
    name: 'md',
    files: ['**/*.md'],
    rules: {
      'style/max-len': 'off'
    }
  },
  {
    name: 'docs',
    files: ['**/docs/**/*.ts'],
    rules: {
      'regexp/no-super-linear-backtracking': 'off'
    }
  }
);
