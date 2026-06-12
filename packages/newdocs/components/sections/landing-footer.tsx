'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

import { LINKS } from '@/src/constants';

export const LandingFooter = () => (
  <footer>
    <div className='mx-auto max-w-6xl px-6 py-16'>
      <motion.div
        className='flex flex-col items-center text-center'
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.35 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {/* logo on top, name below */}
        <Link className='inline-flex flex-col items-center gap-3' href='/'>
          <img alt='reactuse' className='size-12' src='/logo.svg' />
          <span className='font-display text-foreground text-2xl font-bold lowercase'>
            reactuse
          </span>
        </Link>

        <p className='text-muted-foreground mt-5 max-w-md text-sm leading-relaxed'>
          The largest and most useful React hooks library. Built by the community, for the
          community.
        </p>

        {/* nav */}
        <nav className='mt-8 flex flex-wrap items-center justify-center gap-4'>
          <Link
            className='text-muted-foreground hover:text-foreground text-sm transition-colors'
            href='/docs/installation'
          >
            Docs
          </Link>
          <Link
            className='text-muted-foreground hover:text-foreground text-sm transition-colors'
            href='/functions/hooks/useActiveElement'
          >
            Hooks
          </Link>
          <Link
            className='text-muted-foreground hover:text-foreground text-sm transition-colors'
            href={LINKS.GITHUB}
            rel='noreferrer'
            target='_blank'
          >
            GitHub
          </Link>
          <Link
            className='text-muted-foreground hover:text-foreground text-sm transition-colors'
            href={LINKS.NPM}
            rel='noreferrer'
            target='_blank'
          >
            npm
          </Link>
        </nav>

        {/* bottom */}
        <div className='mt-10 w-full pt-8'>
          <p className='text-muted-foreground text-xs'>
            © {new Date().getFullYear()} reactuse. Released under the MIT License.
          </p>
          <p className='text-muted-foreground mt-2 text-xs'>
            Made with care by{' '}
            <Link
              className='text-foreground hover:text-muted-foreground transition-colors'
              href='https://github.com/siberiacancode'
              rel='noreferrer'
              target='_blank'
            >
              siberiacancode
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  </footer>
);
