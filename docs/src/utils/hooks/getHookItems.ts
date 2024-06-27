import { parseHookJsdoc } from '../parseHookJsdoc';

import { getHookFile } from './getHookFile';
import { getHooks } from './getHooks';

interface HookItem {
  text: string;
  description: string;
  link: string;
}

export const getHookItems = async (): Promise<HookItem[]> => {
  const hooks = await getHooks();

  const sidebar = await Promise.all(
    hooks.map(async (hook) => {
      const file = await getHookFile(hook);

      const jsdocCommentRegex = /\/\*\*\s*\n([^\\*]|(\*(?!\/)))*\*\//;
      const match = file.match(jsdocCommentRegex);

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
        link: `/functions/hooks/${hook}`
      };
    })
  );

  return sidebar.filter(Boolean) as HookItem[];
};
