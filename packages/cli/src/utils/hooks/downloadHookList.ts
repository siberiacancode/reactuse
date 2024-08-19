// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-await-in-loop */
import ora from 'ora';

import { fetchUtilsDependencies } from '@/utils/dependencies/fetchUtilsDependencies';
import { downloadHook } from '@/utils/hooks/downloadHook';
import { findImportUtils } from '@/utils/imports/findImportUtils';

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
