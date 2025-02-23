import fetches from '@siberiacancode/fetches';
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import ora from 'ora';

import type { HookRegistry } from '@/utils/types';

import { extractDependencies } from '@/registry/utils';
import { REPO_URLS } from '@/utils/constants';

export const ROOT_PATH = path.resolve(path.resolve(), '../');
export const DOCS_PUBLIC_PATH = path.join(ROOT_PATH, 'docs', 'app', 'public');
export const REGISTRY_PATH = path.join(DOCS_PUBLIC_PATH, 'registry.json');

export const registry = async () => {
  console.log('📦 Building registry');

  console.log('@', fetches);
  const hooksResponse = await fetches.get<{ name: string }[]>(
    'https://api.github.com/repos/siberiacancode/reactuse/contents/packages/core/src/hooks'
  );
  const hooks = hooksResponse.data.filter((hook) => hook.name.startsWith('use'));

  const registry = hooks.map((hook) => ({
    name: hook.name,
    hooks: [],
    utils: [],
    local: [],
    packages: []
  }));

  console.log(chalk.cyan(`\nAdd to registry ${hooks.length} hooks`));
  const spinner = ora('Processing hooks...').start();

  await Promise.all(
    registry.map(async (hook) => {
      const hookContentResponse = await fetches.get<string>(
        `${REPO_URLS.TS}/hooks/${hook.name}/${hook.name}.ts`
      );
      Object.assign(hook, extractDependencies(hookContentResponse.data));
    })
  );

  const result = registry.reduce(
    (acc, hook) => {
      acc[hook.name] = hook;
      return acc;
    },
    {} as Record<string, HookRegistry>
  );

  fs.mkdirSync(path.dirname(REGISTRY_PATH), { recursive: true });
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(result, null, 2));

  spinner.stop();
  console.log(chalk.green('Hooks registry saved'));
};

registry();
