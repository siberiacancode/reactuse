import fs from 'node:fs/promises';
import path from 'node:path';

import { CONTENT_ROOT, PUBLIC_ROOT } from './constants';

export const init = async () => {
  console.log('[generate-static] Starting...');

  const files = await fs.readdir(CONTENT_ROOT, {
    recursive: true
  });

  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;

    const sourcePath = path.join(CONTENT_ROOT, file);
    const targetPath = path.join(PUBLIC_ROOT, file.replace(/\.mdx$/i, '.md'));

    const content = await fs.readFile(sourcePath, 'utf8');

    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, content, 'utf8');
  }

  console.log('[generate-static] Done\n');
};

init();
