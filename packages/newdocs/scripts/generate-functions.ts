import { parse } from 'comment-parser';
import fs from 'node:fs';
import path from 'node:path';
import { codeToHtml } from 'shiki';
import ts from 'typescript';

import type { CodeLanguage, FunctionMetadata } from '@/src/constants';

import { CONTENT_ROOT, CORE_ROOT, PUBLIC_ROOT } from './constants';
import {
  checkFileContent,
  extractDependencies,
  extractTypeInfo,
  getContentFile,
  getElements,
  getExtensionFile,
  getGitInfo,
  matchJsdoc
} from './helpers';

const SITE_URL = 'https://reactuse.org';
const SKILLS_URL = 'https://skills.sh/siberiacancode/agent-skills/reactuse';

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

  if (metadata.warning) {
    result.push('');
    result.push(`<Callout title='Warning' variant='warning' className='my-5'>`);
    result.push(`  {metadata.warning}`);
    result.push(`</Callout>`);
  }

  result.push(
    `<FunctionBanner browserapi={metadata.browserapi} code={metadata.demo} type={metadata.type} name={metadata.name} language="tsx" />`
  );

  result.push('');
  result.push(`## Installation`);
  result.push('');

  result.push(`<FunctionTabs className='space-y-2'>`);
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

  if (metadata.typeDeclarations) {
    result.push('');
    result.push('## Type Declarations');
    result.push('');
    result.push(`<FunctionCode code={metadata.typeDeclarations} language="tsx" />`);
  }

  if (metadata.apiParameters.length) {
    result.push('');
    result.push('## API');
    result.push('');
    result.push(`<FunctionApi apiParameters={metadata.apiParameters} />`);
  }

  result.push('');
  result.push('## Contributors');
  result.push('');
  result.push(`<FunctionContributors contributors={metadata.contributors} />`);

  return result.join('\n');
};

interface ShareMarkdownPage {
  apiParameters: FunctionMetadata['apiParameters'];
  browserapi?: {
    description?: string;
    name?: string;
  };
  category: string;
  contributors: FunctionMetadata['contributors'];
  demo?: string;
  description: string;
  examples: string[];
  isTest: boolean;
  name: string;
  source: string;
  type: FunctionMetadata['type'];
  typeDeclarations?: string;
  usage: string;
  warning?: string;
}

const createCodeFence = (language: string, code: string) =>
  `\`\`\`${language}\n${code.trimEnd()}\n\`\`\``;

// Mirrors the interactive function page section order (like shadcn share md):
// banner/demo → Installation (library / cli / manual+source) → Usage → Type Declarations → API → Contributors
const createShareMarkdown = (page: ShareMarkdownPage) => {
  const lines: string[] = [];

  lines.push('---');
  lines.push(`title: ${page.name}`);
  if (page.description) lines.push(`description: ${page.description}`);
  lines.push(`category: ${page.category.toLowerCase()}`);
  lines.push(`usage: ${page.usage.toLowerCase()}`);
  lines.push(`type: ${page.type}`);
  lines.push(`isTest: ${page.isTest}`);
  if (page.browserapi?.name) {
    lines.push(
      page.browserapi.description
        ? `browserapi: ${page.browserapi.name} ${page.browserapi.description}`
        : `browserapi: ${page.browserapi.name}`
    );
  }
  lines.push('---');
  lines.push('');
  lines.push(`# ${page.name}`);
  lines.push('');

  if (page.description) {
    lines.push(page.description);
    lines.push('');
  }

  if (page.warning) {
    lines.push(`> **Warning:** ${page.warning}`);
    lines.push('');
  }

  // FunctionBanner on the page: demo code first, no extra heading (shadcn-style).
  if (page.demo?.trim()) {
    lines.push(createCodeFence('tsx', page.demo));
    lines.push('');
  }

  lines.push('## Installation');
  lines.push('');
  lines.push(createCodeFence('bash', 'npm install @siberiacancode/reactuse'));
  lines.push('');
  lines.push(createCodeFence('bash', `npx useverse@latest add ${page.name}`));
  lines.push('');
  lines.push('Copy and paste the following code into your project.');
  lines.push('');
  lines.push(createCodeFence('ts', page.source));
  lines.push('');
  lines.push('Update the import paths to match your project setup.');
  lines.push('');

  lines.push('## Usage');
  lines.push('');
  const usage = page.examples
    .map((example, index) => (index === 0 ? example : `// or\n${example}`))
    .join('\n');
  lines.push(createCodeFence('tsx', usage));
  lines.push('');

  if (page.typeDeclarations?.trim()) {
    lines.push('## Type Declarations');
    lines.push('');
    lines.push(createCodeFence('ts', page.typeDeclarations));
    lines.push('');
  }

  if (page.apiParameters.length) {
    lines.push('## API');
    lines.push('');

    for (const parameter of page.apiParameters) {
      if (parameter.tag === 'overload') {
        lines.push('- **Overload**');
        continue;
      }

      if (parameter.tag === 'param') {
        const optional = parameter.optional ? '?' : '';
        const defaultValue =
          parameter.default !== undefined && parameter.default !== ''
            ? ` = ${parameter.default}`
            : '';
        const type = parameter.type || 'unknown';
        const description = parameter.description ? ` — ${parameter.description}` : '';
        lines.push(`- \`${parameter.name}${optional}: ${type}${defaultValue}\`${description}`);
        continue;
      }

      if (parameter.tag === 'returns') {
        const type = parameter.type || 'unknown';
        const description = parameter.description ? ` — ${parameter.description}` : '';
        lines.push(`- **Returns:** \`${type}\`${description}`);
      }
    }

    lines.push('');
  }

  if (page.contributors.length) {
    lines.push('## Contributors');
    lines.push('');
    for (const contributor of page.contributors) {
      lines.push(`- ${contributor.name}`);
    }
    lines.push('');
  }

  return `${lines.join('\n').trimEnd()}\n`;
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

const createUsageMd = (pages: FunctionMetadata[]) => {
  const usageGroups = [
    {
      key: 'necessary',
      title: 'Necessary',
      description: 'Core everyday primitives that cover the most common React tasks.'
    },
    {
      key: 'high',
      title: 'High',
      description: 'Frequently useful functions that fit naturally into many production features.'
    },
    {
      key: 'medium',
      title: 'Medium',
      description:
        'Situational building blocks for recurring patterns and product-specific workflows.'
    },
    {
      key: 'low',
      title: 'Low',
      description:
        'Niche utilities for targeted browser APIs, edge cases, and specialized interactions.'
    }
  ] as const;

  const result = [];
  result.push('---');
  result.push('title: Usage');
  result.push('description: Browse functions by how commonly they are used in real projects.');
  result.push('---');
  result.push('');
  result.push('## Groups');
  result.push('');
  result.push('Explore the catalog grouped by practical usage level.');
  result.push('');

  for (const group of usageGroups) {
    const items = pages
      .filter((page) => page.usage.toLowerCase() === group.key)
      .toSorted((a, b) => a.name.localeCompare(b.name))
      .map(
        (item) => `- [${item.name}](/functions/${item.type}s/${item.name}): ${item.description}`
      );

    if (!items.length) continue;

    result.push(`### ${group.title}`);
    result.push('');
    result.push(group.description);
    result.push('');
    result.push(...items);
    result.push('');
  }

  return result.join('\n').trimEnd();
};

const init = async () => {
  console.log('\n[generate-functions] Starting...');

  const [hooks, helpers] = await Promise.all([getElements('hook'), getElements('helper')]);
  const content = [...hooks, ...helpers];

  const metadata = await Promise.all(
    content.map(async (element) => {
      const source = await getContentFile(element.type, element.name);
      const extension = await getExtensionFile(element.type, element.name);

      const jsdocMatch = matchJsdoc(source);

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

      if (!isTest && !isDemo) {
        console.error(`No files found for ${element.name}`);
        return null;
      }

      const { contributors, firstCommitAt, isNew, lastCommitAt } = await getGitInfo(
        element.name,
        element.type,
        extension
      );

      const sourceFile = ts.createSourceFile('temp.ts', source, ts.ScriptTarget.Latest, true);
      const typeDeclarationsSource = extractTypeInfo(sourceFile);
      const dependencies = extractDependencies(source);
      const demoSource = isDemo
        ? await fs.promises.readFile(
            path.join(CORE_ROOT, `${element.type}s`, element.name, `${element.name}.demo.tsx`),
            'utf-8'
          )
        : undefined;

      const page = {
        badges: {
          firstCommitAt: new Date(firstCommitAt).getTime(),
          isNew,
          lastCommitAt: new Date(lastCommitAt).getTime()
        },
        code: await createHtmlCode(source, 'tsx'),
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
        lastModified: lastCommitAt,
        examples: jsdoc.examples.map((example) => example.description),
        apiParameters: jsdoc.apiParameters ?? [],
        ...(typeDeclarationsSource && {
          typeDeclarations: await createHtmlCode(typeDeclarationsSource, 'tsx')
        }),
        dependencies,
        contributors,
        ...(demoSource && {
          demo: await createHtmlCode(demoSource, 'tsx')
        })
      };

      const share: ShareMarkdownPage = {
        name: page.name,
        type: page.type,
        description: page.description,
        category: page.category,
        usage: page.usage,
        isTest: page.isTest,
        examples: page.examples,
        apiParameters: page.apiParameters,
        contributors: page.contributors,
        source,
        ...(page.warning && { warning: page.warning }),
        ...(page.browserapi && {
          browserapi: {
            name: page.browserapi.name,
            description: page.browserapi.description
          }
        }),
        ...(typeDeclarationsSource && { typeDeclarations: typeDeclarationsSource }),
        ...(demoSource && { demo: demoSource })
      };

      return { page, share };
    })
  );

  const generated = metadata.filter(Boolean) as {
    page: FunctionMetadata;
    share: ShareMarkdownPage;
  }[];
  const pages = generated.map(({ page }) => page);
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

  for (const { page, share } of generated) {
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

    const shareMarkdownPath = path.join(
      PUBLIC_ROOT,
      'functions',
      `${page.type}s`,
      `${page.name}.md`
    );
    await fs.promises.mkdir(path.dirname(shareMarkdownPath), { recursive: true });
    await fs.promises.writeFile(shareMarkdownPath, createShareMarkdown(share), 'utf-8');

    if (page.demo) {
      const demo = await createDemo(page);
      await fs.promises.writeFile(
        path.join('generated', 'demos', `${page.type}s`, `${page.name}.demo.tsx`),
        demo,
        'utf-8'
      );
    }
  }

  for (const type of ['hook', 'helper'] as const) {
    const metaJson = createMetaJson(pages.filter((page) => page.type === type));
    await fs.promises.writeFile(
      path.join(CONTENT_ROOT, 'functions', `${type}s`, `meta.json`),
      metaJson,
      'utf-8'
    );

    const shareDirectory = path.join(PUBLIC_ROOT, 'functions', `${type}s`);
    const keep = new Set(
      pages.filter((page) => page.type === type).map((page) => `${page.name}.md`)
    );

    if (!fs.existsSync(shareDirectory)) continue;

    for (const file of await fs.promises.readdir(shareDirectory)) {
      if (!file.endsWith('.md') || keep.has(file)) continue;
      await fs.promises.unlink(path.join(shareDirectory, file));
    }
  }

  const functionsMd = createFunctionsMd(pages);
  const usageMd = createUsageMd(pages);

  await fs.promises.writeFile(
    path.join(CONTENT_ROOT, 'docs', '(root)', 'usage.mdx'),
    usageMd,
    'utf-8'
  );
  await fs.promises.writeFile(
    path.join(CONTENT_ROOT, 'docs', '(root)', 'functions.mdx'),
    functionsMd,
    'utf-8'
  );

  const llmsTxt = createLlmsTxt(pages);
  await fs.promises.writeFile(path.join('public', 'llms.txt'), llmsTxt, 'utf-8');

  console.log('[generate-functions] Done\n');
};

init();
