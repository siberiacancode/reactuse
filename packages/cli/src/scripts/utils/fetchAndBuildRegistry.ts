import fs from 'node:fs';
import path from 'node:path';

import type { HookRegistry } from '@/utils/types';

import { REGISTRY_PATH } from '@/scripts/generateRegistry';
import {
  extractHookDependencies,
  extractLocalDependencies,
  extractUtilsDependencies
} from '@/scripts/utils/dependencies';
import { fetchAvailableHooks } from '@/scripts/utils/fetchAvailableHooks';
import { FETCH_REPO_URL } from '@/utils/constants';
import { logger } from '@/utils/logger';

export const fetchAndBuildRegistry = async () => {
  const hooksData = await fetchAvailableHooks();

  const hooksRegistry: HookRegistry[] = [];

  for (const hook of hooksData) {
    hooksRegistry.push({
      name: hook.name,
      hookDependency: [],
      utilsDependency: [],
      localDependency: []
    });
  }

  for (const hook of hooksRegistry) {
    const hookFileUrl = `${FETCH_REPO_URL}/hooks/${hook.name}/${hook.name}.ts`;
    try {
      const hookContent = await fetch(hookFileUrl).then((res) => res.text());

      hook.hookDependency = extractHookDependencies(hookContent);
      hook.utilsDependency = extractUtilsDependencies(hookContent);
      hook.localDependency = extractLocalDependencies(hookContent);
    } catch (error) {
      console.error(`Error processing hook: ${hook.name}`, error);
    }
  }

  try {
    fs.mkdirSync(path.dirname(REGISTRY_PATH), { recursive: true });

    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(hooksRegistry, null, 2));

    logger.info('Hooks registry saved to registry/registry.json');
  } catch (error) {
    logger.error(`Error saving registry file. Error - ${error}`);
  }
};
