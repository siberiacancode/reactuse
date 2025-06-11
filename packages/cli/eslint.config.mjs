import { eslint } from '@siberiacancode/eslint';

/** @type {import('eslint').Linter.FlatConfig} */
export default eslint(
  {
    typescript: true
  },
  {
    name: 'siberiacancode/cli/rewrite',
    rules: {
      'regexp/no-super-linear-backtracking': 'warn',
      'node/prefer-global/process': 'off',
      'node/prefer-global/buffer': 'off'
    }
  }
);
