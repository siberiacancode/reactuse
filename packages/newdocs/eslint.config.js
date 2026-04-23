import { eslint } from '@siberiacancode/eslint';

/** @type {import('@siberiacancode/eslint').Eslint} */
export default eslint(
  {
    typescript: true,
    react: true,
    jsx: true
  },
  {
    name: 'siberiacancode/reactuse/docs',
    files: ['**/src/**/*.ts'],
    rules: {
      'regexp/no-super-linear-backtracking': 'off'
    }
  }
);
