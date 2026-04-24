import { parse } from 'comment-parser';
import fs from 'node:fs';
import path from 'node:path';

import type { FunctionMetadata } from './constants';

import { CONTENT_ROOT, CORE_ROOT } from './constants';
import { checkFileContent, getContentFile, getElements, getGitInfo, matchJsdoc } from './helpers';

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
  result.push(`isDemo: ${metadata.isDemo}`);
  result.push(`lastModifiedTime: ${metadata.lastModified}`);
  result.push('---');

  result.push('');
  result.push(`import metadata from './${metadata.name}.meta.json';`);
  result.push('');

  result.push(
    `<FunctionSource variant='demo' type='${metadata.type}' file='${metadata.name}' language="tsx" />`
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
  result.push(`    \`\`\`tsx`);
  result.push(`    import { ${metadata.name} } from '@siberiacancode/reactuse';`);
  result.push(`    \`\`\``);
  result.push(`  </TabsContent>`);
  result.push(`  <TabsContent value='cli'>`);
  result.push(`    \`\`\`bash`);
  result.push(`    npx useverse@latest add ${metadata.name}`);
  result.push(`    \`\`\``);
  result.push(`  </TabsContent>`);
  result.push(`  <TabsContent value='manual'>`);
  result.push(`    <Steps>`);
  result.push(`     <Step>`);
  result.push(`      Copy and paste the following code into your project.`);
  result.push(`    </Step>`);
  result.push(
    `      <FunctionSource variant='code' type='${metadata.type}' file='${metadata.name}' language="ts" />`
  );
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
  result.push('## API');
  result.push('');

  result.push(`<FunctionApi apiParameters={metadata.apiParameters} />`);

  result.push('');
  result.push('## Type Declarations');
  result.push('');

  result.push(
    `<FunctionSource variant='type-declarations' type='${metadata.type}' file='${metadata.name}' language='ts' />`
  );

  result.push('');
  result.push('## Contributors');
  result.push('');
  result.push(
    `<FunctionContributors contributors={metadata.contributors} />`
  );

  return result.join('\n');
};

const init = async () => {
  console.log('\n[generate-functions] Starting...');

  const [hooks, helpers] = await Promise.all([getElements('hook'), getElements('helper')]);
  const content = [...hooks, ...helpers];

  const metadata = await Promise.all(
    content.slice(0, 10).map(async (element) => {
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

      return {
        code: content,
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
        contributors
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

  const metaJson = createMetaJson(pages);
  await fs.promises.writeFile(path.join(CONTENT_ROOT, 'functions', 'meta.json'), metaJson, 'utf-8');

  console.log('[generate-functions] Done\n');
};

init();
