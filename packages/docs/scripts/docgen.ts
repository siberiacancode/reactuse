import fs from 'fs';
import path, { resolve } from 'path';
import { HookProps, isHookPath, parseHookJsdocFromFile } from '@docs/lib/parse-hook';
import { siteConfig } from '@docs/lib/config';

const REPOSITORY_ROOT = resolve(__dirname, '..', '..');

const CORE_ROOT = resolve(REPOSITORY_ROOT, 'core');
const SOURCE_DIR = resolve(CORE_ROOT, 'src/hooks');

const DOC_ROOT = resolve(REPOSITORY_ROOT, 'docs-v2');
const OUTPUT_DIR = resolve(DOC_ROOT, 'content/docs/hooks');

const getMDXTemplate = (name: string, props: HookProps) => `---
title: ${JSON.stringify(name)}
description: ${JSON.stringify(props.description ?? '')}
---
import { DocHeader, DocContributors, DocTableApi, DocUsageExamples } from '@docs/components/hook-doc-page';
import { DocDemo } from '@docs/components/hook-demo';
import hookDoc from './${name.toLowerCase()}.props.json';

<DocHeader {...hookDoc} />

<Separator className="my-8" />

## Installation

\`\`\`bash
npx useverse@latest add ${name}
\`\`\`

<Separator className="my-8" />

## Usage

<DocUsageExamples {...hookDoc} />

<Separator className="my-8" />

## Usage

<DocDemo {...hookDoc} />

<Separator className="my-8" />

## Api

<DocTableApi {...hookDoc} />

<Separator className="my-8" />

## Source

[Source](${siteConfig.source(name)})
[Demo](${siteConfig.source(name, 'demo.tsx')})

<Separator className="my-8" />

## Contributors
<DocContributors {...hookDoc} />
`;

const getComponentFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getComponentFiles(fullPath);
    }

    return isHookPath(entry.name) ? [fullPath] : [];
  });

const createMDXFile = (componentName: string, props: HookProps) => {
  const base = componentName.toLowerCase();
  const jsonPath = path.join(OUTPUT_DIR, `${base}.props.json`);
  const mdxPath = path.join(OUTPUT_DIR, `${base}.mdx`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(jsonPath, `${JSON.stringify(props, null, 2)}\n`, 'utf-8');

  fs.writeFileSync(mdxPath, getMDXTemplate(componentName, props), 'utf-8');
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
