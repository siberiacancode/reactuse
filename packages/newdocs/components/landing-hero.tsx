'use client';

import { siteConfig } from '@docs/lib/config';
import { Button } from '@docs/ui/button';
import { ArrowRight, Github } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

import { Icons } from './icons';

const frameworks = [
  { logo: 'https://cdn.simpleicons.org/nextdotjs', name: 'Next.js' },
  { logo: 'https://cdn.simpleicons.org/remix', name: 'Remix' },
  { logo: 'https://cdn.simpleicons.org/vite', name: 'Vite' },
  { logo: 'https://cdn.simpleicons.org/tanstack', name: 'TanStack' },
  { logo: 'https://cdn.simpleicons.org/astro', name: 'Astro' },
  { logo: 'https://cdn.simpleicons.org/gatsby', name: 'Gatsby' }
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

export const LandingHero = () => (
  <section className='relative flex min-h-[92vh] items-center overflow-hidden'>
    {/* left-side darkening so text stays readable over the canvas */}
    <div className='pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent' />
    <div className='pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent' />

    <div className='relative container mx-auto w-full px-6 py-20 md:py-28'>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className='flex max-w-3xl flex-col items-start'
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* logo + name */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col items-start gap-2'
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Icons.logo className='size-14 shrink-0 text-white md:size-20 lg:size-24' />
          <h1 className='font-display text-6xl leading-none font-bold tracking-tight text-white md:text-8xl lg:text-9xl'>
            REACTUSE
          </h1>
        </motion.div>

        {/* subtitle */}
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className='mt-8 max-w-xl text-lg leading-relaxed text-white/60 md:text-xl'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          The largest React hooks library. 158+ production-ready hooks — lightweight,
          tree-shakeable, and TypeScript-first.
        </motion.p>

        {/* actions */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className='mt-10 flex flex-col items-start gap-3 sm:flex-row'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            asChild
            className='h-11 rounded-full bg-white px-7 text-sm text-black hover:bg-white/90'
          >
            <Link href='/docs/installation'>
              Get started
              <ArrowRight className='size-4' />
            </Link>
          </Button>
          <Button
            asChild
            className='h-11 rounded-full border-white/20 bg-transparent px-7 text-sm text-white hover:bg-white/10 hover:text-white'
            variant='outline'
          >
            <Link href={siteConfig.links.github} rel='noreferrer' target='_blank'>
              <Github className='size-4' />
              GitHub
            </Link>
          </Button>
        </motion.div>

        {/* frameworks */}
        <motion.div
          animate={{ opacity: 1 }}
          className='mt-14'
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <p className='font-mono text-xs tracking-[0.2em] text-white/40 uppercase'>
            Works with any React framework
          </p>
          <div className='mt-4 flex flex-wrap items-center gap-x-6 gap-y-4'>
            {frameworks.map((framework) => (
              <span key={framework.name} className='flex items-center gap-2 text-white/50'>
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
