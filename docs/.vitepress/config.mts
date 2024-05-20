import { defineConfig } from 'vitepress';
import { getSidebarHookItems } from '../src/utils';
import viteConfig from './vite.config';

export default defineConfig({
  title: 'reactuse',
  description: '🚀 the largest and most useful hook library',
  vite: viteConfig,
  transformPageData: (pageData) => {
    if (pageData.relativePath.includes('hooks')) {
      pageData.title = pageData.params?.name;
      return;
    }
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
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
            items: [{ text: 'Hooks', link: '/functions/hooks/' }]
          }
        ],
        sidebar: [
          {
            text: 'Hooks',
            items: getSidebarHookItems()
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
