import type { DefaultTheme, MarkdownOptions } from 'vitepress';

import { transformerTwoslash } from '@shikijs/vitepress-twoslash';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitepress';

import { getHookItems } from '../../src/utils';

export default async () => {
  const hookItems = await getHookItems();
  const sidebarHookItems = hookItems.reduce<DefaultTheme.SidebarItem[]>(
    (categoryItems, hookItem) => {
      const category = categoryItems.find((group) => group.text === hookItem.category);

      if (!category) {
        categoryItems.push({ text: hookItem.category, items: [hookItem] });
      } else {
        category.items!.push(hookItem);
      }

      return categoryItems;
    },
    []
  );
  const homePageFeatures = hookItems.map((item) => ({
    title: item.text,
    details: item.description,
    link: item.link
  }));

  return defineConfig({
    base: '/reactuse/',
    title: 'reactuse',
    description: '🚀 the largest and most useful hook library',
    markdown: {
      codeTransformers: [transformerTwoslash()],
      languages: ['js', 'jsx', 'ts', 'tsx']
    } as unknown as MarkdownOptions,
    vite: {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          '@siberiacancode/reactuse': fileURLToPath(new URL('../../../core/src', import.meta.url)),
          '@siberiacancode/docs': fileURLToPath(new URL('../../src', import.meta.url)),
          '@': fileURLToPath(new URL('../../../core/src', import.meta.url))
        }
      }
    },
    transformPageData: (pageData) => {
      pageData.frontmatter.head ??= [];
      pageData.frontmatter.head.push([
        'meta',
        {
          name: 'og:image',
          content:
            'https://repository-images.githubusercontent.com/799880708/0afee0cb-ca48-40a2-9c38-dc5b64ebdf65'
        }
      ]);

      if (pageData.relativePath === 'index.md') {
        pageData.frontmatter.features = homePageFeatures;
      }

      if (pageData.relativePath.includes('hooks')) {
        pageData.title = pageData.params?.name;
      }
    },
    head: [
      ['link', { rel: 'icon', href: '/reactuse/favicon.ico' }],
      ['link', { rel: 'manifest', href: '/reactuse/manifest.json' }]
    ],
    locales: {
      root: {
        label: 'English',
        lang: 'en',
        themeConfig: {
          logo: {
            src: '/logo.svg',
            alt: 'reactuse'
          },
          footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2024 siberiacancode'
          },
          editLink: {
            pattern: ({ filePath, params }) => {
              if (filePath.includes('hooks') && params?.name) {
                return `https://github.com/siberiacancode/reactuse/blob/main/packages/core/src/hooks/${params.name}/${params.name}.ts`;
              } else {
                return `https://github.com/siberiacancode/reactuse/blob/main/packages/docs/app/${filePath}`;
              }
            },
            text: 'Suggest changes to this page'
          },
          nav: [
            { text: 'Home', link: '/' },
            {
              text: 'Functions',
              items: [
                { text: 'Get Started', link: '/introduction' },
                { text: 'Installation', link: '/installation' },
                { text: 'Hooks', link: '/functions/hooks/useAsync.html' }
              ]
            }
          ],
          sidebar: [
            {
              text: 'Getting started',
              items: [
                { text: 'Introduction', link: '/introduction' },
                { text: 'Installation', link: '/installation' },
                { text: 'reactuse.json', link: '/reactuse-json' },
                { text: 'CLI', link: '/cli' },
                { text: 'target', link: '/target' }
              ]
            },
            {
              text: 'Installation',
              items: [
                { text: 'Vite', link: '/installation/vite' },
                { text: 'Next.js', link: '/installation/nextjs' }
              ]
            },
            ...sidebarHookItems
          ]
        }
      }
      // ru: {
      //   label: 'Русский',
      //   lang: 'ru',
      //   themeConfig: {
      //     nav: [
      //       { text: 'Главная', link: '/ru' },
      //       {
      //         text: 'Функции',
      //         items: [{ text: 'Хуки', link: '/ru/functions/hooks' }]
      //       }
      //     ]
      //   }
      // }
    },
    themeConfig: {
      search: {
        provider: 'algolia',
        options: {
          appId: '62LROXAB1F',
          apiKey: 'c1ff07348583383446ca32068eb1300f',
          indexName: 'siberiacancodeio'
        }
      },
      socialLinks: [
        { icon: 'github', link: 'https://github.com/siberiacancode/reactuse' },
        { icon: 'npm', link: 'https://www.npmjs.com/package/@siberiacancode/reactuse' },
        { icon: 'youtube', link: 'https://www.youtube.com/@siberiacancode' }
      ]
    }
  });
};
