import prompts from 'prompts';

import type { AddOptionsSchema, HookList } from '@/utils/types';

import { logger } from '@/utils/logger';

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
