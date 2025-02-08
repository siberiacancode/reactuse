import fs from 'node:fs';

import { logger } from '@/utils/logger';

export const isRegistryFileExist = (registryPath: string) => {
  if (!fs.existsSync(registryPath)) {
    logger.info('Registry file does not exist, fetching new hooks...');
    return false;
  }

  const fileContent = fs.readFileSync(registryPath, 'utf-8');
  if (fileContent.trim() === '') {
    logger.info('Registry file is empty, fetching new hooks...');
    return false;
  }

  logger.info('Registry file is not empty, skipping hook fetch...');
  return true;
};
