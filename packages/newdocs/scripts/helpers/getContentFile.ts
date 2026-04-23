import fs from 'node:fs';
import path from 'node:path';

import type { FunctionType } from '../constants';

import { CORE_ROOT } from '../constants';

export const getContentFile = async (type: FunctionType, name: string) => {
  try {
    const basePath = path.join(CORE_ROOT, `${type}s`, name);

    const files = await fs.promises.readdir(basePath);

    const fileName = files.find(
      (file) => file.includes(name) && !file.includes('.test') && !file.includes('.demo')
    );

    if (!fileName) {
      throw new Error(`No matching file found for ${name}`);
    }

    const filePath = path.join(basePath, fileName);
    const content = await fs.promises.readFile(filePath, 'utf-8');

    return content;
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    throw error;
  }
};
