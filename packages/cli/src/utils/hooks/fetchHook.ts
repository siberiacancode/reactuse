import { existsSync } from 'fs';
import fs from 'fs/promises';

import { FETCH_REPO_URL } from '@/utils/constants';
import { logger } from '@/utils/logger';

export const fetchHook = async (hookName: string, path: string) => {
  const hookUrl = `${FETCH_REPO_URL}/hooks/${hookName}/${hookName}.ts`;
  const hookDirName = `${path}/${hookName}`;
  const pathToLoadHooks = `${hookDirName}/${hookName}.ts`;

  if (!existsSync(hookDirName)) {
    await fs.mkdir(hookDirName, { recursive: true });
  }

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

    await fs.writeFile(pathToLoadHooks, buffer);

    return [pathToLoadHooks, hookDirName];
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    logger.error(`\n Error downloading ${hookName} hook. Try again.`);
    process.exit(1);
  }
};
