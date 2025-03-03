import { prettier } from '@siberiacancode/prettier';

/** @type {import('prettier').Config} */
export default { ...prettier, plugins: ['prettier-plugin-tailwindcss'] };
