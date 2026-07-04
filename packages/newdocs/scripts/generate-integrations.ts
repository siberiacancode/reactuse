import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { codeToHtml } from 'shiki';

import type { CodeLanguage, IntegrationMetadata } from '@/src/constants';

import { CONTENT_ROOT } from './constants';
import { extractDependencies } from './helpers';

const INTEGRATIONS_ROOT = path.join('src', 'integrations');

const createDemo = async (metadata: IntegrationMetadata) => {
  const demoPath = path.join(INTEGRATIONS_ROOT, metadata.name, 'demo.tsx');
  const demoContent = await fs.promises.readFile(demoPath, 'utf-8');

  return `'use client'\n\n${demoContent}`;
};

const createHtmlCode = async (code: string, language: CodeLanguage) =>
  await codeToHtml(code, {
    lang: language,
    themes: {
      dark: 'github-dark',
      light: 'github-light'
    },
    transformers: [
      {
        pre(node) {
          node.properties.class =
            'no-scrollbar min-w-0 overflow-x-auto overflow-y-auto overscroll-x-contain overscroll-y-auto px-4 py-3.5 outline-none has-[[data-highlighted-line]]:px-0 has-[[data-line-numbers]]:px-0 has-[[data-slot=tabs]]:p-0 !bg-transparent';
        },
        code(node) {
          node.properties['data-line-numbers'] = '';
        },
        line(node) {
          node.properties['data-line'] = '';
        }
      }
    ]
  });

const getIntegrations = async () => {
  const entries = await fs.promises.readdir(INTEGRATIONS_ROOT, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
};

const createMetaJson = (integrations: IntegrationMetadata[]) => {
  const result = `{
    "pages": [
      ${integrations.map((item) => `"${item.name}"`).join(',\n      ')}
    ]
  }`;

  return result;
};

const createMdxTemplate = (metadata: IntegrationMetadata) => {
  const result: string[] = [];

  result.push('---');
  result.push(`title: ${metadata.name}`);
  result.push(`type: ${metadata.type}`);
  if (metadata.description) result.push(`description: ${metadata.description}`);
  result.push(`lastModifiedTime: ${metadata.lastModified}`);
  result.push('---');

  result.push('');
  result.push(`import metadata from './${metadata.name}.meta.json';`);
  result.push('');

  result.push(
    `<FunctionBanner code={metadata.demo} type={metadata.type} name={metadata.name} language="tsx" />`
  );

  result.push('');
  result.push('## Installation');
  result.push('');
  result.push('```packages-install');
  result.push(`npm install ${metadata.dependency}`);
  result.push('```');

  return result.join('\n');
};

interface IntegrationMeta {
  dependency: string;
  description: string;
  name: string;
}

const loadMeta = async (name: string): Promise<IntegrationMeta> => {
  const metaPath = path.resolve(INTEGRATIONS_ROOT, name, 'meta.ts');
  const module = await import(pathToFileURL(metaPath).href);
  return module.default;
};

const init = async () => {
  console.log('\n[generate-integrations] Starting...');

  const names = await getIntegrations();

  const metadata = await Promise.all(
    names.map(async (name) => {
      const dir = path.join(INTEGRATIONS_ROOT, name);
      const demoPath = path.join(dir, 'demo.tsx');

      if (!fs.existsSync(demoPath)) {
        console.warn(`Skipped ${name}: no demo.tsx`);
        return null;
      }

      const meta = await loadMeta(name);
      const demoContent = await fs.promises.readFile(demoPath, 'utf-8');
      const dependencies = extractDependencies(demoContent);
      const lastModified = (await fs.promises.stat(demoPath)).mtime.getTime();

      return {
        name: meta.name ?? name,
        description: meta.description,
        dependency: meta.dependency,
        dependencies,
        lastModified,
        type: 'integration',
        demo: await createHtmlCode(demoContent, 'tsx')
      };
    })
  );

  const pages = metadata.filter(Boolean) as unknown as IntegrationMetadata[];

  console.log(`\x1B[32mInjected: ${pages.length}\x1B[0m`);
  console.log(`\x1B[33mSkipped: ${names.length - pages.length}\x1B[0m`);

  console.log('\n[generate-integrations] Writing files...');

  const outDir = path.join(CONTENT_ROOT, 'docs', 'integrations');
  await fs.promises.mkdir(outDir, { recursive: true });

  for (const page of pages) {
    const mdx = createMdxTemplate(page);
    await fs.promises.writeFile(path.join(outDir, `${page.name}.mdx`), mdx, 'utf-8');
    await fs.promises.writeFile(
      path.join(outDir, `${page.name}.meta.json`),
      JSON.stringify(page, null, 2),
      'utf-8'
    );

    const demo = await createDemo(page);
    await fs.promises.writeFile(
      path.join('generated', 'demos', `integrations`, `${page.name}.demo.tsx`),
      demo,
      'utf-8'
    );
  }

  const metaJson = createMetaJson(pages);
  await fs.promises.writeFile(path.join(outDir, 'meta.json'), metaJson, 'utf-8');

  console.log('[generate-integrations] Done\n');
};

init();
