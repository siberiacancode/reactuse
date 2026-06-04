import { parseHookJsdoc } from '../parseHookJsdoc';
import { getContent } from './getContent';
import { getContentFile } from './getContentFile';
import { getHookDocsLink } from './getHookDocsLink';

interface ContentItem {
  category: string;
  description: string;
  link: string;
  rel?: string;
  target?: string;
  text: string;
}

export const getContentItems = async () => {
  const hooks = await getContent('hook');
  const helpers = await getContent('helper');

  const content = [...hooks, ...helpers];

  const sidebar = await Promise.all(
    content.map(async (item) => {
      const fileContent = await getContentFile(item.type, item.name);

      const jsdocCommentRegex = /\/\*\*\s*\n([^\\*]|(\*(?!\/)))*\*\//;
      const match = fileContent.match(jsdocCommentRegex);

      if (!match) {
        console.error(`No jsdoc comment found for ${item.name}`);
        return null;
      }

      const jsdoc = parseHookJsdoc(match[0].trim());

      if (!jsdoc.description || !jsdoc.examples.length) {
        console.error(`No content found for ${item.name}`);
        return null;
      }

      const navigation = await getHookDocsLink(item.name);

      return {
        text: item.name,
        description: jsdoc.description.description,
        category: jsdoc.category?.name,
        ...navigation
      };
    })
  );

  return sidebar.filter(Boolean) as ContentItem[];
};
