import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';

import type { HookList } from '@/utils/types';

import { API_REPO_URL } from '@/utils/constants';
import { logger } from '@/utils/logger';

const fetchLocalHookDependencies = async (hookName: string) => {
  const fetchUrl = `${API_REPO_URL}/hooks/${hookName}`;

  try {
    const response = await fetch(fetchUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch local hook dependencies.');
    }

    const repoData = (await response.json()) as HookList[];

    return repoData.filter((hook) => hook.type === 'dir');
  } catch (error) {
    logger.error(`Error fetch local dependency of hook. Try again. Error - ${error}`);
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
  } catch (error) {
    logger.error(`\n Error downloading ${utilName} util. Try again. Error - ${error}`);
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
      await downloadUtility(dep.name, dep.download_url, pathToLoadDependencies);
    }
  } catch (error) {
    logger.error(`Error fetch hook deps. Try again. Error - ${error}`);
    process.exit(1);
  }
};

export const resolveLocalHookDependencies = async (hookName: string, path: string) => {
  const directoryDependencies = await fetchLocalHookDependencies(hookName);

  if (directoryDependencies.length) {
    for (const directory of directoryDependencies) {
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
