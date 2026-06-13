'use client';

import { siteConfig } from '@docs/lib/config';
import { Button } from '@docs/ui/button';
import { ArrowRight, Github } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

import { LandingBackdrop } from './landing-backdrop';

const FRAMEWORKS = [
  { logo: 'https://cdn.simpleicons.org/nextdotjs', name: 'Next.js' },
  { logo: 'https://cdn.simpleicons.org/vite', name: 'Vite' },
  { logo: 'https://cdn.simpleicons.org/reactrouter', name: 'React Router' },
  { logo: 'https://cdn.simpleicons.org/tanstack', name: 'TanStack' },
  { logo: 'https://cdn.simpleicons.org/astro', name: 'Astro' }
];

const LOGO_MASK = (logo: string) => ({
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

interface LandingHeroProps {
  hooksCount: string;
}

export const LandingHero = ({ hooksCount }: LandingHeroProps) => (
  <section className='relative flex min-h-[70vh] items-center overflow-hidden py-20 md:min-h-[78vh]'>
    {/* dithered wave canvas */}
    <LandingBackdrop />

    {/* overall readability fades */}
    <div className='from-background via-background/70 pointer-events-none absolute inset-0 bg-gradient-to-r to-transparent' />
    <div className='from-background pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t to-transparent' />

    <div className='relative container mx-auto w-full px-6'>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className='flex max-w-3xl flex-col items-start'
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* logo + name (no background, bigger) */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col items-start gap-3'
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg
            className='text-foreground size-16 shrink-0 md:size-24 lg:size-28'
            fill='none'
            viewBox='0 0 221 261'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              clipRule='evenodd'
              d='M159.999 7.69775C153.582 13.638 151.31 22.812 151.31 34.5C151.31 40.2428 151.381 51.3329 151.466 64.6287C151.7 101.123 152.039 154.236 151.31 159C150.317 165.5 145.206 197.5 110.31 197.5C75.4147 197.5 70.616 165 69.9994 159C69.7888 156.951 69.8296 133.467 69.8967 101.5C69.9005 97 64 94.9995 55.9995 103L5.49948 153.5C1.90816 157.091 0.338443 159.877 0.245557 165.836C0.245557 215.5 40.8086 260.5 110.31 260.5C186.206 260.5 220.81 205.5 220.81 159V34.5V9.81473e-07L186.06 9.81473e-07C173.707 3.18976e-06 165.39 2.70809 159.999 7.69775Z'
              fill='url(#paint0_linear_557_677)'
              fillRule='evenodd'
            />
            <path
              d='M32.0003 9.81473e-07H0.000167727L-0.000488281 144.422L0.245557 165.836C0.338443 159.877 1.90816 157.091 5.49948 153.5L55.9995 103C64 94.9995 69.9005 97 69.8967 101.5C69.8967 101.5 69.9181 76.0305 69.9214 74.5C69.9605 56.4972 69.9994 48.4531 69.9994 34.5C69.9994 0 48.2542 9.81473e-07 32.0003 9.81473e-07Z'
              fill='url(#paint1_linear_557_677)'
            />
            <path
              d='M32.0003 9.81473e-07H0.000167727L-0.000488281 144.422L0.245557 165.836C0.338443 159.877 1.90816 157.091 5.49948 153.5L55.9995 103C64 94.9995 69.9005 97 69.8967 101.5C69.8967 101.5 69.9181 76.0305 69.9214 74.5C69.9605 56.4972 69.9994 48.4531 69.9994 34.5C69.9994 0 48.2542 9.81473e-07 32.0003 9.81473e-07Z'
              fill='#61DAFB'
            />
            <defs>
              <linearGradient
                gradientUnits='userSpaceOnUse'
                id='paint0_linear_557_677'
                x1='0.000982455'
                x2='149.001'
                y1='-10'
                y2='181'
              >
                <stop stopColor='#205DAE' />
                <stop offset='1' stopColor='#61DAFB' />
              </linearGradient>
              <linearGradient
                gradientUnits='userSpaceOnUse'
                id='paint1_linear_557_677'
                x1='0.000982455'
                x2='149.001'
                y1='-10'
                y2='181'
              >
                <stop stopColor='#205DAE' />
                <stop offset='1' stopColor='#61DAFB' />
              </linearGradient>
            </defs>
          </svg>
          <h1 className='font-display text-foreground text-6xl leading-none font-bold tracking-tight md:text-8xl lg:text-[10rem]'>
            REACTUSE
          </h1>
        </motion.div>

        {/* subtitle — background hugs each line */}
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className='mt-6 max-w-xl text-lg leading-relaxed md:text-xl'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className='bg-background text-muted-foreground rounded-full box-decoration-clone px-3 leading-[2.1]'>
            The largest React hooks library. {hooksCount} production-ready hooks — lightweight,
            tree-shakeable, and TypeScript-first.
          </span>
        </motion.p>

        {/* actions */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className='mt-8 flex flex-col items-start gap-3 sm:flex-row'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button asChild className='group h-11 rounded-full px-7 text-sm'>
            <Link href='/docs/installation'>
              Get started
              <ArrowRight className='size-4 transition-transform group-hover:translate-x-0.5' />
            </Link>
          </Button>
          <Button asChild className='h-11 rounded-full px-7 text-sm' variant='secondary'>
            <Link href={siteConfig.links.github} rel='noreferrer' target='_blank'>
              <Github className='size-4' />
              GitHub
            </Link>
          </Button>
        </motion.div>

        {/* frameworks — label hugs the line, chips share one rounded container */}
        <motion.div
          animate={{ opacity: 1 }}
          className='mt-12'
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <p className='text-xs leading-[2.2] tracking-[0.2em] uppercase'>
            <span className='bg-background text-muted-foreground rounded-full box-decoration-clone px-3 py-1.5 font-mono'>
              Works with any React framework
            </span>
          </p>
          <div className='bg-background mt-3 flex w-fit flex-wrap items-center gap-x-6 gap-y-3 rounded-full px-3 py-2.5'>
            {FRAMEWORKS.map((framework) => (
              <span key={framework.name} className='text-muted-foreground flex items-center gap-2'>
                <span
                  aria-hidden='true'
                  className='block size-5 shrink-0'
                  style={LOGO_MASK(framework.logo)}
                />
                <span className='text-sm font-medium'>{framework.name}</span>
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);
