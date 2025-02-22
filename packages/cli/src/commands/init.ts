import path from 'node:path';
import prompts from 'prompts';
import fs from 'node:fs';

import { APP_PATH } from '@/utils/constants';
import chalk from 'chalk';

export const init = {
  command: 'init',
  describe: 'Initialize config file',

  handler: async () => {
    const highlight = (text: string) => chalk.cyan(text);

    const config = await prompts([
      {
        type: 'toggle',
        name: 'typescript',
        message: `Would you like to use ${highlight('TypeScript')} (recommended)?`,
        initial: true,
        active: 'yes',
        inactive: 'no'
      },
      {
        type: 'text',
        name: 'hookPath',
        message: 'Configure the import alias for hooks',
        initial: '@/shared/hooks'
      },
      {
        type: 'text',
        name: 'utilsPath',
        message: 'Configure the import alias for utils',
        initial: '@/utils/helpers'
      }
    ]);

    const configPath = path.join(APP_PATH, 'reactuse.config.json');

    await fs.promises.writeFile(configPath, JSON.stringify({ ...config }, null, 2), 'utf8');
  }
};
