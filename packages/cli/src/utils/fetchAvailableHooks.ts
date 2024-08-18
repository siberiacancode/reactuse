// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-member-access,no-await-in-loop */
import fs from 'fs/promises';
import ora from 'ora';

import { fetchUtilsDependencies } from '@/utils/fetchUtilsDependencies';
import { findImportUtils } from '@/utils/findImportUtils';
import { logger } from '@/utils/logger';

export interface HookList {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

export const fetchAvailableHooks = async (): Promise<HookList[]> => {
  const allHooksUrl = 'https://api.github.com/repos/siberiacancode/reactuse/contents/src/hooks';

  try {
    const response = await fetch(allHooksUrl);

    if (!response.ok) {
      throw new Error();
    }

    const hooksData = (await response.json()) as HookList[];

    return hooksData.filter((hook) => hook.name.startsWith('use'));
  } catch (e) {
    logger.error('Error obtaining the list of hooks. Try again.');
    process.exit(1);
  }
};

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
    logger.error(`\n Error downloading ${hookName} hook. Try again.`);
    process.exit(1);
  }
};

export const downloadHookList = async (
  hooks: string[],
  pathToLoad: string,
  pathToLoadUtils: string
) => {
  const spinner = ora(`Installing hooks...`).start();
  try {
    for (const hook of hooks) {
      spinner.text = `Installing ${hook}...`;
      const hookPath = await downloadHook(hook, pathToLoad);
      const utilsImport = await findImportUtils(hookPath);

      await fetchUtilsDependencies(utilsImport, pathToLoadUtils);
    }
    spinner.succeed('All hooks have been installed!');
  } catch (error) {
    spinner.fail('Error downloading hooks. Try again.');
  }
};
