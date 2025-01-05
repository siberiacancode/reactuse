import type { HookList } from '@/utils/types';

import { API_REPO_URL } from '@/utils/constants';
import { logger } from '@/utils/logger';

export const fetchAvailableHooks = async (): Promise<HookList[]> => {
  const allHooksUrl = `${API_REPO_URL}/hooks`;
  try {
    const response = await fetch(allHooksUrl);

    const hooksData = (await response.json()) as HookList[];

    return hooksData.filter((hook) => hook.name.startsWith('use'));
  } catch (error) {
    logger.error(`Error obtaining 1the list of hooks. Try again. Error - ${error}`);
    process.exit(1);
  }
};
