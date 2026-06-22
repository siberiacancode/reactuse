import fs from 'node:fs';
import path from 'node:path';

import type { FunctionType } from '../constants';

import { CORE_ROOT } from '../constants';

export const getExtensionFile = async (type: FunctionType, name: string) => {
  const basePath = path.join(CORE_ROOT, `${type}s`, name);
  const files = await fs.promises.readdir(basePath);

  const fileName = files.find(
    (file) => file.includes(name) && !file.includes('.test') && !file.includes('.demo')
  );

  if (!fileName) {
    throw new Error(`No matching file found for ${name}`);
  }

  return path.extname(fileName).slice(1);
};
