import type { Argv } from 'yargs';

import chalk from 'chalk';
import { existsSync } from 'node:fs';
import path from 'node:path';
import ora from 'ora';
import { loadConfig } from 'tsconfig-paths';

import type { AddOptionsSchema } from '@/utils/types';

import { getConfig } from '@/utils/config/getConfig';
import { downloadHooks } from '@/utils/hooks';
import { selectHooksFromList } from '@/utils/hooks/selectHooksFromList';
import { resolveImport } from '@/utils/imports/resolveImport';
import { logger } from '@/utils/logger';
import { getRegistryIndex } from '@/utils/registry';
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

    const tsConfig = loadConfig(cwd);

    if (tsConfig.resultType === 'failed') {
      throw new Error(`Failed to load tsconfig.json. ${tsConfig.message ?? ''}`.trim());
    }

    const pathToLoadHooks = (await resolveImport(config.hookPath, tsConfig)) as string;
    const pathToLoadUtils = (await resolveImport(config.utilsPath, tsConfig)) as string;

    const registryIndex = await getRegistryIndex();
    const selectedHooks = await selectHooksFromList(registryIndex, options);

    const spinner = ora(`Installing hooks...`).start();
    for (const hook of selectedHooks) {
      await downloadHooks(
        hook,
        registryIndex,
        pathToLoadHooks,
        pathToLoadUtils,
        spinner,
        config.utilsPath
      );
    }
    spinner.succeed(`Done.`);
  }
};
