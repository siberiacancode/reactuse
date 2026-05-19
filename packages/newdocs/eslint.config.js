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
    files: ['**/*.ts'],
    rules: {
      'regexp/no-super-linear-backtracking': 'off'
    }
  },
  {
    name: 'siberiacancode/docs/rewrites',
    files: ['**/*.{ts,tsx,md}'],
    rules: {
      'react-hooks/rules-of-hooks': 'off'
    }
  }
);
