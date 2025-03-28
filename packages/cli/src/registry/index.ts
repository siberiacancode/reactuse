import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import ora from 'ora';

import type { HookRegistry } from '@/utils/types';

import { extractDependencies } from '@/registry/utils';

export const ROOT_PATH = path.resolve(path.resolve(), '../');
export const DOCS_PUBLIC_PATH = path.join(ROOT_PATH, 'docs', 'app', 'public');
export const REGISTRY_PATH = path.join(DOCS_PUBLIC_PATH, 'registry.json');
export const CORE_HOOKS_PATH = path.join(ROOT_PATH, 'core', 'src', 'hooks');

export const registry = async () => {
  console.log('📦 Building registry');

  const hooks = fs.readdirSync(CORE_HOOKS_PATH)
    .filter(dir => dir.startsWith('use') && fs.statSync(path.join(CORE_HOOKS_PATH, dir)).isDirectory());

  const registry = hooks.map((hookName) => ({
    name: hookName,
    hooks: [],
    utils: [],
    packages: []
  }));

  console.log(chalk.cyan(`\nAdd to registry ${hooks.length} hooks`));
  const spinner = ora('Processing hooks...').start();

  for (const hook of registry) {
    const hookFilePath = path.join(CORE_HOOKS_PATH, hook.name, `${hook.name}.ts`);
    if (fs.existsSync(hookFilePath)) {
      const hookContent = fs.readFileSync(hookFilePath, 'utf-8');
      Object.assign(hook, extractDependencies(hookContent));
    }
  }

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
