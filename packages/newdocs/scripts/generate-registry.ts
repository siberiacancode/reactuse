import fs from 'node:fs';
import path from 'node:path';
import ora from 'ora';

import { extractDependencies } from './helpers';

export interface HookRegistry {
  hooks: string[];
  name: string;
  packages: string[];
  path: string;
  type: 'helper' | 'hook';
  utils: string[];
}

export const ROOT_PATH = path.resolve(path.resolve(), '../');
export const DOCS_PUBLIC_PATH = path.join(ROOT_PATH, 'newdocs', 'public');
export const REGISTRY_PATH = path.join(DOCS_PUBLIC_PATH, 'registry.json');

const CORE_PATHS = {
  hook: path.join(ROOT_PATH, 'core', 'src', 'hooks'),
  helper: path.join(ROOT_PATH, 'core', 'src', 'helpers')
};

const getFileName = (basePath: string, name: string) => {
  if (fs.existsSync(path.join(basePath, name, `${name}.tsx`))) return `${name}.tsx`;
  return `${name}.ts`;
};

export const init = async () => {
  console.log('[generate-registry] Starting...');

  const hooks = fs
    .readdirSync(CORE_PATHS.hook)
    .filter(
      (directory) =>
        directory.startsWith('use') &&
        fs.statSync(path.join(CORE_PATHS.hook, directory)).isDirectory()
    );

  const helpers = fs
    .readdirSync(CORE_PATHS.helper)
    .filter((directory) => fs.statSync(path.join(CORE_PATHS.helper, directory)).isDirectory());

  const items = [...hooks, ...helpers];

  const registry = items.map((itemName) => {
    const type = itemName.startsWith('use') ? 'hook' : 'helper';
    const fileName = getFileName(CORE_PATHS[type], itemName);

    return {
      type,
      name: itemName,
      path: `${type}s/${itemName}/${fileName}`,
      hooks: [],
      utils: [],
      packages: []
    };
  }) as HookRegistry[];

  console.log(`[generate-registry] Add to registry ${items.length} items`);
  const spinner = ora('Processing items...').start();

  for (const item of registry) {
    const itemFilePath = path.join(CORE_PATHS[item.type], item.name, path.basename(item.path));
    if (fs.existsSync(itemFilePath)) {
      const itemContent = fs.readFileSync(itemFilePath, 'utf-8');
      Object.assign(item, extractDependencies(itemContent));
    }
  }

  const result = registry.reduce(
    (acc, item) => {
      acc[item.name] = item;
      return acc;
    },
    {} as Record<string, HookRegistry>
  );

  fs.mkdirSync(path.dirname(REGISTRY_PATH), { recursive: true });
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(result, null, 2));

  spinner.stop();
  console.log('[generate-registry] Items registry saved');
};

init();
