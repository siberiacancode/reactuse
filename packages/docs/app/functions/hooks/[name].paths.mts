import md5 from "md5";
import { codeToHtml } from "shiki";
import simpleGit from "simple-git";

import {
  getContentFile,
  getContent,
  matchJsdoc,
  parseHookJsdoc,
  checkTest,
} from "../../../src/utils";

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
    const hooks = await getContent("hook");
    const helpers = await getContent("helper");

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

        if (!jsdoc.description || !jsdoc.usages.length) {
          console.error(`No content found for ${element.name}`);
          return null;
        }

        const usages = jsdoc.usages.reduce((acc, usage, index) => {
          if (index !== jsdoc.usages.length - 1) {
            acc += `${usage.description}\n// or\n`;
          } else {
            acc += usage.description;
          }
          return acc;
        }, "");

        const usage = await codeToHtml(usages, {
          lang: "typescript",
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
          defaultColor: false,
        });

        const example = await codeToHtml(
          `import { ${element.name} } from '@siberiacancode/reactuse';`,
          {
            lang: "typescript",
            themes: {
              light: "github-light",
              dark: "github-dark",
            },
            defaultColor: false,
          }
        );

        const isTest = await checkTest(element);

        const log = await git.log({
          file: `../core/src/${element.type}s/${element.name}/${element.name}.ts`,
        });
        const lastCommit = log.latest!;

        const contributorsMap = new Map(
          log.all.map((commit) => [
            commit.author_email,
            { name: commit.author_name, email: commit.author_email },
          ])
        );

        const contributors = Array.from(contributorsMap.values()).map(
          (author) => ({
            name: author.name,
            avatar: `https://gravatar.com/avatar/${md5(author.email)}?d=retro`,
          })
        );

        return {
          params: {
            id: element.name,
            isTest,
            type: element.type,
            name: element.name,
            ...(jsdoc.browserapi && {
              browserapi: {
                name: jsdoc.browserapi.name,
                description: jsdoc.browserapi.description,
              },
            }),
            example,
            ...(jsdoc.warning && {
              warning: jsdoc.warning.description,
            }),
            description: jsdoc.description.description,
            category: jsdoc.category!.name,
            lastModified: new Date(lastCommit?.date ?? new Date()).getTime(),
            usage,
            apiParameters: jsdoc.apiParameters ?? [],
            contributors,
          },
        };
      })
    );

    const pages = params.filter(Boolean) as unknown as HookPageParams[];
    const testCoverage = pages.reduce(
      (acc, page) => acc + Number(page.params.isTest),
      0
    );

    console.log("\nElements injection report\n");
    console.log(`\x1B[32mInjected: ${pages.length}\x1B[0m`);
    console.log(
      `\x1B[35mTest coverage: ${Math.round(
        (testCoverage / pages.length) * 100
      )}% (${testCoverage})\x1B[0m`
    );
    console.log(`\x1B[33mSkipped: ${content.length - pages.length}\x1B[0m`);
    console.log(`\nTotal: ${content.length} elements`);

    return pages;
  },
};
