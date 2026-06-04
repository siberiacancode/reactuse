import { getContent, getHookDocsLink } from '../../../../src/utils';

export default {
  async load() {
    const hooks = await getContent('hook');

    const hooksWithLinks = await Promise.all(
      hooks.map(async (hook) => ({
        ...hook,
        link: await getHookDocsLink(hook.name)
      }))
    );

    return {
      hooks: hooksWithLinks
    };
  }
};
