import { getHookFile, getHooks, matchJsdoc, parseHookJsdoc } from '../../src/utils';

export default {
  paths() {
    const hooks = getHooks();

    const params = hooks.map((hook) => {
      const file = getHookFile(hook);
      const jsdocMatch = matchJsdoc(file);

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
          usage: jsdoc.usage.description,
          apiParameters: jsdoc.apiParameters
        }
      };
    });

    return params.filter(Boolean);
  }
};
