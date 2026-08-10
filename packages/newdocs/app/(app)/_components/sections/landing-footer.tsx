import Link from 'next/link';

import { GithubIcon, LogoIcon, NpmIcon, TwitterIcon } from '@/src/components/icons';
import { CONFIG, LINKS } from '@/src/constants';

const COLUMNS = [
  {
    links: [
      { href: '/docs/installation', label: 'Installation', external: false },
      { href: '/docs/introduction', label: 'Introduction', external: false },
      { href: '/docs/cli', label: 'CLI', external: false }
    ],
    title: 'Docs'
  },
  {
    links: [
      { href: '/functions/hooks/useActiveElement', label: 'Hooks', external: false },
      { href: '/functions/helpers/cn', label: 'Helpers', external: false }
    ],
    title: 'Functions'
  },
  {
    links: [
      { href: LINKS.GITHUB, label: 'GitHub', external: true },
      { href: LINKS.NPM, label: 'npm', external: true },
      { href: LINKS.TWITTER, label: 'X', external: true }
    ],
    title: 'Community'
  }
] as const;

const SOCIALS = [
  { href: LINKS.GITHUB, icon: GithubIcon, label: 'GitHub' },
  { href: LINKS.NPM, icon: NpmIcon, label: 'npm' },
  { href: LINKS.TWITTER, icon: TwitterIcon, label: 'X' }
];

const COPYRIGHT_YEAR = new Date().getFullYear();

export const LandingFooter = () => (
  <footer className='border-border border-t'>
    <div className='container mx-auto px-6 py-16'>
      <div>
        <div className='grid gap-12 lg:grid-cols-[1.4fr_2fr] lg:gap-16'>
          <div className='max-w-sm'>
            <Link className='inline-flex items-center gap-2' href='/' prefetch={false}>
              <LogoIcon className='size-5' />

              <span className='text-foreground text-lg font-semibold tracking-tight'>
                {CONFIG.NAME}
              </span>
            </Link>

            <p className='text-muted-foreground mt-4 text-sm leading-relaxed'>
              The largest and most useful React hooks library. Built by the community, for the
              community.
            </p>

            <div className='mt-6 flex items-center gap-2.5'>
              {SOCIALS.map((social) => {
                const Icon = social.icon;

                return (
                  <Link
                    key={social.label}
                    aria-label={social.label}
                    className='text-muted-foreground hover:text-foreground inline-flex size-8 items-center justify-center rounded-full transition-colors'
                    href={social.href}
                    prefetch={false}
                    rel='noreferrer'
                    target='_blank'
                  >
                    <Icon className='size-4.5' />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-8 sm:grid-cols-4'>
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <p className='text-foreground text-sm font-semibold'>{column.title}</p>
                <ul className='mt-4 space-y-3'>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                        href={link.href}
                        prefetch={false}
                        {...(link.external && {
                          rel: 'noreferrer',
                          target: '_blank'
                        })}
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

        <div className='mt-16 flex flex-col items-start gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-muted-foreground text-xs'>
            © {COPYRIGHT_YEAR} reactuse. Released under the MIT License. Made with care by{' '}
            <Link
              className='text-foreground hover:text-muted-foreground transition-colors'
              href={LINKS.GITHUB}
              prefetch={false}
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
