// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { cosmiconfig } from 'cosmiconfig';

import { configSchema } from '@/utils/promptForConfig';

export const getConfig = async (cwd: string) => {
  const explorer = cosmiconfig('configHooks', {
    searchPlaces: ['reactuse.config.json']
  });

  try {
    const configResult = await explorer.search(cwd);

    if (!configResult) {
      return null;
    }

    return configSchema.parse(configResult.config);
  } catch (error) {
    throw new Error(`Invalid configuration found in ${cwd}/reactuse.config.json.`);
  }
};
