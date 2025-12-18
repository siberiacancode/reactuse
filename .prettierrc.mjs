import { prettier } from '@siberiacancode/prettier';

/** @type {import('@siberiacancode/prettier').Prettier} */
export default { ...prettier, plugins: ['prettier-plugin-tailwindcss'] };
