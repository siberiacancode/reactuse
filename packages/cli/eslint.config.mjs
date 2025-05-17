import { eslint } from '@siberiacancode/eslint';

/** @type {import('eslint').Linter.FlatConfig} */
export default eslint(
  {
    typescript: true
  },
  {
    name: 'siberiacancode/cli/rewrite',
    rules: {
      'node/prefer-global/process': 'off',
      'node/prefer-global/buffer': 'off'
    }
  }
);
