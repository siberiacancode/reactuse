import { parse } from 'comment-parser';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { codeToHtml } from 'shiki';
import simpleGit from 'simple-git';
import ts from 'typescript';

type FunctionType = 'helper' | 'hook';

interface FunctionMetadata {
  apiParameters: any[];
  browserapi?: {
    name: string;
    description: string;
  };
  category: string;
  code: string;
  description: string;
  example: string;
  id: string;
  isDemo: boolean;
  isTest: boolean;
  jsImplementation?: string;
  lastModified: number;
  name: string;
  type: FunctionType;
  typeDeclarations: string[];
  usage: string;
}

const ROOT = path.resolve(process.cwd(), '..');
const CORE_ROOT = path.join(ROOT, 'core', 'src');
const CONTENT_ROOT = path.join(process.cwd(), 'content', 'functions');

const git = simpleGit();

const extractTypeInfo = (sourceFile: ts.SourceFile) => {
  const typeDeclarations: string[] = [];
  const typeImports: string[] = [];

  const visit = (node: ts.Node) => {
    if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
      typeDeclarations.push(node.getText(sourceFile));
    }

    if (ts.isImportDeclaration(node)) {
      const isTypeOnly = node.importClause?.isTypeOnly;
      const hasTypeImports =
        node.importClause?.namedBindings &&
        ts.isNamedImports(node.importClause.namedBindings) &&
        node.importClause.namedBindings.elements.some((element) => element.isTypeOnly);

      if (isTypeOnly || hasTypeImports) {
        typeImports.push(node.getText(sourceFile));
      }
    }

    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  return [...typeImports, ...typeDeclarations].join('\n\n');
};

export const getContentFile = async (type: FunctionType, name: string) => {
  try {
    const basePath = path.join(CORE_ROOT, `${type}s`, name);

    const files = await fs.promises.readdir(basePath);

    const fileName = files.find(
      (file) => file.includes(name) && !file.includes('.test') && !file.includes('.demo')
    );

    if (!fileName) {
      throw new Error(`No matching file found for ${name}`);
    }

    const filePath = path.join(basePath, fileName);
    const content = await fs.promises.readFile(filePath, 'utf-8');

    return content;
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    throw error;
  }
};

export const checkFileContent = async (
  type: FunctionType,
  name: string,
  content: 'demo' | 'test'
) => {
  const files = await fs.promises.readdir(path.join(CORE_ROOT, `${type}s`, name));
  return files.some((file) => file.includes(`${name}.${content}`));
};

export const matchJsdoc = (file: string) => {
  const jsdocCommentRegex = /\/\*\*[ \t]*\r?\n[\s\S]*?\*\//;
  const match = file.match(jsdocCommentRegex);
  return match ? match[0].trim() : undefined;
};

export const getElements = async (type: FunctionType) => {
  const sourceDir = path.join(CORE_ROOT, `${type}s`);
  const files = await fs.promises.readdir(sourceDir, { withFileTypes: true });

  return files
    .filter((file) => file.isDirectory())
    .map((file) => ({
      type,
      name: file.name
    }));
};

export const getGitInfo = async (name: string, type: FunctionType) => {
  const log = await git.log({
    file: path.join(CORE_ROOT, `${type}s`, name, `${name}.ts`)
  });

  const contributorsMap = new Map(
    log.all.map((commit) => [
      commit.author_email,
      { name: commit.author_name, email: commit.author_email }
    ])
  );

  const contributors = Array.from(contributorsMap.values(), (author) => ({
    name: author.name,
    avatar: `https://gravatar.com/avatar/${createHash('md5').update(author.email).digest('hex')}?d=retro`
  }));

  return {
    contributors,
    lastCommit: log.latest!
  };
};

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
  result.push('---');
  result.push('');

  result.push(
    `<FunctionSource variant='demo' type='${metadata.type}' file='${metadata.name}' language="tsx" />`
  );

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

  return result.join('\n');
};

const init = async () => {
  console.log('\n[generate-functions] Starting...');

  const [hooks, helpers] = await Promise.all([getElements('hook'), getElements('helper')]);
  const content = [...hooks, ...helpers];

  const metadata = await Promise.all(
    content.slice(0, 1).map(async (element) => {
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

      const sourceFile = ts.createSourceFile('temp.ts', content, ts.ScriptTarget.Latest, true);
      const typeDeclarations = extractTypeInfo(sourceFile);

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
        ...(typeDeclarations && {
          typeDeclarations
        }),
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
      path.join(CONTENT_ROOT, `${page.type}s`, `${page.name}.mdx`),
      mdx,
      'utf-8'
    );

    const demo = await createDemo(page);
    await fs.promises.writeFile(
      path.join('generated', 'demos', `${page.type}s`, `${page.name}.demo.tsx`),
      demo,
      'utf-8'
    );
  }

  console.log('[generate-functions] Done\n');
};

init();
