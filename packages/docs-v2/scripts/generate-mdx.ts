import fs from 'fs';
import path from 'path';
import { HookProps, isHookPath, parseHookJsdocFromFile } from '@/lib/parse-hook';
import { mdxContent } from '@/lib/mdx-content';

const getComponentFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getComponentFiles(fullPath);
    }

    return isHookPath(entry.name) ? [fullPath] : [];
  });

const createMDXFile = (componentName: string, props: HookProps, outputDir: string) => {
  const outputPath = path.join(outputDir, `${componentName.toLowerCase()}.mdx`);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, mdxContent(componentName, props), 'utf-8');
};

const startScript = async () => {
  const componentsDir = path.resolve(process.argv[2]);
  const outputDir = process.argv[3] || path.resolve('content/docs/hooks');

  if (!fs.existsSync(componentsDir)) {
    console.error(`Folder does not exist: ${componentsDir}`);
    process.exit(1);
  }

  const componentFiles = getComponentFiles(componentsDir);

  for (const filePath of componentFiles) {
    const componentName = path.basename(filePath, path.extname(filePath));
    const props = await parseHookJsdocFromFile(filePath);

    if (props && props.description) {
      await createMDXFile(componentName, props, outputDir);
    }
  }
};

startScript();
