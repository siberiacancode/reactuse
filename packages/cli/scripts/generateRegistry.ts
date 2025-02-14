import fs from 'node:fs';
import path from 'node:path';
import { isRegistryFileExist } from 'scripts/utils/checkRegistryFile';
import { fetchAndBuildRegistry } from 'scripts/utils/fetchAndBuildRegistry';

export const ROOT_PATH = path.resolve(path.resolve(), '../../');
export const REGISTRY_PATH = path.join(path.resolve(), 'registry', 'registry.json');
export const DOCS_PUBLIC_PATH = path.join(ROOT_PATH, 'docs', 'public');
export const REGISTRY_PUBLIC_PATH = path.join(DOCS_PUBLIC_PATH, 'registry.json');

export const initRegistry = async () => {
  const registryPath = path.join(path.resolve(), 'registry', 'registry.json');

  if (!isRegistryFileExist(registryPath)) await fetchAndBuildRegistry();

  fs.copyFileSync(REGISTRY_PATH, REGISTRY_PUBLIC_PATH);
  console.log(`✅ Copied registry to ${REGISTRY_PUBLIC_PATH}`);
};

initRegistry();
