import { API_REPO_URL } from '@/utils/constants';
import { logger } from '@/utils/logger';
import type { HookList } from '@/utils/types';

export const fetchAvailableHooks = async (): Promise<HookList[]> => {
  const allHooksUrl = `${API_REPO_URL}/hooks`;
  try {
    const response = await fetch(allHooksUrl);

    const hooksData = (await response.json()) as HookList[];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return hooksData.filter((hook) => hook.name.startsWith('use'));
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    logger.error('Error obtaining 1the list of hooks. Try again.');
    process.exit(1);
  }
};
