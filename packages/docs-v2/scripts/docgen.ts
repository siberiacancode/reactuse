import fs from 'fs';
import path, { resolve } from 'path';
import { HookProps, isHookPath, parseHookJsdocFromFile } from '@/lib/parse-hook';
import { mdxContent } from '@/lib/mdx-content';

const REPOSITORY_ROOT = resolve(__dirname, '..', '..');

const CORE_ROOT = resolve(REPOSITORY_ROOT, 'core');
const SOURCE_DIR = resolve(CORE_ROOT, 'src/hooks');

const DOC_ROOT = resolve(REPOSITORY_ROOT, 'docs-v2');
const OUTPUT_DIR = resolve(DOC_ROOT, 'content/docs/hooks');

const getComponentFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getComponentFiles(fullPath);
    }

    return isHookPath(entry.name) ? [fullPath] : [];
  });

const createMDXFile = (componentName: string, props: HookProps) => {
  const outputPath = path.join(OUTPUT_DIR, `${componentName.toLowerCase()}.mdx`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(outputPath, mdxContent(componentName, props), 'utf-8');
};

const startScript = async () => {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Folder does not exist: ${SOURCE_DIR}`);
    process.exit(1);
  }

  const componentFiles = getComponentFiles(SOURCE_DIR);

  for (const filePath of componentFiles) {
    const componentName = path.basename(filePath, path.extname(filePath));
    const props = await parseHookJsdocFromFile(filePath);

    if (props && props.description) {
      createMDXFile(componentName, props);
    }
  }
};

startScript();
