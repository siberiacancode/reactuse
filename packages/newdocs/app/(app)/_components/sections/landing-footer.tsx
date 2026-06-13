import Image from 'next/image';
import Link from 'next/link';

import { CONFIG, LINKS } from '@/src/constants';

const columns = [
  {
    links: [
      { href: '/docs/installation', label: 'Installation' },
      { href: '/docs/getting-started', label: 'Getting started' },
      { href: '/docs/cli', label: 'CLI' },
      { href: '/docs/contributing', label: 'Contributing' }
    ],
    title: 'Docs'
  },
  {
    links: [
      { href: '/functions/hooks/useActiveElement', label: 'Hooks' },
      { href: '/functions/helpers/createContext', label: 'Helpers' }
    ],
    title: 'Functions'
  },
  {
    external: true,
    links: [
      { href: LINKS.GITHUB, label: 'GitHub' },
      { href: LINKS.NPM, label: 'npm' },
      { href: 'https://github.com/siberiacancode', label: 'siberiacancode' }
    ],
    title: 'Community'
  }
];

const socials = [
  { external: true, href: LINKS.GITHUB, label: 'GitHub' },
  { external: true, href: LINKS.NPM, label: 'npm' }
];

export const LandingFooter = () => (
  <footer className='border-border border-t'>
    <div className='container mx-auto px-6 py-16'>
      <div>
        <div className='grid gap-12 lg:grid-cols-[1.4fr_2fr] lg:gap-16'>
          {/* ── Brand (left) ── */}
          <div className='max-w-sm'>
            <Link className='inline-flex items-center gap-2' href='/'>
              <Image alt='ReactUse' height={12} src='/new/logo.svg' width={12} />

              <span className='text-foreground text-lg font-semibold tracking-tight'>
                {CONFIG.NAME}
              </span>
            </Link>

            <p className='text-muted-foreground mt-4 text-sm leading-relaxed'>
              The largest and most useful React hooks library. Built by the community, for the
              community.
            </p>

            <div className='mt-6 flex items-center gap-4'>
              {socials.map((social) => (
                <Link
                  key={social.label}
                  className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  href={social.href}
                  rel='noreferrer'
                  target='_blank'
                >
                  {social.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Link columns (right) ── */}
          <div className='grid grid-cols-2 gap-8 sm:grid-cols-4'>
            {columns.map((column) => (
              <div key={column.title}>
                <p className='text-foreground text-sm font-semibold'>{column.title}</p>
                <ul className='mt-4 space-y-3'>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                        href={link.href}
                        rel={column.external ? 'noreferrer' : undefined}
                        target={column.external ? '_blank' : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className='mt-16 flex flex-col items-start gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-muted-foreground text-xs'>
            © {new Date().getFullYear()} reactuse. Released under the MIT License. Made with care
            by{' '}
            <Link
              className='text-foreground hover:text-muted-foreground transition-colors'
              href='https://github.com/siberiacancode'
              rel='noreferrer'
              target='_blank'
            >
              siberiacancode
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  </footer>
);
