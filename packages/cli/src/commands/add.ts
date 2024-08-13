// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import chalk from 'chalk';
import { existsSync, promises as fs } from 'fs';
import path from 'path';
import { loadConfig } from 'tsconfig-paths';
import type { Argv } from 'yargs';

import { downloadHookList, fetchAvailableHooks } from '@/utils/fetchAvailableHooks';
import { getConfig } from '@/utils/getConfig';
import { logger } from '@/utils/logger';
import { resolveImport } from '@/utils/resolveImport';
import { selectHooksFromList } from '@/utils/selectHooksFromList';
import type { AddOptionsSchema } from '@/utils/types';
import { addOptionsSchema } from '@/utils/types';

export const add = {
  command: 'add [hooks...]',
  describe: 'add a hook to your project',
  builder: (yargs: Argv) =>
    yargs

      .option('all', {
        alias: 'a',
        type: 'boolean',
        default: false,
        description: 'add all available hooks'
      })
      .option('cwd', {
        alias: 'c',
        type: 'string',
        description: 'the working directory. defaults to the current directory.'
      }),

  handler: async (argv: AddOptionsSchema) => {
    const options = addOptionsSchema.parse({
      hooks: argv.hooks,
      all: argv.all,
      cwd: argv.cwd
    });

    const cwd = path.resolve(options.cwd ?? process.cwd());

    if (!existsSync(cwd)) {
      logger.error(`The path ${cwd} does not exist. Please try again.`);
      process.exit(1);
    }

    const config = await getConfig(cwd);
    if (!config) {
      logger.warn(
        `Configuration is missing. Please run ${chalk.green(
          `init`
        )} to create a components.json file.`
      );
      process.exit(1);
    }

    const selectedHooksFromCmd = options.hooks?.length;
    const allHookList = await fetchAvailableHooks();

    const tsConfig = await loadConfig(cwd);

    if (tsConfig.resultType === 'failed') {
      throw new Error(`Failed to load tsconfig.json. ${tsConfig.message ?? ''}`.trim());
    }

    const pathToLoadHooks = (await resolveImport(config.hookPath, tsConfig)) as string;

    if (!existsSync(pathToLoadHooks)) {
      await fs.mkdir(pathToLoadHooks, { recursive: true });
    }

    if (options.hooks) {
      await downloadHookList(options.hooks, pathToLoadHooks);
    }

    if (options.all) {
      const hookNames = allHookList.map((hook) => hook.name);
      await downloadHookList(hookNames, pathToLoadHooks);
    }

    if (!selectedHooksFromCmd) {
      const hookNames = await selectHooksFromList(allHookList, options);
      await downloadHookList(hookNames, pathToLoadHooks);
    }
  }
};
