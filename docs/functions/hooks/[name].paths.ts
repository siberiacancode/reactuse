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

        if (!jsdoc.description || !jsdoc.usage) {
          console.error(`No content found for ${hook}`);
          return null;
        }

        return {
          params: {
            id: hook,
            name: hook,
            description: jsdoc.description.description,
            category: jsdoc.category?.name,
            lastModified: stats.mtime.getTime(),
            usage: jsdoc.usage.description,
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
