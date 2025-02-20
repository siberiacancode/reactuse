import { generateRollupConfig } from '@siberiacancode/builder';

import pkg from './package.json';

export default generateRollupConfig({
  pkg,
  input: { ignorePattern: 'src/**/*.{demo,test}.{ts,tsx}' }
});
