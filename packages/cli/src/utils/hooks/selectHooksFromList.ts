import prompts from 'prompts';

import type { AddOptionsSchema, HookRegistry } from '@/utils/types';

import { logger } from '@/utils/logger';

export const selectHooksFromList = async (
  registry: HookRegistry[],
  options: AddOptionsSchema
): Promise<string[]> => {
  let selectedHooks = options.all ? registry.map((hook) => hook.name) : options.hooks;

  if (!options.hooks?.length && !options.all) {
    const { hooks } = await prompts({
      type: 'multiselect',
      name: 'hooks',
      message: 'Which hooks would you like to add?',
      hint: 'Space to select. A to toggle all. Enter to submit.',
      instructions: false,
      choices: registry.map((hook) => ({
        title: hook.name,
        value: hook.name,
        selected: options.all ? true : options.hooks?.includes(hook.name)
      }))
    });

    selectedHooks = hooks;
  }

  if (!selectedHooks?.length) {
    logger.warn('No hooks selected. Exiting.');
    process.exit(0);
  }

  return selectedHooks;
};
