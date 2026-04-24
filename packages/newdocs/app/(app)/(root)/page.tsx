import type { Metadata } from 'next';

import { LandingFaq } from '@docs/components/landing-faq';
import { LandingHero } from '@docs/components/landing-hero';
import { LandingHooksShowcase } from '@docs/components/landing-hooks-showcase';
import { siteConfig } from '@docs/lib/config';
import { getContributors } from '@docs/lib/contributors';
import { getElementNames } from '@docs/lib/element-docs';
import { Button } from '@docs/ui/button';
import { IconBrandGithub, IconHeartFilled } from '@tabler/icons-react';
import Link from 'next/link';

const title = 'reactuse';
const description =
  '158+ production-ready React hooks. Lightweight, tree-shakeable, and TypeScript-first.';

const stats = [
  { label: 'Hooks', value: '158+' },
  { label: 'Contributors', value: '60+' },
  { label: 'GitHub Stars', value: '3K+' },
  { label: 'Weekly Downloads', value: '50K+' },
  { label: 'TypeScript', value: '100%' },
  { label: 'Dependencies', value: '0' }
];

const advantages = [
  {
    description:
      'Minimal footprint with zero dependencies. Each hook is optimized for maximum performance.',
    number: '01',
    title: 'Lightweight'
  },
  {
    description: 'Unified patterns across all hooks for predictable, maintainable code.',
    number: '02',
    title: 'Consistent API'
  },
  {
    description: 'Install via CLI or copy directly. Configure hooks to fit your exact needs.',
    number: '03',
    title: 'Customizable'
  },
  {
    description: 'From state management to browser APIs, sensors, elements, and utilities.',
    number: '04',
    title: '158+ Hooks'
  },
  {
    description: 'Import only what you need. Unused hooks are excluded from your bundle.',
    number: '05',
    title: 'Tree Shakeable'
  },
  {
    description: '60+ contributors, actively maintained with regular updates and new hooks.',
    number: '06',
    title: 'Community Driven'
  }
];

const faqs = [
  {
    answer:
      'reactuse is a comprehensive collection of production-ready React hooks. It covers state management, browser APIs, sensors, DOM utilities, and more.',
    question: 'What is reactuse?'
  },
  {
    answer:
      'You can install the full package or use the CLI flow to add specific hooks. The docs also let you copy the source directly into your project.',
    question: 'How do I install reactuse?'
  },
  {
    answer:
      'Yes. The library works with Next.js, Remix, Vite, Gatsby, Astro, and other React-based environments.',
    question: 'Is reactuse compatible with modern React frameworks?'
  },
  {
    answer:
      'Yes. When you import specific hooks, only those pieces are pulled into the final bundle.',
    question: 'Are the hooks tree-shakeable?'
  },
  {
    answer:
      'Yes. reactuse is written in TypeScript and exposes type definitions for every hook and helper.',
    question: 'Is TypeScript supported?'
  },
  {
    answer:
      'You can open issues, send pull requests, and contribute new hooks, fixes, demos, and docs improvements on GitHub.',
    question: 'How can I contribute to reactuse?'
  }
];

const featuredHooks = [
  'useBoolean',
  'useCounter',
  'useDebounceState',
  'useDisclosure',
  'useList',
  'useToggle',
  'useClipboard',
  'useCookie',
  'useLocalStorage',
  'useMediaQuery',
  'useOnline',
  'useDocumentTitle',
  'useBattery',
  'useDeviceMotion',
  'useGeolocation',
  'useIdle',
  'useMouse',
  'useNetwork',
  'useClickOutside',
  'useElementSize',
  'useHover',
  'useIntersectionObserver',
  'useResizeObserver',
  'useMutationObserver',
  'useAsync',
  'useDebounceCallback',
  'useInterval',
  'useTimeout',
  'useThrottle',
  'useEventListener',
  'useConst',
  'useCopy',
  'useEvent',
  'usePrevious',
  'useStep',
  'useDefault'
];

export const metadata: Metadata = {
  title,
  description
};

export default async function HomePage() {
  const [contributors, hooks] = await Promise.all([getContributors(), getElementNames('hooks')]);

  const allHooks = hooks.length > 0 ? hooks : featuredHooks;

  return (
    <div className='bg-background min-h-screen'>
      <main>
        <LandingHero />

        <div className='border-border bg-card/30 relative overflow-hidden border-y py-6'>
          <div className='animate-marquee flex whitespace-nowrap'>
            {[...stats, ...stats, ...stats, ...stats].map((stat, index) => (
              <div className='mx-12 flex items-center gap-3' key={`${stat.label}-${index}`}>
                <span className='font-display text-foreground text-3xl font-bold md:text-4xl'>
                  {stat.value}
                </span>
                <span className='text-muted-foreground text-sm tracking-wider uppercase md:text-base'>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <section className='border-border border-t'>
          <div className='mx-auto max-w-6xl px-6 py-24 md:py-32'>
            <h2 className='font-display text-foreground text-5xl font-bold tracking-tighter md:text-7xl lg:text-8xl'>
              Why reactuse?
            </h2>

            <div className='mt-12 flex flex-col gap-0 md:mt-16'>
              {advantages.map((advantage) => (
                <div
                  className='group border-border/40 flex items-start gap-6 border-b py-5 transition-colors last:border-0 hover:border-[color:color-mix(in_oklab,var(--brand)_30%,transparent)] md:gap-8'
                  key={advantage.title}
                >
                  <span className='font-display text-muted-foreground/40 pt-1 text-3xl leading-none transition-colors group-hover:text-[var(--brand)] md:text-4xl'>
                    {advantage.number}
                  </span>
                  <div className='flex-1'>
                    <h3 className='font-display text-foreground text-2xl font-semibold transition-colors group-hover:text-[var(--brand)] md:text-3xl'>
                      {advantage.title}
                    </h3>
                    <p className='text-muted-foreground mt-2 max-w-2xl text-base leading-relaxed md:text-lg'>
                      {advantage.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <LandingHooksShowcase hooks={allHooks} />

        <section className='border-border border-t'>
          <div className='mx-auto max-w-6xl px-6 py-24 md:py-32'>
            <div className='grid gap-12 lg:grid-cols-[1fr,1.5fr] lg:gap-20'>
              <div>
                <h2 className='font-display text-foreground sticky top-24 text-5xl font-bold tracking-tighter md:text-7xl lg:text-8xl'>
                  FAQ
                </h2>
              </div>

              <LandingFaq items={faqs} />
            </div>
          </div>
        </section>

        <section className='border-border bg-card/30 border-t'>
          <div className='mx-auto max-w-6xl px-6 py-24 md:py-32'>
            <h2 className='font-display text-foreground text-5xl font-bold tracking-tighter md:text-7xl lg:text-8xl'>
              Sponsors
            </h2>
            <p className='text-muted-foreground mt-6 max-w-xl text-lg'>
              reactuse is open source and free to use. Your sponsorship helps maintain the library,
              add new hooks, and support the community.
            </p>

            <div className='border-border bg-card/50 mt-12 rounded-2xl border border-dashed px-8 py-20 text-center'>
              <p className='text-muted-foreground mb-6'>
                No sponsors yet. Be the first to support reactuse!
              </p>
              <div className='flex flex-col justify-center gap-3 sm:flex-row'>
                <Link
                  href='https://github.com/sponsors/siberiacancode'
                  rel='noreferrer'
                  target='_blank'
                >
                  <Button className='h-9 rounded-full px-6 transition-colors' size='sm'>
                    <IconHeartFilled className='mr-2 h-3.5 w-3.5' />
                    Sponsor on GitHub
                  </Button>
                </Link>
                <Link href='https://opencollective.com/reactuse' rel='noreferrer' target='_blank'>
                  <Button
                    className='border-border text-foreground h-9 rounded-full bg-transparent px-6 transition-colors hover:bg-[color:color-mix(in_oklab,var(--brand)_8%,transparent)] hover:text-[var(--brand)]'
                    size='sm'
                    variant='outline'
                  >
                    Open Collective
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className='border-border border-t'>
          <div className='mx-auto max-w-6xl px-6 py-24 md:py-32'>
            <div className='mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
              <div>
                <h2 className='font-display text-foreground text-5xl font-bold tracking-tighter md:text-7xl lg:text-8xl'>
                  Contributors
                </h2>
                <p className='text-muted-foreground mt-4 text-lg'>
                  Built with love by 60+ amazing developers
                </p>
              </div>
              <Link
                className='text-muted-foreground text-sm transition-colors hover:text-[var(--brand)]'
                href='https://github.com/siberiacancode'
                rel='noreferrer'
                target='_blank'
              >
                Maintained by{' '}
                <span className='text-foreground font-semibold'>SIBERIA CAN CODE</span>
              </Link>
            </div>

            <div className='flex flex-wrap gap-2'>
              {contributors.slice(0, 64).map((contributor) => (
                <Link
                  className='group relative'
                  href={`https://github.com/${contributor.name}`}
                  key={contributor.name}
                  rel='noreferrer'
                  target='_blank'
                  title={contributor.name}
                >
                  <img
                    alt={contributor.name}
                    className='border-border bg-card h-10 w-10 rounded-full border transition-all hover:z-10 hover:scale-110'
                    src={contributor.avatar}
                    style={
                      {
                        ['--tw-border-opacity' as string]: '1'
                      } as React.CSSProperties
                    }
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className='border-border border-t'>
        <div className='mx-auto max-w-6xl px-6 py-16'>
          <div className='flex flex-col items-center text-center'>
            <Link className='inline-flex items-center gap-3' href='/'>
              <img alt='reactuse' className='h-10 w-10' src='/logo.svg' />
              <span className='font-display text-foreground text-4xl font-bold uppercase'>
                reactuse
              </span>
            </Link>

            <p className='text-muted-foreground mt-4 max-w-md'>
              The largest and most useful React hooks library. Built by the community, for the
              community.
            </p>

            <div className='mt-8 flex items-center gap-6'>
              <Link
                className='text-muted-foreground text-sm transition-colors hover:text-[var(--brand)]'
                href='/docs/installation'
              >
                Docs
              </Link>
              <Link
                className='text-muted-foreground text-sm transition-colors hover:text-[var(--brand)]'
                href='/functions/hooks/useActiveElement'
              >
                Hooks
              </Link>
              <Link
                className='text-muted-foreground text-sm transition-colors hover:text-[var(--brand)]'
                href={siteConfig.links.github}
                rel='noreferrer'
                target='_blank'
              >
                GitHub
              </Link>
              <Link
                className='text-muted-foreground text-sm transition-colors hover:text-[var(--brand)]'
                href={siteConfig.links.npm}
                rel='noreferrer'
                target='_blank'
              >
                npm
              </Link>
            </div>

            <div className='mt-8'>
              <Link
                className='text-muted-foreground inline-flex items-center gap-2 transition-colors hover:text-[var(--brand)]'
                href={siteConfig.links.github}
                rel='noreferrer'
                target='_blank'
              >
                <IconBrandGithub className='h-5 w-5' />
              </Link>
            </div>

            <div className='border-border/50 mt-10 w-full border-t pt-8'>
              <p className='text-muted-foreground text-xs'>
                {new Date().getFullYear()} reactuse. Released under the MIT License.
              </p>
              <p className='text-muted-foreground mt-2 text-xs'>
                Made with care by{' '}
                <Link
                  className='text-foreground transition-colors hover:text-[var(--brand)]'
                  href='https://github.com/siberiacancode'
                  rel='noreferrer'
                  target='_blank'
                >
                  SIBERIA CAN CODE
                </Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
