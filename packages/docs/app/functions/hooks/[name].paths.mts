import md5 from 'md5';
import { codeToHtml } from 'shiki';
import simpleGit from 'simple-git';
import ts from 'typescript';

import {
  checkTest,
  getContent,
  getContentFile,
  matchJsdoc,
  parseHookJsdoc
} from '../../../src/utils';

interface HookPageParams {
  params: {
    example: string;
    description: string;
    category: string;
    lastModified: number;
    usage: string;
    apiParameters: any[];
    browserapi?: {
      name: string;
      description: string;
    };
    id: string;
    isTest: boolean;
    name: string;
    jsImplementation?: string;
    typeDeclarations: string[];
  };
}

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

const createHtmlCode = async (code: string) =>
  await codeToHtml(code, {
    lang: 'ts',
    themes: {
      light: 'github-light',
      dark: 'github-dark'
    },
    defaultColor: false
  });

export default {
  async paths() {
    const hooks = await getContent('hook');
    const helpers = await getContent('helper');

    const content = [...hooks, ...helpers];

    const params = await Promise.all(
      content.map(async (element) => {
        const content = await getContentFile(element.type, element.name);
        const jsdocMatch = matchJsdoc(content);

        if (!jsdocMatch) {
          console.error(`No jsdoc comment found for ${element.name}`);
          return null;
        }

        const jsdoc = parseHookJsdoc(jsdocMatch);

        if (!jsdoc.description) {
          console.error(`No content found for ${element.name}`);
          return null;
        }

        const sourceFile = ts.createSourceFile('temp.ts', content, ts.ScriptTarget.Latest, true);

        const typeDeclarations = extractTypeInfo(sourceFile);

        const example = jsdoc.examples.reduce((acc, example, index) => {
          if (index !== jsdoc.examples.length - 1) {
            acc += `${example.description}\n// or\n`;
          } else {
            acc += example.description;
          }
          return acc;
        }, '');

        const isTest = await checkTest(element);

        const log = await git.log({
          file: `../core/src/${element.type}s/${element.name}/${element.name}.ts`
        });
        const lastCommit = log.latest!;

        const contributorsMap = new Map(
          log.all.map((commit) => [
            commit.author_email,
            { name: commit.author_name, email: commit.author_email }
          ])
        );

        const contributors = Array.from(contributorsMap.values()).map((author) => ({
          name: author.name,
          avatar: `https://gravatar.com/avatar/${md5(author.email)}?d=retro`
        }));

        return {
          params: {
            code: await createHtmlCode(content),
            id: element.name,
            isTest,
            type: element.type,
            name: element.name,
            ...(typeDeclarations && {
              typeDeclarations: await createHtmlCode(typeDeclarations)
            }),
            usage: 'necessary',
            ...(jsdoc.warning && {
              warning: jsdoc.warning.description
            }),
            description: jsdoc.description.description,
            category: jsdoc.category!.name,
            lastModified: new Date(lastCommit?.date ?? new Date()).getTime(),
            example: await createHtmlCode(example),
            apiParameters: jsdoc.apiParameters ?? [],
            contributors
          }
        };
      })
    );

    const pages = params.filter(Boolean) as unknown as HookPageParams[];
    const testCoverage = pages.reduce((acc, page) => acc + Number(page.params.isTest), 0);

    console.log('\nElements injection report\n');
    console.log(`\x1B[32mInjected: ${pages.length}\x1B[0m`);
    console.log(
      `\x1B[35mTest coverage: ${Math.round(
        (testCoverage / pages.length) * 100
      )}% (${testCoverage})\x1B[0m`
    );
    const untested = pages.filter((page) => !page.params.isTest);
    if (untested.length)
      console.log(
        `\x1B[35mUntested: ${untested
          .map((page) => page.params.name)
          .sort()
          .join(', ')}\x1B[0m`
      );

    console.log(`\x1B[33mSkipped: ${content.length - pages.length}\x1B[0m`);
    console.log(`\nTotal: ${content.length} elements`);

    return pages;
  }
};
