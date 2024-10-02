// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import prompts from 'prompts';

import type { HookList } from '@/utils/hooks/fetchAvailableHooks';
import { logger } from '@/utils/logger';
import type { AddOptionsSchema } from '@/utils/types';

export const selectHooksFromList = async (
  hookList: HookList[],
  options: AddOptionsSchema
): Promise<string[]> => {
  const { hooks } = await prompts({
    type: 'multiselect',
    name: 'hooks',
    message: 'Which hooks would you like to add?',
    hint: 'Space to select. A to toggle all. Enter to submit.',
    instructions: false,
    choices: hookList.map((entry) => ({
      title: entry.name,
      value: entry.name,
      selected: options.all ? true : options.hooks?.includes(entry.name)
    }))
  });

  if (!hooks?.length) {
    logger.warn('No hooks selected. Exiting.');
    process.exit(0);
  }

  return hooks;
};
