import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { transformers } from '@/lib/highlight-code';
import rehypePrettyCode from 'rehype-pretty-code';

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
