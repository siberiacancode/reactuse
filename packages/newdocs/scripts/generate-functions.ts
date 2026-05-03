import { parse } from 'comment-parser';
import fs from 'node:fs';
import path from 'node:path';
import { codeToHtml } from 'shiki';
import ts from 'typescript';

import type { CodeLanguage, FunctionMetadata } from '@/src/constants';

import { CONTENT_ROOT, CORE_ROOT } from './constants';
import {
  checkFileContent,
  extractDependencies,
  extractTypeInfo,
  getContentFile,
  getElements,
  getGitInfo,
  matchJsdoc
} from './helpers';

const SITE_URL = 'https://reactuse.org';
const SKILLS_URL = 'https://skills.sh/siberiacancode/agent-skills/reactuse';
const ROOT_DOCS_META_PATH = path.join(CONTENT_ROOT, 'docs', '(root)', 'meta.json');

const createDemo = async (metadata: FunctionMetadata) => {
  const demoPath = path.join(
    CORE_ROOT,
    `${metadata.type}s`,
    metadata.name,
    `${metadata.name}.demo.tsx`
  );
  const demoContent = await fs.promises.readFile(demoPath, 'utf-8');

  return `'use client'\n\n${demoContent}`;
};

const createMetaJson = (metadata: FunctionMetadata[]) => {
  const categories = metadata.reduce(
    (acc, item) => {
      const category = item.category.toLowerCase();
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, FunctionMetadata[]>
  );

  const pages = Object.entries(categories)
    .map(
      ([category, items]) => `
      "---${category}---",
      ${items.map((item) => `"${item.name}"`).join(',')}`
    )
    .join(',\n');

  const result = `{
    "pages": [
      ${pages}
    ]
  }`;

  return result;
};

const createMdxTemplate = (metadata: FunctionMetadata) => {
  const result: string[] = [];

  result.push('---');
  result.push(`title: ${metadata.name}`);
  if (metadata.description) result.push(`description: ${metadata.description}`);
  result.push(`category: ${metadata.category.toLowerCase()}`);
  result.push(`usage: ${metadata.usage.toLowerCase()}`);
  result.push(`type: ${metadata.type}`);
  result.push(`isTest: ${metadata.isTest}`);
  result.push(`isDemo: ${!!metadata.demo}`);
  result.push(`lastModifiedTime: ${metadata.lastModified}`);
  result.push('---');

  result.push('');
  result.push(`import metadata from './${metadata.name}.meta.json';`);
  result.push('');

  result.push(
    `<FunctionBanner browserapi={metadata.browserapi} code={metadata.demo} type={metadata.type} name={metadata.name} language="tsx" />`
  );

  result.push('');
  result.push(`## Installation`);
  result.push('');

  result.push(`<FunctionTabs>`);
  result.push(`  <TabsList>`);
  result.push(`    <TabsTrigger value='library'>Library</TabsTrigger>`);
  result.push(`    <TabsTrigger value='cli'>CLI</TabsTrigger>`);
  result.push(`    <TabsTrigger value='manual'>Manual</TabsTrigger>`);
  result.push(`  </TabsList>`);
  result.push(`  <TabsContent value='library'>`);
  result.push(`    \`\`\`packages-install`);
  result.push(`    npm install @siberiacancode/reactuse`);
  result.push(`    \`\`\``);
  result.push(`  </TabsContent>`);
  result.push(`  <TabsContent value='cli'>`);
  result.push(`    \`\`\`packages-install`);
  result.push(`    npx useverse@latest add ${metadata.name}`);
  result.push(`    \`\`\``);
  result.push(`  </TabsContent>`);
  result.push(`  <TabsContent value='manual'>`);
  result.push(`    <Steps>`);
  result.push(`     <Step>`);
  result.push(`      Copy and paste the following code into your project.`);
  result.push(`    </Step>`);
  result.push(`      <FunctionCode code={metadata.code} language="tsx" />`);
  result.push(`    <Step>`);
  result.push(`      Update the import paths to match your project setup.`);
  result.push(`    </Step>`);
  result.push(`  </Steps>`);
  result.push(`  </TabsContent>`);
  result.push(`</FunctionTabs>`);

  result.push('');
  result.push('## Usage');
  result.push('');

  result.push(`\`\`\`tsx`);
  metadata.examples.forEach((example, index) => {
    result.push(example);
    if (index !== metadata.examples.length - 1) result.push('// or');
  });
  result.push(`\`\`\``);

  result.push('');
  result.push('## Type Declarations');
  result.push('');

  result.push(`<FunctionCode code={metadata.typeDeclarations} language="tsx" />`);
  result.push(`<FunctionApi apiParameters={metadata.apiParameters} />`);

  result.push('');
  result.push('## Contributors');
  result.push('');
  result.push(`<FunctionContributors contributors={metadata.contributors} />`);

  return result.join('\n');
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

const createLlmsTxt = (pages: FunctionMetadata[]) => {
  const docsLinks = [
    ['Introduction', `${SITE_URL}/docs/introduction`, 'Core project overview and philosophy.'],
    ['Installation', `${SITE_URL}/docs/installation`, 'Install Reactuse into your project.'],
    ['CLI', `${SITE_URL}/docs/cli`, 'Useverse CLI for adding hooks into your codebase.'],
    ['Functions', `${SITE_URL}/functions`, 'Browse all hooks and helpers with API docs.'],
    ['Skills', `${SITE_URL}/docs/skills`, 'AI assistant skill guide for Reactuse.'],
    ['Reactuse Skill Registry', SKILLS_URL, 'Published Reactuse skill for coding agents.']
  ] as const;

  const grouped = pages.reduce(
    (acc, page) => {
      const key = `${page.type}:${page.category.toLowerCase()}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(page);
      return acc;
    },
    {} as Record<string, FunctionMetadata[]>
  );

  const sections = Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, items]) => {
      const [, category] = key.split(':');
      const title = `${category.charAt(0).toUpperCase() + category.slice(1)}s`;
      const lines = items
        .sort((left, right) => left.name.localeCompare(right.name))
        .map(
          (item) =>
            `- [${item.name}](${SITE_URL}/functions/${item.type}s/${item.name}): ${item.description}`
        );

      return [`### ${title}`, '', ...lines].join('\n');
    });

  const result = [];

  result.push('# reactuse');
  result.push('');
  result.push(
    '> reactuse is a collection of production-ready React hooks and helpers. It is TypeScript-first, SSR compatible, tree-shakable, and designed for modern React applications.'
  );
  result.push('');
  result.push('## Overview');
  result.push('');
  result.push(
    ...docsLinks.map(([name, url, description]) => `- [${name}](${url}): ${description}`)
  );
  result.push('');
  result.push('## Functions');
  result.push('');
  result.push(...sections);
  result.push('');

  return result.join('\n');
};

const createFunctionsMd = (pages: FunctionMetadata[]) => {
  const items = pages
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .map((item) => `- [${item.name}](/functions/${item.type}s/${item.name}): ${item.description}`);

  const result = [];
  result.push('---');
  result.push('title: Functions');
  result.push('description: A simple catalog of package functions.');
  result.push('---');
  result.push('');
  result.push('## List');
  result.push('');
  result.push('A quick list of available functions.');
  result.push('');
  result.push(...items);
  return result.join('\n');
};

const placeFunctionsOnSecondPosition = async () => {
  const content = await fs.promises.readFile(ROOT_DOCS_META_PATH, 'utf-8');
  const meta = JSON.parse(content) as { title?: string; pages?: string[] };

  const currentPages = meta.pages ?? [];
  const pagesWithoutFunctions = currentPages.filter((page) => page !== 'functions');
  pagesWithoutFunctions.splice(1, 0, 'functions');
  meta.pages = pagesWithoutFunctions;

  await fs.promises.writeFile(ROOT_DOCS_META_PATH, `${JSON.stringify(meta, null, 2)}\n`, 'utf-8');
};

const init = async () => {
  console.log('\n[generate-functions] Starting...');

  const [hooks, helpers] = await Promise.all([getElements('hook'), getElements('helper')]);
  const content = [...hooks, ...helpers];

  const metadata = await Promise.all(
    content.slice(0, 15).map(async (element) => {
      const content = await getContentFile(element.type, element.name);

      const jsdocMatch = matchJsdoc(content);

      if (!jsdocMatch) {
        console.error(`No jsdoc comment found for ${element.name}`);
        return null;
      }

      const commment = parse(jsdocMatch)[0];

      const jsdoc = {
        description: commment.tags.find(({ tag }) => tag === 'description'),
        examples: commment.tags.filter(({ tag }) => tag === 'example'),
        usage: commment.tags.find(({ tag }) => tag === 'usage'),
        deprecated: commment.tags.find(({ tag }) => tag === 'deprecated'),
        category: commment.tags.find(({ tag }) => tag === 'category'),
        warning: commment.tags.find(({ tag }) => tag === 'warning'),
        browserapi: commment.tags.find(({ tag }) => tag === 'browserapi'),
        apiParameters: commment.tags.filter(
          ({ tag }) => tag === 'param' || tag === 'overload' || tag === 'returns'
        )
      };

      if (!jsdoc.description || !jsdoc.examples.length) {
        console.error(`No content found for ${element.name}`);
        return null;
      }

      const isTest = await checkFileContent(element.type, element.name, 'test');
      const isDemo = await checkFileContent(element.type, element.name, 'demo');

      const { contributors, lastCommit } = await getGitInfo(element.name, element.type);

      const sourceFile = ts.createSourceFile('temp.ts', content, ts.ScriptTarget.Latest, true);
      const typeDeclarations = await createHtmlCode(extractTypeInfo(sourceFile), 'tsx');

      const dependencies = extractDependencies(content);

      return {
        code: await createHtmlCode(content, 'tsx'),
        id: element.name,
        isTest,
        isDemo,
        type: element.type,
        name: element.name,
        usage: jsdoc.usage!.name ?? 'low',
        ...(jsdoc.warning && {
          warning: jsdoc.warning.description
        }),
        browserapi: jsdoc.browserapi,
        description: jsdoc.description.description,
        category: jsdoc.category!.name,
        lastModified: new Date(lastCommit?.date ?? new Date()).getTime(),
        examples: jsdoc.examples.map((example) => example.description),
        apiParameters: jsdoc.apiParameters ?? [],
        typeDeclarations,
        dependencies,
        contributors,
        ...(isDemo && {
          demo: await createHtmlCode(
            await fs.promises.readFile(
              path.join(CORE_ROOT, `${element.type}s`, element.name, `${element.name}.demo.tsx`),
              'utf-8'
            ),
            'tsx'
          )
        })
      };
    })
  );

  const pages = metadata.filter(Boolean) as unknown as FunctionMetadata[];
  const testCoverage = pages.reduce((acc, page) => acc + Number(page.isTest), 0);

  console.log('\nElements injection report\n');
  console.log(`\x1B[32mInjected: ${pages.length}\x1B[0m`);
  console.log(
    `\x1B[35mTest coverage: ${Math.round(
      (testCoverage / pages.length) * 100
    )}% (${testCoverage})\x1B[0m`
  );
  const untested = pages.filter((page) => !page.isTest);
  if (untested.length)
    console.log(
      `\x1B[35mUntested: ${untested
        .map((page) => page.name)
        .sort()
        .join(', ')}\x1B[0m`
    );

  console.log(`\x1B[33mSkipped: ${content.length - pages.length}\x1B[0m`);
  console.log(`\nTotal: ${content.length} functions`);

  console.log('\n[generate-functions] Writing files...');
  for (const page of pages) {
    const mdx = createMdxTemplate(page);
    await fs.promises.writeFile(
      path.join(CONTENT_ROOT, 'functions', `${page.type}s`, `${page.name}.mdx`),
      mdx,
      'utf-8'
    );

    await fs.promises.writeFile(
      path.join(CONTENT_ROOT, 'functions', `${page.type}s`, `${page.name}.meta.json`),
      JSON.stringify(page, null, 2),
      'utf-8'
    );

    const demo = await createDemo(page);
    await fs.promises.writeFile(
      path.join('generated', 'demos', `${page.type}s`, `${page.name}.demo.tsx`),
      demo,
      'utf-8'
    );
  }

  for (const type of ['hook', 'helper'] as const) {
    const metaJson = createMetaJson(pages.filter((page) => page.type === type));
    await fs.promises.writeFile(
      path.join(CONTENT_ROOT, 'functions', `${type}s`, `meta.json`),
      metaJson,
      'utf-8'
    );
  }

  const functionsMd = createFunctionsMd(pages);
  await fs.promises.writeFile(
    path.join(CONTENT_ROOT, 'docs', '(root)', 'functions.mdx'),
    functionsMd,
    'utf-8'
  );
  await placeFunctionsOnSecondPosition();

  const llmsTxt = createLlmsTxt(pages);
  await fs.promises.writeFile(path.join('public', 'llms.txt'), llmsTxt, 'utf-8');

  console.log('[generate-functions] Done\n');
};

init();
