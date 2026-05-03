export const siteConfig = {
  name: 'reactuse',
  url: 'https://reactuse.org',
  ogImage: 'https://reactuse.org/logo.svg',
  description: '-',
  links: {
    npm: 'https://www.npmjs.com/package/@siberiacancode/reactuse',
    github: 'https://github.com/siberiacancode/reactuse'
  },
  navItems: [
    {
      href: '/docs/introduction',
      label: 'Docs'
    },
    {
      href: '/docs/functions',
      label: 'Functions'
    }
  ],
  source: (name: string, type = 'ts') =>
    `https://github.com/siberiacancode/reactuse/blob/main/packages/core/src/hooks/${name}/${name}.${type}`
};
