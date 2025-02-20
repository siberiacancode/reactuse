import fs from 'node:fs';

import { logger } from '@/utils/logger';

export const isRegistryFileExist = (registryPath: string) => {
  if (!fs.existsSync(registryPath)) {
    logger.info('Registry is empty, starting to build...');
    return false;
  }

  const fileContent = fs.readFileSync(registryPath, 'utf-8');
  if (fileContent.trim() === '') {
    logger.info('Registry file is empty, fetching new hooks...');
    return false;
  }
  logger.info('Registry is detected, starting to update...');

  return true;
};
