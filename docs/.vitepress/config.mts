import { readdirSync } from 'node:fs';
import { resolve, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitepress';

const srcPath = fileURLToPath(new URL('../../src', import.meta.url));

interface SidebarItem {
  text: string;
  link: string;
}

type SidebarType = 'hooks';

function getSidebarItems(type: SidebarType): SidebarItem[] {
  const sidebarPaths: SidebarItem[] = [];
  const hooksPath = readdirSync(resolve(srcPath, type));

  for (const path of hooksPath) {
    if (extname(path) === '.ts') continue;
    const name = basename(path);
    sidebarPaths.push({
      text: name,
      link: `/functions/${type}/${name}`,
    });
  }

  return sidebarPaths;
}

export default defineConfig({
  title: 'reactuse',
  description: '🚀 the largest and most useful hook library',
  vite: {
    resolve: {
      alias: {
        '@': srcPath,
        '@siberiacancode/reactuse': srcPath
      },
      dedupe: [
        'react',
        'react-dom',
      ],
    },
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
            items: [
              {
                text: 'Hooks',
                link: '/functions/hooks/',
              },
            ],
          },
        ],
        sidebar: [
          {
            text: 'Hooks',
            items: getSidebarItems('hooks'),
          },
        ],
      },
    },
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
