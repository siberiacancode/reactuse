import { oxfmt } from '@siberiacancode/oxfmt';

export default {
  ...oxfmt,
  ignorePatterns: ['**/dist', '**/node_modules', '**/cache', '**/pnpm-lock.yaml', '**/.next']
};
