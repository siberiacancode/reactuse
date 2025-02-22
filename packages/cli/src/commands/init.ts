import path from 'node:path';
import prompts from 'prompts';
import { promises as fs } from 'node:fs';

import { APP_PATH } from '@/utils/constants';

export const init = {
  command: 'init',
  describe: 'Initialize config file',

  handler: async () => {
    const { hookPath, utilsPath } = await prompts([
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

    const targetPath = path.join(APP_PATH, 'reactuse.config.json');

    await fs.writeFile(targetPath, JSON.stringify({ hookPath, utilsPath }, null, 2), 'utf8');
  }
};
