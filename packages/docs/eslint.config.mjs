import { eslint } from '@siberiacancode/eslint';

export default eslint(
  {
    typescript: true,
    react: true,
    jsx: true,
    vue: true
  },
  {
    name: 'siberiacancode/reactuse/md',
    files: ['**/*.md'],
    rules: {
      'style/max-len': 'off'
    }
  },
  {
    name: 'siberiacancode/reactuse/docs',
    files: ['**/src/**/*.ts'],
    rules: {
      'regexp/no-super-linear-backtracking': 'off'
    }
  }
);
