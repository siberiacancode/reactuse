import { parseHookJsdoc } from '../parseHookJsdoc';

import { getHookFile } from './getHookFile';
import { getHooks } from './getHooks';

interface HookItem {
  category: string;
  description: string;
  link: string;
  text: string;
}

export const getHookItems = async (): Promise<HookItem[]> => {
  const hooks = await getHooks();

  const sidebar = await Promise.all(
    hooks.map(async (hook) => {
      const { content } = await getHookFile(hook);

      const jsdocCommentRegex = /\/\*\*\s*\n([^\\*]|(\*(?!\/)))*\*\//;
      const match = content.match(jsdocCommentRegex);

      if (!match) {
        console.error(`No jsdoc comment found for ${hook}`);
        return null;
      }

      const jsdoc = parseHookJsdoc(match[0].trim());

      if (!jsdoc.description || !jsdoc.usage) {
        console.error(`No content found for ${hook}`);
        return null;
      }

      return {
        text: hook,
        description: jsdoc.description.description,
        category: jsdoc.category?.name,
        link: `/functions/hooks/${hook}`
      };
    })
  );

  return sidebar.filter(Boolean) as HookItem[];
};
