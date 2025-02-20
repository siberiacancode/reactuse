import path from 'node:path';

import { updateRegistry } from '@/scripts/updateRegistry';
import { isRegistryFileExist } from '@/scripts/utils/checkRegistryFile';
import { fetchAndBuildRegistry } from '@/scripts/utils/fetchAndBuildRegistry';

export const ROOT_PATH = path.resolve(path.resolve(), '../');
export const DOCS_PUBLIC_PATH = path.join(ROOT_PATH, 'docs', 'public');
export const REGISTRY_PATH = path.join(DOCS_PUBLIC_PATH, 'registry.json');

export const initRegistry = async () => {
  if (!isRegistryFileExist(REGISTRY_PATH)) await fetchAndBuildRegistry();
  else await updateRegistry();
};

initRegistry();
