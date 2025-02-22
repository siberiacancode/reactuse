import path from 'node:path';
import fs from 'node:fs';

import { logger } from '@/utils/logger';
import { getHooks } from '@/registry/utils/getHooks';
import { HookRegistry } from '@/utils/types';
import { FETCH_REPO_URL_TS } from '@/utils/constants';
import { extractDependencies, extractUrls } from '@/registry/utils/extractDependencies';

export const ROOT_PATH = path.resolve(path.resolve(), '../');
export const DOCS_PUBLIC_PATH = path.join(ROOT_PATH, 'docs', 'app', 'public');
export const REGISTRY_PATH = path.join(DOCS_PUBLIC_PATH, 'registry.json');

export const init = async () => {
  logger.info('Building registry...');

  const hooks = await getHooks();

  const registry: HookRegistry[] = hooks.map((hook) => ({
    name: hook.name,
    hookDependency: [],
    utilsDependency: [],
    localDependency: [],
    urls: extractUrls(hook.name)
  }));

  for (const hook of registry) {
    const hookFileUrl = `${FETCH_REPO_URL_TS}/hooks/${hook.name}/${hook.name}.ts`;
    try {
      const hookContent = await fetch(hookFileUrl).then((response) => response.text());

      Object.assign(hook, extractDependencies(hookContent));
    } catch (error) {
      console.error(`Error processing hook: ${hook.name}`, error);
    }
  }

  try {
    fs.mkdirSync(path.dirname(REGISTRY_PATH), { recursive: true });

    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
    logger.info('Hooks registry saved.');
  } catch (error) {
    logger.error(`Error saving registry file. Error - ${error}`);
  }
};

init();
