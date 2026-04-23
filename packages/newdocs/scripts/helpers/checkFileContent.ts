import fs from 'node:fs';
import path from 'node:path';

import type { FunctionType } from '../constants';

import { CORE_ROOT } from '../constants';

export const checkFileContent = async (
  type: FunctionType,
  name: string,
  content: 'demo' | 'test'
) => {
  const files = await fs.promises.readdir(path.join(CORE_ROOT, `${type}s`, name));
  return files.some((file) => file.includes(`${name}.${content}`));
};
