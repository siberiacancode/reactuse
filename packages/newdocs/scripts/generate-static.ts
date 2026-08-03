import fs from 'node:fs';
import path from 'node:path';

import { CONTENT_ROOT, PUBLIC_ROOT } from './constants';

const init = () => {
  console.log('[generate-static] Starting...');

  const files = fs.readdirSync(CONTENT_ROOT, {
    recursive: true
  });

  for (const file of files) {
    if (typeof file !== 'string' || !file.endsWith('.mdx')) continue;

    // Function pages get a resolved markdown export from generate-functions.
    // Copying the MDX shell would replace AI-ready content with internals.
    const normalized = file.replaceAll('\\', '/');
    if (normalized.startsWith('functions/')) continue;

    const sourcePath = path.join(CONTENT_ROOT, file);
    const targetPath = path.join(PUBLIC_ROOT, file.replace(/\.mdx$/i, '.md'));

    const content = fs.readFileSync(sourcePath, 'utf8');

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, content, 'utf8');
  }

  console.log('[generate-static] Done\n');
};

init();
