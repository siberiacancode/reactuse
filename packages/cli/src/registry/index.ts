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

  const hooks = await fetch(
    'https://api.github.com/repos/siberiacancode/reactuse/contents/packages/core/src/hooks'
  )
    .then((response) => response.json())
    .then((data) => (data as { name: string }[]).filter((hook) => hook.name.startsWith('use')));

  const registry: HookRegistry[] = hooks.map((hook) => ({
    name: hook.name,
    hookDependency: [],
    utilsDependency: [],
    localDependency: []
  }));

  console.log(chalk.cyan(`\nAdd to registry ${hooks.length} hooks`));
  const spinner = ora('Processing hooks...').start();

  await Promise.all(
    registry.map(async (hook) => {
      const hookFileUrl = `${REPO_URLS.TS}/hooks/${hook.name}/${hook.name}.ts`;

      const hookContent = await fetch(hookFileUrl).then((response) => response.text());
      Object.assign(hook, extractDependencies(hookContent));
    })
  );

  fs.mkdirSync(path.dirname(REGISTRY_PATH), { recursive: true });
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));

  spinner.stop();
  console.log(chalk.green('Hooks registry saved'));
};

registry();
