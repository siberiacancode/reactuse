import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitepress';

import { getSidebarHookItems } from '../src/utils';

export default async () => {
  const sidebarHookItems = await getSidebarHookItems();

  return defineConfig({
    base: '/reactuse/',
    title: 'reactuse',
    description: '🚀 the largest and most useful hook library',
    vite: {
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('../../src', import.meta.url))
        }
      }
    },
    transformPageData: (pageData) => {
      if (pageData.relativePath.includes('hooks')) {
        pageData.title = pageData.params?.name;
        return;
      }
    },
    head: [
      [
        'link',
        {
          rel: 'icon',
          href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚀</text></svg>'
        }
      ]
    ],
    locales: {
      root: {
        label: 'English',
        lang: 'en',
        themeConfig: {
          search: {
            provider: 'local'
          },
          editLink: {
            pattern: ({ filePath, params }) => {
              if (filePath.includes('hooks') && params?.name) {
                return `https://github.com/siberiacancode/reactuse/blob/main/src/hooks/${params.name}/${params.name}.ts`;
              } else {
                return `https://github.com/siberiacancode/reactuse/blob/main/docs/${filePath}`;
              }
            },
            text: 'Suggest changes to this page'
          },
          nav: [
            { text: 'Home', link: '/' },
            {
              text: 'Functions',
              items: [
                { text: 'Get Started', link: '/getting-started' },
                { text: 'Hooks', link: '/functions/hooks/useBattery.html' }
              ]
            }
          ],
          sidebar: [
            {
              text: 'Getting started',
              link: '/getting-started'
            },
            {
              text: 'Hooks',
              items: [...sidebarHookItems]
            }
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
      sidebar: [
        {
          text: 'Examples',
          items: [
            { text: 'Markdown Examples', link: '/markdown-examples' },
            { text: 'Runtime API Examples', link: '/api-examples' }
          ]
        }
      ],
      socialLinks: [
        { icon: 'github', link: 'https://github.com/siberiacancode/reactuse' },
        { icon: 'npm', link: 'https://github.com/siberiacancode/reactuse' },
        { icon: 'youtube', link: 'https://www.youtube.com/@siberiacancode' }
      ]
    }
  });
};
