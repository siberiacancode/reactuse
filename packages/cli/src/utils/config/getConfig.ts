import { cosmiconfig } from 'cosmiconfig';

import type { PreferLanguage } from '@/utils/types';

import { REPO_URLS } from '@/utils/constants';
import { configSchema } from '@/utils/types';

export const getConfig = async (cwd: string) => {
  const explorer = cosmiconfig('configHooks', {
    searchPlaces: ['reactuse.config.json']
  });

  try {
    const configResult = await explorer.search(cwd);
    if (!configResult) return null;

    return configSchema.parse(configResult.config);
  } catch (error) {
    throw new Error(`Invalid configuration found in ${cwd}/reactuse.config.json. Error - ${error}`);
  }
};

export const getUrl = (preferLanguage: PreferLanguage) => {
  if (preferLanguage === 'js') return REPO_URLS.JS;

  return REPO_URLS.TS;
};
