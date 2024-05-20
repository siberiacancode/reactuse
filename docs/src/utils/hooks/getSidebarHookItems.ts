import type { DefaultTheme } from 'vitepress';

import { parseHookJsdoc } from '../parseHookJsdoc';

import { getHookFile } from './getHookFile';
import { getHooks } from './getHooks';

export const getSidebarHookItems = async () => {
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

      if (!jsdoc.description || !jsdoc.usage || !jsdoc.apiParameters) {
        console.error(`No content found for ${hook}`);
        return null;
      }

      return {
        text: hook,
        link: `/functions/hooks/${hook}`
      };
    })
  );

  return sidebar.filter(Boolean) as DefaultTheme.SidebarItem[];
};
