import { FETCH_REPO_URL_JS, FETCH_REPO_URL_TS } from '@/utils/constants';
import { configSchema, PreferLanguage } from '@/utils/types';
import { cosmiconfig } from 'cosmiconfig';

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
    throw new Error(`Invalid configuration found in ${cwd}/reactuse.config.json. Error - ${error}`);
  }
};

export const getUrl = (preferLanguage: PreferLanguage) => {
  if (preferLanguage === 'js') return FETCH_REPO_URL_JS;

  return FETCH_REPO_URL_TS;
};
