import fs from 'node:fs';

import type { HookRegistry } from '@/utils/types';

import { REGISTRY_PATH } from '@/registry/generateRegistry';
import { FETCH_REPO_URL } from '@/utils/constants';
import { logger } from '@/utils/logger';
import {
  extractHookDependencies,
  extractLocalDependencies,
  extractUtilsDependencies
} from '@/registry/utils/dependencies';
import { fetchAvailableHooks } from '@/registry/utils/fetchAvailableHooks';
export const updateRegistry = async () => {
  let hooksRegistry: HookRegistry[] = [];

  if (fs.existsSync(REGISTRY_PATH)) {
    const existingRegistry = fs.readFileSync(REGISTRY_PATH, 'utf-8');
    hooksRegistry = JSON.parse(existingRegistry);
  }

  const hooksData = await fetchAvailableHooks();

  for (const hook of hooksData) {
    const existingHook = hooksRegistry.find((registryHook) => registryHook.name === hook.name);

    if (existingHook) continue;

    const hookFileUrl = `${FETCH_REPO_URL}/hooks/${hook.name}/${hook.name}.ts`;

    try {
      const hookContent = await fetch(hookFileUrl).then((res) => res.text());

      hooksRegistry.push({
        name: hook.name,
        hookDependency: extractHookDependencies(hookContent),
        utilsDependency: extractUtilsDependencies(hookContent),
        localDependency: extractLocalDependencies(hookContent)
      });
    } catch (error) {
      console.error(`Error processing hook: ${hook.name}`, error);
    }
  }

  try {
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(hooksRegistry, null, 2));
    logger.info('Hooks registry updated successfully');
  } catch (error) {
    logger.error(`Error saving updated registry file. Error - ${error}`);
  }
};
