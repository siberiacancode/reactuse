import type { Argv } from 'yargs';

import { existsSync } from 'node:fs';
import path from 'node:path';

import type { InitOptionsSchema } from '@/utils/types';

import { promptForConfig } from '@/utils/config/promptForConfig';
import { logger } from '@/utils/logger';
import { initOptionsSchema } from '@/utils/types';

export const init = {
  command: 'init',
  describe: 'initialize config file',
  builder: (yargs: Argv) =>
    yargs.option('cwd', {
      alias: 'c',
      type: 'string',
      description: 'the working directory. defaults to the current directory.'
    }),

  handler: async (argv: InitOptionsSchema) => {
    const options = initOptionsSchema.parse({
      cwd: argv.cwd
    });

    const cwd = path.resolve(options.cwd ?? process.cwd());

    if (!existsSync(cwd)) {
      logger.error(`The path ${cwd} does not exist. Please try again.`);
      process.exit(1);
    }

    await promptForConfig(cwd);
  }
};
