// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { existsSync } from 'fs';
import path from 'path';
import type { Argv } from 'yargs';

import { logger } from '@/utils/logger';
import { promptForConfig } from '@/utils/promptForConfig';
import type { InitOptionsSchema } from '@/utils/types';
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
