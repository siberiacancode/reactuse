import fs from 'fs/promises';

import { logger } from '@/utils/logger';

export const downloadHook = async (hookName: string, path: string) => {
  const hookUrl = `https://raw.githubusercontent.com/siberiacancode/reactuse/main/src/hooks/${hookName}/${hookName}.ts`;
  const hookPath = `${path}/${hookName}.ts`;
  try {
    const response = await fetch(hookUrl);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`\n The ${hookName} hook does not exist.`);
      } else {
        throw new Error(`\n An error occurred adding ${hookName}. Try again.`);
      }
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.writeFile(hookPath, buffer);

    return hookPath;
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    logger.error(`\n Error downloading ${hookName} hook. Try again.`);
    process.exit(1);
  }
};
