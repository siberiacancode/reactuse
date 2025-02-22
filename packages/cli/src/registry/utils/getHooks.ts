import { logger } from '@/utils/logger';

const API_REPO_URL =
  'https://api.github.com/repos/siberiacancode/reactuse/contents/packages/core/src';

interface HookList {
  name: string;
  path: string;
}

export const getHooks = async () => {
  const allHooksUrl = `${API_REPO_URL}/hooks`;
  try {
    const response = await fetch(allHooksUrl);

    const hooksData = ((await response.json()) as HookList[]).filter((hook) =>
      hook.name.startsWith('use')
    );

    return hooksData;
  } catch (error) {
    logger.error(`Error obtaining list of hooks. Try again. Error - ${error}`);
    process.exit(1);
  }
};
