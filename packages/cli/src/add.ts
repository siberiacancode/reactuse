import type { Argv } from 'yargs';

import chalk from 'chalk';
import ora from 'ora';
import { loadConfig } from 'tsconfig-paths';

import type { AddOptionsSchema } from '@/utils/types';

import { getRegistry } from '@/registry/getRegistry';
import { getConfig } from '@/utils/config/getConfig';
import { APP_PATH } from '@/utils/constants';
import { downloadHooks } from '@/utils/hooks/downloadHooks';
import { selectHooksFromList } from '@/utils/hooks/selectHooksFromList';
import { resolveImport } from '@/utils/imports/resolveImport';
import { addOptionsSchema } from '@/utils/types';

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
      console.log(
        `Configuration is missing. Please run ${chalk.green(`init`)} to create a reactuse.config.json file.`
      );
      process.exit(1);
    }

    const tsConfig = loadConfig(APP_PATH);

    if (tsConfig.resultType === 'failed') {
      throw new Error(`Failed to load tsconfig.json. ${tsConfig.message ?? ''}`.trim());
    }

    const pathToLoadHooks = (await resolveImport(config.hookPath, tsConfig)) as string;
    const pathToLoadUtils = (await resolveImport(config.utilsPath, tsConfig)) as string;

    const registry = await getRegistry();
    const selectedHooks = await selectHooksFromList(registry, options);

    const preferLanguage = config.typescript ? 'ts' : 'js';

    const spinner = ora('Installing hooks...').start();
    for (const hook of selectedHooks) {
      await downloadHooks(
        hook,
        registry,
        pathToLoadHooks,
        pathToLoadUtils,
        spinner,
        config.utilsPath,
        preferLanguage
      );
    }
    spinner.succeed(
      `Done. ${selectedHooks.length === 1 ? `Hook ${selectedHooks[0]} installed` : 'Hooks installed'}`
    );
  }
};
