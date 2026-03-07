import fs from 'fs';
import path from 'path';
import { parse } from 'comment-parser';

type Prop = any;

const mdxContent = (componentName: string, props: Prop) => `---
title: ${componentName}
description: ${props?.description?.description ?? 'None'}
---

## Installation



\`\`\`bash
npx useverse@latest add ${componentName}
\`\`\`


`;

export const matchJsdoc = (file: string) => {
  const jsdocCommentRegex = /\/\*\*\s*\n([^\\*]|(\*(?!\/)))*\*\//;
  const match = file.match(jsdocCommentRegex);
  return match ? match[0].trim() : undefined;
};

export const parseHookJsdoc = (filePath: string) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const jsdocMatch = matchJsdoc(fileContent);

  if (!jsdocMatch) {
    return;
  }

  const jsdoc = parse(jsdocMatch)[0];

  if (!jsdoc) {
    return;
  }

  const description = jsdoc.tags.find(({ tag }) => tag === 'description');
  const examples = jsdoc.tags.filter(({ tag }) => tag === 'example');
  const usage = jsdoc.tags.find(({ tag }) => tag === 'usage');
  const deprecated = jsdoc.tags.find(({ tag }) => tag === 'deprecated');
  const category = jsdoc.tags.find(({ tag }) => tag === 'category');
  const warning = jsdoc.tags.find(({ tag }) => tag === 'warning');
  const browserapi = jsdoc.tags.find(({ tag }) => tag === 'browserapi');
  const apiParameters = jsdoc.tags.filter(
    ({ tag }) => tag === 'param' || tag === 'overload' || tag === 'returns'
  );

  return {
    description,
    examples,
    usage,
    apiParameters,
    deprecated,
    category,
    browserapi,
    warning
  };
};

// --- Генерация MDX ---
function generateMDX(componentName: string, props: Prop, outputDir: string) {
  const outputPath = path.join(outputDir, `${componentName.toLowerCase()}.mdx`);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, mdxContent(componentName, props), 'utf-8');
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

  if (
    componentName.startsWith('use') &&
    !componentName.endsWith('.test') &&
    !componentName.endsWith('.demo')
  ) {
    const props = parseHookJsdoc(filePath);

    if (props && props.description && props.examples.length) {
      generateMDX(componentName, props, outputDir);
    }
  }
});
