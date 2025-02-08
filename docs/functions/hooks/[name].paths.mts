import { codeToHtml } from 'shiki'

import { getHookFile, getHooks, matchJsdoc, parseHookJsdoc } from '../../src/utils';

export default {
  async paths() {
    const hooks = await getHooks();

    const params = await Promise.all(
      hooks.map(async (hook) => {
        const { content, stats } = await getHookFile(hook);
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
        }, '')

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

        return {
          params: {
            id: hook,
            name: hook,
            example,
            description: jsdoc.description.description,
            category: jsdoc.category?.name,
            lastModified: stats.mtime.getTime(),
            usage,
            apiParameters: jsdoc.apiParameters
          }
        };
      })
    );

    // const features = params
    //   .filter(Boolean)
    //   .map((param) => {
    //     return `\n- title: ${param?.params.name}\n  details: ${param?.params.description}\n  link: /functions/hooks/${param?.params.name}`;
    //   })
    //   .join(' ');
    // console.log('@', features);

    return params.filter(Boolean);
  }
};

