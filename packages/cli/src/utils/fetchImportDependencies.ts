// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-member-access,no-await-in-loop */
import { appendFileSync, existsSync, promises as fs, writeFileSync } from 'fs';
import path from 'node:path';

import { logger } from '@/utils/logger';

const updateUtilIndexFile = (utilName: string, utilsDir: string) => {
  const indexPath = path.join(utilsDir, 'index.ts');
  const indexExist = existsSync(indexPath);
  const exportStatement = `export * from './${utilName}';\n`;

  if (!indexExist) {
    writeFileSync(indexPath, '');
    appendFileSync(indexPath, exportStatement, 'utf-8');
  }
};

const downloadUtil = async (utilName: string, path: string) => {
  const utilUrl = `https://raw.githubusercontent.com/siberiacancode/reactuse/main/src/utils/helpers/${utilName}.ts`;
  const utilPath = `${path}/${utilName}.ts`;

  try {
    const response = await fetch(utilUrl);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`\n The ${utilName} util does not exist.`);
      } else {
        throw new Error(`\n An error occurred adding ${utilUrl}. Try again.`);
      }
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.writeFile(utilPath, buffer);

    return utilPath;
  } catch (error) {
    logger.error(`\n Error downloading ${utilName} util. Try again.`);
    process.exit(1);
  }
};

export const fetchImportDependencies = async (imports: string[], pathToLoadUtils: string) => {
  if (!imports.length) return;

  if (!existsSync(pathToLoadUtils)) {
    await fs.mkdir(pathToLoadUtils, { recursive: true });
  }

  for (const importName of imports) {
    await downloadUtil(importName, pathToLoadUtils);
    updateUtilIndexFile(importName, pathToLoadUtils);
  }

  return 1;
};
