import { access, cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(docsRoot, '..', '..');

const docsDistPath = path.join(docsRoot, 'app', '.vitepress', 'dist');
const newDocsOutPath = path.join(repoRoot, 'packages', 'newdocs', 'out');
const newDocsOutWithBasePath = path.join(newDocsOutPath, 'new');
const sitePath = path.join(repoRoot, 'site');

const exists = async (targetPath) => {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
};

const copyDirectoryContents = async (sourceDir, targetDir) => {
  await mkdir(targetDir, { recursive: true });

  const entries = await readdir(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    const from = path.join(sourceDir, entry.name);
    const to = path.join(targetDir, entry.name);
    await cp(from, to, { recursive: true });
  }
};

await rm(sitePath, { recursive: true, force: true });
await copyDirectoryContents(docsDistPath, sitePath);

if (await exists(newDocsOutWithBasePath)) {
  await copyDirectoryContents(newDocsOutPath, sitePath);
} else {
  const siteNewPath = path.join(sitePath, 'new');
  await copyDirectoryContents(newDocsOutPath, siteNewPath);
}

await writeFile(path.join(sitePath, '.nojekyll'), '');
