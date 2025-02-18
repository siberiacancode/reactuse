import { API_REPO_URL } from '@/utils/constants';
import { logger } from '@/utils/logger';

interface HookList {
  name: string;
  path: string;
}

export const fetchAvailableHooks = async () => {
  const allHooksUrl = `${API_REPO_URL}/hooks`;
  try {
    const response = await fetch(allHooksUrl);

    const hooksData = (await response.json()) as HookList[];

    const filteredHooks = hooksData.filter((hook) => hook.name.startsWith('use'));

    return filteredHooks;
  } catch (error) {
    logger.error(`Error obtaining list of hooks. Try again. Error - ${error}`);
    process.exit(1);
  }
};
