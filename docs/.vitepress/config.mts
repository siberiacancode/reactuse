import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'reactuse',
  description: '🚀 the largest and most useful hook library',
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../../src', import.meta.url))
      }
    }
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
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
            items: [
              { text: 'useBoolean', link: '/functions/hooks/useBoolean' },
              { text: 'useClickOutside', link: '/functions/hooks/useClickOutside' },
              { text: 'useCounter', link: '/functions/hooks/useCounter' },
              {
                text: 'useIsomorphicLayoutEffect',
                link: '/functions/hooks/useIsomorphicLayoutEffect'
              },
              { text: 'useNetwork', link: '/functions/hooks/useNetwork' },
              { text: 'useTimeout', link: '/functions/hooks/useTimeout' },
              { text: 'useIsClient', link: '/functions/hooks/useIsClient' }
            ]
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
