import path from 'node:path';

import { updateRegistry } from '@/registry/updateRegistry';
import { fetchAndBuildRegistry } from '@/registry/utils/fetchAndBuildRegistry';
import { isRegistryFileExist } from '@/registry/utils/isRegistryFileExist';
import { logger } from '@/utils/logger';

export const ROOT_PATH = path.resolve(path.resolve(), '../');
export const DOCS_PUBLIC_PATH = path.join(ROOT_PATH, 'docs', 'app', 'public');
export const REGISTRY_PATH = path.join(DOCS_PUBLIC_PATH, 'registry.json');

export const initRegistry = async () => {
  if (!isRegistryFileExist(REGISTRY_PATH)) {
    logger.info('Registry is empty, starting to build...');

    await fetchAndBuildRegistry();
  } else {
    logger.info('Registry is detected, starting to update...');

    await updateRegistry();
  }
};

initRegistry();
