import fs from 'node:fs';
import path from 'node:path';

import type { FunctionType } from '../constants';

import { CORE_ROOT } from '../constants';

export const getElements = async (type: FunctionType) => {
  const sourceDir = path.join(CORE_ROOT, `${type}s`);
  const files = await fs.promises.readdir(sourceDir, { withFileTypes: true });

  return files
    .filter((file) => file.isDirectory())
    .map((file) => ({
      type,
      name: file.name
    }));
};
