// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-await-in-loop */
import { existsSync } from 'fs';
import fs from 'fs/promises';

import { API_REPO_URL } from '@/utils/constants';
import { logger } from '@/utils/logger';
import type { HookList } from '@/utils/types';

const fetchLocalHookDependencies = async (hookName: string) => {
  const fetchUrl = `${API_REPO_URL}/hooks/${hookName}`;

  try {
    const response = await fetch(fetchUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch local hook dependencies.');
    }

    const repoData = (await response.json()) as HookList[];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return repoData.filter((hook) => hook.type === 'dir');
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    logger.error('Error fetch local dependency of hook. Try again.');
    process.exit(1);
  }
};

export const downloadUtility = async (
  utilName: string,
  fetchUrl: string,
  pathToLoadDependencies: string
) => {
  try {
    const response = await fetch(fetchUrl);

    if (!response.ok) {
      throw new Error(`\n An error occurred adding ${utilName} util. Try again.`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.writeFile(`${pathToLoadDependencies}/${utilName}`, buffer);
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    logger.error(`\n Error downloading ${utilName} util. Try again.`);
    process.exit(1);
  }
};

const fetchAndDownloadHookDependencies = async (url: string, pathToLoadDependencies: string) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return;
    }

    const depsUtils = (await response.json()) as HookList[];

    for (const dep of depsUtils) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      await downloadUtility(dep.name, dep.download_url, pathToLoadDependencies);
    }
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    logger.error('Error fetch hook deps. Try again.');
    process.exit(1);
  }
};

export const resolveLocalHookDependencies = async (hookName: string, path: string) => {
  const directoryDependencies = await fetchLocalHookDependencies(hookName);

  if (directoryDependencies.length) {
    for (const directory of directoryDependencies) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const directoryName = directory.name;
      const pathToLoadDependencies = `${path}/${directoryName}`;
      const apiPath = `${API_REPO_URL}/hooks/${hookName}/${directoryName}`;

      if (!existsSync(pathToLoadDependencies)) {
        await fs.mkdir(pathToLoadDependencies, { recursive: true });
      }

      await fetchAndDownloadHookDependencies(apiPath, pathToLoadDependencies);
    }
  }
};
