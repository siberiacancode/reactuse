import { defineConfig, defineDocs, frontmatterSchema } from 'fumadocs-mdx/config';
import rehypePrettyCode from 'rehype-pretty-code';
import z from 'zod';

import { categorySchema, typeSchema, usageSchema } from './src/constants';
import { remarkPackageInstall, transformers } from './src/lib/markdown';

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkPackageInstall],
    rehypePlugins: (plugins) => {
      plugins.shift();
      plugins.push([
        rehypePrettyCode,
        {
          theme: {
            dark: 'github-dark',
            light: 'github-light-default'
          },
          transformers
        }
      ]);

      return plugins;
    }
  }
});

export const docs = defineDocs({
  dir: 'content/docs'
});

export const functions = defineDocs({
  dir: 'content/functions',
  docs: {
    schema: frontmatterSchema.extend({
      isTest: z.boolean(),
      isDemo: z.boolean(),
      usage: usageSchema,
      category: categorySchema,
      type: typeSchema,
      lastModifiedTime: z.number()
    })
  }
});
