import type { DefaultTheme } from 'vitepress';

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
    vite: {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
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
            'https://repository-images.githubusercontent.com/799880708/be8887a4-0cf5-4929-a5f0-dba8d70a7d1f'
        }
      ]);

      if (pageData.relativePath === 'index.md') {
        pageData.frontmatter.features = homePageFeatures;
      }

      if (pageData.relativePath.includes('hooks')) {
        pageData.title = pageData.params?.name;
      }
    },
    head: [['link', { rel: 'icon', href: '/reactuse/favicon.ico' }]],
    locales: {
      root: {
        label: 'English',
        lang: 'en',
        themeConfig: {
          logo: {
            src: '/logo.svg',
            alt: 'reactuse'
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
                { text: 'Config', link: '/config' },
                { text: 'CLI', link: '/cli' }
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
