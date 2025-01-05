import ora from 'ora';

import { fetchUtilsDependencies } from '@/utils/dependencies/fetchUtilsDependencies';
import { fetchHook } from '@/utils/hooks/fetchHook';
import { findImports } from '@/utils/imports/findImports';
import { resolveLocalHookDependencies } from '@/utils/imports/resolveLocalHookDependencies';

export const fetchHookList = async (
  hooks: string[],
  hooksDirectory: string,
  utilsDirectory: string,
  isAllOption?: boolean
) => {
  const spinner = ora(`Installing hooks...`).start();
  try {
    for (const hook of hooks) {
      spinner.text = `Installing ${hook}...`;

      const [currentHookFilePath, currentHookDirectory] = await fetchHook(hook, hooksDirectory);
      await resolveLocalHookDependencies(hook, currentHookDirectory);
      const utilsImport = await findImports(currentHookFilePath, 'utils');
      const hooksDepsImport = await findImports(currentHookFilePath, 'dependencyHooks');

      await fetchUtilsDependencies(utilsImport, utilsDirectory);

      if (hooksDepsImport.length && isAllOption) {
        await fetchHookList(hooksDepsImport, hooksDirectory, utilsDirectory);
      }

      spinner.succeed('All hooks have been installed!');
    }
  } catch (error) {
    spinner.fail(`Error downloading hooks. Try again. Error - ${error}`);
  }
};
