import type { DefaultTheme, MarkdownOptions } from 'vitepress';

import { transformerTwoslash } from '@shikijs/vitepress-twoslash';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitepress';

import { getContentItems } from '../../src/utils';

export default async () => {
  const contentItems = await getContentItems();
  const sidebarContentItems = contentItems.reduce<DefaultTheme.SidebarItem[]>(
    (categoryItems, contentItem) => {
      const category = categoryItems.find((group) => group.text === contentItem.category);

      if (!category) {
        categoryItems.push({
          text: contentItem.category,
          items: [contentItem]
        });
      } else {
        category.items!.push(contentItem);
      }

      return categoryItems;
    },
    []
  );

  return defineConfig({
    base: '/',
    title: 'reactuse',
    titleTemplate: false,
    cleanUrls: true,
    sitemap: {
      hostname: 'https://reactuse.org'
    },
    description:
      'Improve your react applications with our library 📦 designed for comfort and speed',
    markdown: {
      codeTransformers: [
        transformerTwoslash({
          twoslashOptions: {
            compilerOptions: {
              ignoreDeprecations: '6.0'
            }
          }
        })
      ],
      languages: ['js', 'jsx', 'ts', 'tsx']
    } as unknown as MarkdownOptions,
    vite: {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          '@/utils/lib': fileURLToPath(new URL('../../src/utils/lib', import.meta.url)),
          '@siberiacancode/reactuse': fileURLToPath(new URL('../../../core/src', import.meta.url)),
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

      if (pageData.relativePath.includes('hooks') && pageData.params?.name) {
        const name = pageData.params.name as string;
        const description = (pageData.params.description as string) ?? '';

        pageData.title = `${name} React hook Reactuse`;
        pageData.description = description;

        pageData.frontmatter.head.push(
          ['meta', { property: 'og:title', content: pageData.title }],
          ['meta', { property: 'og:description', content: pageData.description }]
        );
      }
    },
    head: [
      ['meta', { name: 'algolia-site-verification', content: '60FB6E25551CE504' }],
      ['link', { rel: 'icon', href: '/favicon.ico' }],
      ['link', { rel: 'manifest', href: '/manifest.json' }],
      [
        'script',
        { type: 'text/javascript' },
        `(function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {
              if (document.scripts[j].src === r) { return; }
            }
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],
            k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
  
        ym(102942267, "init", {
          clickmap:true,
          trackLinks:true,
          accurateTrackBounce:true
        });`
      ],
      [
        'noscript',
        {},
        `<div><img src="https://mc.yandex.ru/watch/102942267" style="position:absolute; left:-9999px;" alt="" /></div>`
      ],

      [
        'script',
        {},
        `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
           new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
           j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
           'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
         })(window,document,'script','dataLayer','GTM-5SMCHX9Z');`
      ],

      [
        'script',
        {
          async: '',
          src: 'https://www.googletagmanager.com/gtag/js?id=G-RRECQP6XBW'
        }
      ],

      [
        'script',
        {},
        `window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
         gtag('config', 'G-RRECQP6XBW', {
           anonymize_ip: true,
           client_storage: 'none',
           allow_google_signals: false,
           allow_ad_personalization_signals: false
         });`
      ]
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
            copyright: `Copyright © ${new Date().getFullYear()} siberiacancode`
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
                { text: 'target', link: '/target' },
                { text: 'memoization', link: '/memoization' },
                { text: 'optimization', link: '/optimization' }
              ]
            },
            {
              text: 'Installation',
              items: [
                { text: 'Vite', link: '/installation/vite' },
                { text: 'Next.js', link: '/installation/nextjs' },
                { text: 'Astro', link: '/installation/astro' },
                { text: 'React Router', link: '/installation/react-router' },
                {
                  text: 'TanStack Router',
                  link: '/installation/tanstack-router'
                },
                { text: 'TanStack Start', link: '/installation/tanstack' },
                { text: 'Preact', link: '/installation/preact' },
                { text: 'Manual', link: '/installation/manual' }
              ]
            },
            ...sidebarContentItems
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
          apiKey: '87ab8dd07b4aba02814c082d98e4b8a7',
          indexName: 'reactuse'
        }
      },
      socialLinks: [
        { icon: 'github', link: 'https://github.com/siberiacancode/reactuse' },
        {
          icon: 'npm',
          link: 'https://www.npmjs.com/package/@siberiacancode/reactuse'
        }
      ]
    }
  });
};
