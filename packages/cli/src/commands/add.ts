import type { Argv } from 'yargs';

import chalk from 'chalk';
import ora from 'ora';
import { loadConfig } from 'tsconfig-paths';

import type { AddOptionsSchema } from '@/utils/types';

import { getConfig } from '@/utils/config/getConfig';
import { downloadHooks } from '@/utils/hooks/downloadHooks';
import { selectHooksFromList } from '@/utils/hooks/selectHooksFromList';
import { resolveImport } from '@/utils/imports/resolveImport';
import { logger } from '@/utils/logger';
import { getRegistryIndex } from '@/registry/getRegistry';
import { addOptionsSchema } from '@/utils/types';
import { APP_PATH } from '@/utils/constants';

export const add = {
  command: 'add [hooks...]',
  describe: 'add a hook to your project',
  builder: (yargs: Argv) =>
    yargs
      .positional('hooks', {
        describe: 'List of hooks to add',
        type: 'string',
        demandOption: true,
        array: true
      })
      .option('all', {
        alias: 'a',
        type: 'boolean',
        default: false,
        description: 'add all available hooks'
      }),

  handler: async (argv: AddOptionsSchema) => {
    const options = addOptionsSchema.parse({
      hooks: argv.hooks,
      all: argv.all
    });

    const config = await getConfig(APP_PATH);
    if (!config) {
      logger.warn(
        `Configuration is missing. Please run ${chalk.green(
          `init`
        )} to create a reactuse.config.json file.`
      );
      process.exit(1);
    }

    const tsConfig = loadConfig(APP_PATH);

    if (tsConfig.resultType === 'failed') {
      throw new Error(`Failed to load tsconfig.json. ${tsConfig.message ?? ''}`.trim());
    }

    const pathToLoadHooks = (await resolveImport(config.hookPath, tsConfig)) as string;
    const pathToLoadUtils = (await resolveImport(config.utilsPath, tsConfig)) as string;

    const registryIndex = await getRegistryIndex();
    const selectedHooks = await selectHooksFromList(registryIndex, options);

    const preferLanguage = config.typescript ? 'ts' : 'js';

    const spinner = ora(`Installing hooks...`).start();
    for (const hook of selectedHooks) {
      await downloadHooks(
        hook,
        registryIndex,
        pathToLoadHooks,
        pathToLoadUtils,
        spinner,
        config.utilsPath,
        preferLanguage
      );
    }
    spinner.succeed(`Done.`);
  }
};
