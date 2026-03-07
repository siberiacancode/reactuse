import fs from 'fs';
import path from 'path';
import { parse } from 'comment-parser';

interface Prop {
  name: string;
  type: string;
  description: string;
}

function parseJSDoc(filePath: string): Prop[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const blocks = parse(content);
  const props: Prop[] = [];

  blocks.forEach((block) => {
    block.tags.forEach((tag) => {
      if (tag.tag === 'param') {
        props.push({
          name: tag.name,
          type: tag.type || 'unknown',
          description: tag.description || ''
        });
      }
    });
  });

  return props;
}

function escapeMDX(str: string) {
  if (!str) return '';
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// --- Генерация MDX ---
function generateMDX(componentName: string, props: Prop[], outputDir: string) {
  const tableRows = props
    .map((p) => `| ${p.name} | ${escapeMDX(p.type)} | - | ${escapeMDX(p.description)} |`)
    .join('\n');

  console.log('tableRows', tableRows);

  const mdxContent = `---
title: ${componentName}
description: Auto-generated documentation
---
`;

  const outputPath = path.join(outputDir, `${componentName.toLowerCase()}.mdx`);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, mdxContent, 'utf-8');
  console.log(`MDX generated: ${outputPath}`);
}

// --- Рекурсивный обход папки для поиска компонентов ---
function getComponentFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getComponentFiles(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      files.push(fullPath);
    }
  }

  return files;
}

const componentsDir = path.resolve(process.argv[2]);
const outputDir = process.argv[3] || path.resolve('content/docs/hooks');

if (!fs.existsSync(componentsDir)) {
  console.error(`Folder does not exist: ${componentsDir}`);
  process.exit(1);
}

const componentFiles = getComponentFiles(componentsDir);

componentFiles.forEach((filePath) => {
  const componentName = path.basename(filePath, path.extname(filePath));
  const props = parseJSDoc(filePath);

  if (
    componentName.startsWith('use') &&
    !componentName.endsWith('.test') &&
    !componentName.endsWith('.demo')
  ) {
    generateMDX(componentName, props, outputDir);
  }
});
