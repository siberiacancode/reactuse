import { transformers } from '@docs/lib/highlight-code';
import { defineConfig, defineDocs, frontmatterSchema } from 'fumadocs-mdx/config';
import rehypePrettyCode from 'rehype-pretty-code';
import z from 'zod';

export default defineConfig({
  mdxOptions: {
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

const usageSchema = z.enum(['low', 'medium', 'high', 'necessary']);
const categorySchema = z.enum([
  'async',
  'browser',
  'time',
  'elements',
  'humor',
  'state',
  'debug',
  'sensors',
  'lifecycle',
  'utilities',
  'user'
]);
const typeSchema = z.enum(['hook', 'helper']);

export const functions = defineDocs({
  dir: 'content/functions',
  docs: {
    schema: frontmatterSchema.extend({
      isTest: z.boolean(),
      isDemo: z.boolean(),
      usage: usageSchema,
      category: categorySchema,
      type: typeSchema
    })
  }
});
