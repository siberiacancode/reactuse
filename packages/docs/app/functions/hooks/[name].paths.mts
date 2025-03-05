import md5 from 'md5';
import fs from 'node:fs';
import { codeToHtml } from 'shiki';
import simpleGit from 'simple-git';

import { getHookFile, getHooks, matchJsdoc, parseHookJsdoc } from '../../../src/utils';

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
  };
}

const git = simpleGit();

export default {
  async paths() {
    const hooks = await getHooks();

    const params = await Promise.all(
      hooks.map(async (hook) => {
        const content = await getHookFile(hook);
        const jsdocMatch = matchJsdoc(content);

        if (!jsdocMatch) {
          console.error(`No jsdoc comment found for ${hook}`);
          return null;
        }

        const jsdoc = parseHookJsdoc(jsdocMatch);

        if (!jsdoc.description || !jsdoc.usages.length) {
          console.error(`No content found for ${hook}`);
          return null;
        }

        const usages = jsdoc.usages.reduce((acc, usage, index) => {
          if (index !== jsdoc.usages.length - 1) {
            acc += `${usage.description}\n// or\n`;
          } else {
            acc += usage.description;
          }
          return acc;
        }, '');

        const usage = await codeToHtml(usages, {
          lang: 'typescript',
          themes: {
            light: 'github-light',
            dark: 'github-dark'
          },
          defaultColor: false
        });

        const example = await codeToHtml(`import { ${hook} } from '@siberiacancode/reactuse';`, {
          lang: 'typescript',
          themes: {
            light: 'github-light',
            dark: 'github-dark'
          },
          defaultColor: false
        });

        const isTest = await fs.existsSync(`../core/src/hooks/${hook}/${hook}.test.ts`);

        const log = await git.log({ file: `../core/src/hooks/${hook}/${hook}.ts` });
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
            id: hook,
            isTest,
            name: hook,
            ...(jsdoc.browserapi && {
              browserapi: {
                name: jsdoc.browserapi.name,
                description: jsdoc.browserapi.description
              }
            }),
            example,
            description: jsdoc.description.description,
            category: jsdoc.category!.name,
            lastModified: new Date(lastCommit?.date ?? new Date()).getTime(),
            usage,
            apiParameters: jsdoc.apiParameters ?? [],
            contributors
          }
        };
      })
    );

    const pages = params.filter(Boolean) as unknown as HookPageParams[];
    const testCoverage = pages.reduce((acc, page) => acc + Number(page.params.isTest), 0);

    console.log('\nHooks injection report\n');
    console.log(`\x1B[32mInjected: ${pages.length}\x1B[0m`);
    console.log(
      `\x1B[35mTest coverage: ${Math.round((testCoverage / pages.length) * 100)}% (${testCoverage})\x1B[0m`
    );
    console.log(`\x1B[33mSkipped: ${hooks.length - pages.length}\x1B[0m`);
    console.log(`\nTotal: ${hooks.length} hooks`);

    return pages;
  }
};
