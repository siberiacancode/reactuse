import { cosmiconfig } from 'cosmiconfig';

import { configSchema } from '@/utils/types';

export const getConfig = async (cwd: string) => {
  const explorer = cosmiconfig('configHooks', {
    searchPlaces: ['reactuse.json']
  });

  try {
    const configResult = (await explorer.search(cwd))!;
    return configSchema.parse(configResult.config);
  } catch (error) {
    throw new Error(`Invalid configuration found in ${cwd}/reactuse.json. Error - ${error}`);
  }
};
