import fs from 'fs';
import path from 'path';
import { parse } from 'comment-parser';

type HookProps = {
  name: string;
  description: string;
  examples: string[];
  usage: string;
  category: string;
  apiParameters: {
    name: string;
    type: string;
    optional: boolean;
    description: string;
    source: any[];
  }[];

  browserapi?: string;
  warning?: string;
  deprecated?: boolean;
};

const mdxContent = (componentName: string, props: HookProps) => `---
  title: ${componentName}
  description: ${props.description}
---

<div className="flex gap-3">
  <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
    ${props.category}
  </Badge>
  <Badge className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
    ${props.usage}
  </Badge>
  <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
    ${props.category}
  </Badge>
</div>


${
  props.warning
    ? `<Callout className='border-yellow-600 bg-yellow-100 dark:border-yellow-400 dark:bg-yellow-900'>
  **Important:** ${props.warning}
</Callout>`
    : ''
}

<Separator className="my-8"/>

## Installation

\`\`\`bash
npx useverse@latest add ${componentName}
\`\`\`

## Usage

${props.examples
  .map(
    (example) => ` 
  \`\`\`tsx 
    ${example} 
  \`\`\` 
  `
  )
  .join('')}

## Demo

<HookPreview name=${componentName} />

## Api

<table>
  <tr>
   <th>
    Test
  </th>
   <th>
    Test
  </th>
   <th>
    Test
  </th>
  </tr>
 
</table>
`;

const matchJsdoc = (file: string) => {
  const jsdocCommentRegex = /\/\*\*\s*\n([^\\*]|(\*(?!\/)))*\*\//;
  const match = file.match(jsdocCommentRegex);
  return match ? match[0].trim() : undefined;
};

export const parseHookJsdocFromFile = (file: string) => {
  const fileContent = fs.readFileSync(file, 'utf-8');
  const jsdoc = matchJsdoc(fileContent);

  if (!jsdoc) {
    return;
  }

  const _jsdoc = parse(jsdoc)[0];

  const description = _jsdoc.tags.find(({ tag }) => tag === 'description');
  const examples = _jsdoc.tags.filter(({ tag }) => tag === 'example');
  const usage = _jsdoc.tags.find(({ tag }) => tag === 'usage');
  const deprecated = _jsdoc.tags.find(({ tag }) => tag === 'deprecated');
  const category = _jsdoc.tags.find(({ tag }) => tag === 'category');
  const warning = _jsdoc.tags.find(({ tag }) => tag === 'warning');
  const browserapi = _jsdoc.tags.find(({ tag }) => tag === 'browserapi');
  const apiParameters = _jsdoc.tags.filter(
    ({ tag }) => tag === 'param' || tag === 'overload' || tag === 'returns'
  );

  return {
    description: description?.description,
    examples: examples.map((example) => example.description),
    usage: usage?.name,
    apiParameters,
    deprecated: deprecated?.name,
    category: category?.name,
    browserapi: browserapi?.name,
    warning: warning?.description
  };
};

const isHookPath = (name: string) =>
  name.startsWith('use') && !name.endsWith('.test.ts') && !name.endsWith('.demo.tsx');

// --- Генерация MDX ---
const generateMDX = (componentName: string, props: HookProps, outputDir: string) => {
  const outputPath = path.join(outputDir, `${componentName.toLowerCase()}.mdx`);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, mdxContent(componentName, props), 'utf-8');
};

const getComponentFiles = (dir: string): string[] => {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getComponentFiles(fullPath);
    }

    return isHookPath(entry.name) ? [fullPath] : [];
  });
};

const componentsDir = path.resolve(process.argv[2]);
const outputDir = process.argv[3] || path.resolve('content/docs/hooks');

if (!fs.existsSync(componentsDir)) {
  console.error(`Folder does not exist: ${componentsDir}`);
  process.exit(1);
}

const componentFiles = getComponentFiles(componentsDir);

componentFiles.forEach((filePath) => {
  const componentName = path.basename(filePath, path.extname(filePath));

  const props = parseHookJsdocFromFile(filePath);
  console.log('componentName', componentName);
  console.log('props', props);
  console.log('');

  if (props && props.description) {
    generateMDX(componentName, props, outputDir);
  }
});
