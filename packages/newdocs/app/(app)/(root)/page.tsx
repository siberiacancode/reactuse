import type { Metadata } from 'next';

import { LandingHero } from '@docs/components/landing-hero';
import { LandingExploreHooks, LandingFaq, LandingFooter, LandingGettingStarted } from '@docs/components/sections';
import { siteConfig } from '@docs/lib/config';
import { getContributors } from '@docs/lib/contributors';
import { Button } from '@docs/ui/button';
import {  IconHeartFilled } from '@tabler/icons-react';
import Link from 'next/link';

const title = 'reactuse';
const description = siteConfig.description;

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

const HomePage = async () => {
  const [contributors, hooks] = await Promise.all([getContributors(), []]);

  const allHooks = hooks.length > 0 ? hooks : featuredHooks;

  return (
    <div className='bg-background min-h-screen'>
      <main>
        <LandingHero />

        <div className='border-border bg-card/30 relative overflow-hidden border-y py-6'>
          <div className='animate-marquee flex whitespace-nowrap'>
            {[...stats, ...stats, ...stats, ...stats].map((stat, index) => (
              <div key={`${stat.label}-${index}`} className='mx-12 flex items-center gap-3'>
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
                  key={advantage.title}
                  className='group border-border/40 flex items-start gap-6 border-b py-5 transition-colors last:border-0 hover:border-[color:color-mix(in_oklab,var(--brand)_30%,transparent)] md:gap-8'
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

        <LandingExploreHooks hooks={allHooks} />
        <LandingGettingStarted />
        <LandingFaq  />

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
                  key={contributor.name}
                  className='group relative'
                  href={`https://github.com/${contributor.name}`}
                  rel='noreferrer'
                  target='_blank'
                  title={contributor.name}
                >
                  <img
                    style={
                      {
                        ['--tw-border-opacity' as string]: '1'
                      } as React.CSSProperties
                    }
                    alt={contributor.name}
                    className='border-border bg-card h-10 w-10 rounded-full border transition-all hover:z-10 hover:scale-110'
                    src={contributor.avatar}
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default HomePage;
