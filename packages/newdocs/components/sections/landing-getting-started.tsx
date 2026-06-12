'use client';

import { useInterval } from '@siberiacancode/reactuse';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/src/components/ui';
import { cn } from '@/src/lib';

const INTERVAL = 5000;

const frameworks = [
  {
    description:
      'Best choice for a single page application. Fast dev server, instant HMR and optimized builds out of the box.',
    href: '/docs/installation/vite',
    logo: 'https://cdn.simpleicons.org/vite',
    name: 'Vite',
    short: 'Single page application',
    site: 'https://vite.dev'
  },
  {
    description:
      'Best choice for an application with server-side rendering. Reactuse hooks are SSR-friendly and work without extra setup.',
    href: '/docs/installation/nextjs',
    logo: 'https://cdn.simpleicons.org/nextdotjs',
    name: 'Next.js',
    short: 'Server-side rendering',
    site: 'https://nextjs.org'
  },
  {
    description:
      'Full-featured routing framework for React. Use reactuse hooks in loaders, actions and route components.',
    href: '/docs/installation/react-router',
    logo: 'https://cdn.simpleicons.org/reactrouter',
    name: 'React Router',
    short: 'Declarative routing',
    site: 'https://reactrouter.com'
  },
  {
    description:
      'Fully type-safe router with built-in caching and first-class search params. Pairs perfectly with reactuse hooks.',
    href: '/docs/installation/tanstack-router',
    logo: 'https://cdn.simpleicons.org/tanstack',
    name: 'TanStack Router',
    short: 'Type-safe routing',
    site: 'https://tanstack.com/router'
  },
  {
    description:
      'Full-stack React framework powered by TanStack Router. SSR, streaming and server functions with full type safety.',
    href: '/docs/installation/tanstack',
    logo: 'https://cdn.simpleicons.org/tanstack',
    name: 'TanStack Start',
    short: 'Full-stack framework',
    site: 'https://tanstack.com/start'
  }
];

const getMask = (logo: string) => ({
  backgroundColor: 'currentColor',
  maskImage: `url(${logo})`,
  WebkitMaskImage: `url(${logo})`,
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
  maskSize: 'contain',
  WebkitMaskSize: 'contain',
  maskPosition: 'center',
  WebkitMaskPosition: 'center'
});

export const LandingGettingStarted = () => {
  const [activeFrameworkIndex, setActiveFrameworkIndex] = useState(0);
  const activeFramework = frameworks[activeFrameworkIndex];

  const interval = useInterval(() => {
    setActiveFrameworkIndex((current) => (current + 1) % frameworks.length);
  }, INTERVAL);

  return (
    <section>
      <div className='mx-auto max-w-6xl px-6 py-12 md:py-24'>
        <motion.div
          className='max-w-3xl'
          initial={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.45 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className='font-display text-foreground text-4xl font-bold tracking-tight uppercase md:text-8xl'>
            Getting started
          </h2>
          <p className='text-muted-foreground mt-6 text-lg leading-relaxed md:text-xl'>
            reactuse can be used with any modern React framework or build tool: get started with{' '}
            <Link
              className='text-foreground underline underline-offset-4'
              href='/docs/installation/nextjs'
            >
              Next.js
            </Link>
            ,{' '}
            <Link
              className='text-foreground underline underline-offset-4'
              href='/docs/installation/vite'
            >
              Vite
            </Link>
            ,{' '}
            <Link
              className='text-foreground underline underline-offset-4'
              href='/docs/installation/react-router'
            >
              React Router
            </Link>{' '}
            and other tools in minutes.
          </p>

          <Button asChild className='mt-3 rounded-full px-0' variant='link'>
            <Link href='/docs/installation/manual'>
              <span>Add to a manual project</span>
              <ArrowRight className='size-4' />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          className='mt-12 grid gap-4 lg:grid-cols-[1.7fr_1fr]'
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.25 }}
          whileInView={{ opacity: 1, y: 0 }}
          onMouseEnter={interval.pause}
          onMouseLeave={interval.resume}
        >
          {/* ── Main card ── */}
          <div className='bg-card flex flex-col overflow-hidden rounded-xl p-8 md:p-10'>
            <div className='flex flex-1 flex-col'>
              {/* logo (link, no border, theme-aware) */}
              <Link
                aria-label={activeFramework.name}
                className='w-fit transition-opacity hover:opacity-70'
                href={activeFramework.site}
                rel='noreferrer'
                target='_blank'
              >
                <span
                  aria-hidden='true'
                  className='text-foreground block size-16'
                  style={getMask(activeFramework.logo)}
                />
              </Link>

              <div className='mt-10'>
                <p className='text-muted-foreground font-mono text-sm tracking-wide uppercase'>
                  {activeFramework.short}
                </p>
                <h3 className='text-foreground mt-3 text-4xl font-semibold tracking-tight md:text-5xl'>
                  {activeFramework.name}
                </h3>
                <p className='text-muted-foreground mt-5 max-w-xl text-lg leading-relaxed'>
                  {activeFramework.description}
                </p>
              </div>
            </div>

            {/* ── Button, then loader bars under it ── */}
            <div className='mt-10'>
              <Button asChild className='rounded-full px-6'>
                <Link href={activeFramework.href}>
                  <span>Install</span>
                  <ArrowRight className='size-4' />
                </Link>
              </Button>

              <div className='mt-6 flex gap-1.5'>
                {frameworks.map((framework, index) => {
                  const isActive = activeFrameworkIndex === index;

                  return (
                    <button
                      key={framework.name}
                      className={cn(
                        'bg-muted h-1 overflow-hidden rounded-full transition-all duration-300',
                        isActive ? 'w-8' : 'hover:bg-muted-foreground/40 w-4'
                      )}
                      aria-label={`Show ${framework.name}`}
                      type='button'
                      onClick={() => setActiveFrameworkIndex(index)}
                    >
                      {isActive ? (
                        <span
                          key={`${activeFrameworkIndex}-${interval.active}`}
                          style={{
                            animation: !interval.active
                              ? 'none'
                              : `landing-getting-started-progress ${INTERVAL}ms linear`
                          }}
                          className='bg-primary block h-full origin-left rounded-full'
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Framework list: separate cards ── */}
          <div className='flex flex-col gap-3'>
            {frameworks.map((framework, index) => {
              const isActive = activeFrameworkIndex === index;

              return (
                <button
                  key={framework.name}
                  className={cn(
                    'group bg-card flex w-full flex-1 items-center gap-4 rounded-xl p-5 text-left transition-all duration-300',
                    isActive ? 'bg-muted/40 ring-border ring-2' : 'hover:bg-muted/30'
                  )}
                  type='button'
                  onClick={() => setActiveFrameworkIndex(index)}
                >
                  <span
                    aria-hidden='true'
                    className='text-foreground block size-8 shrink-0'
                    style={getMask(framework.logo)}
                  />
                  <span className='min-w-0 flex-1'>
                    <span className='text-foreground block text-base font-medium'>
                      {framework.name}
                    </span>
                    <span className='text-muted-foreground mt-0.5 block truncate text-sm'>
                      {framework.short}
                    </span>
                  </span>
                  <ArrowUpRight
                    className={cn(
                      'size-4 shrink-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  />
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
