import { logger } from '@/utils/logger';

export interface HookList {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

export const fetchAvailableHooks = async (): Promise<HookList[]> => {
  const allHooksUrl = 'https://api.github.com/repos/siberiacancode/reactuse/contents/src/hooks';

  try {
    const response = await fetch(allHooksUrl);

    if (!response.ok) {
      throw new Error();
    }

    const hooksData = (await response.json()) as HookList[];

    return hooksData.filter((hook) => hook.name.startsWith('use'));
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    logger.error('Error obtaining the list of hooks. Try again.');
    process.exit(1);
  }
};
