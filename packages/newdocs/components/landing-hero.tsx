'use client';

import { siteConfig } from '@docs/lib/config';
import { Button } from '@docs/ui/button';
import { IconArrowRight, IconBrandGithub } from '@tabler/icons-react';
import { motion } from 'motion/react';
import Link from 'next/link';

import { Icons } from './icons';
import { LandingBackdrop } from './landing-backdrop';

function NextIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill='none' viewBox='0 0 24 24'>
      <circle cx='12' cy='12' fill='currentColor' r='10' />
      <path d='M8 7.5v9h1.4v-6.3l4.7 6.3h1.9v-9h-1.4v6.12l-4.56-6.12z' fill='var(--background)' />
    </svg>
  );
}

function RemixIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill='currentColor' viewBox='0 0 800 800'>
      <path d='M587.946 561.091C592.088 612.116 592.088 637.546 592.088 673H465.06C465.06 666.081 465.06 659.765 465.164 653.867L465.178 653.08C465.491 635.049 465.747 620.234 463.773 597.849C460.793 556.402 440.983 545.042 405.369 545.042H179V440.049H414.027C459.625 440.049 482.423 424.161 482.423 382.03C482.423 344.431 459.625 322.765 414.027 322.765H179V220H435.837C545.197 220 602 280.659 602 375.018C602 443.553 561.144 490.585 503.464 503.882C552.478 518.547 583.632 546.41 587.946 561.091Z' />
      <path d='M179 673V590H336.59C359.472 590 365.545 607.249 365.545 618.136V673H179Z' />
    </svg>
  );
}

function ViteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill='currentColor' viewBox='0 0 410 404'>
      <path d='M399.641 59.5246L215.643 388.545C211.844 395.338 202.084 395.378 198.228 388.618L10.5817 59.5563C6.38087 52.1896 13.6216 43.5841 21.7848 46.0998L204.332 107.612C206.549 108.344 208.961 108.328 211.167 107.568L390.426 46.1287C398.539 43.4749 405.899 52.0379 401.767 59.4768L399.641 59.5246Z' />
      <path d='M292.965 1.58065L156.801 28.2576C154.092 28.7904 152.089 31.0395 151.893 33.7844L143.553 149.895C143.293 153.539 146.479 156.511 150.103 155.947L190.061 149.292C193.987 148.681 197.354 152.302 196.415 156.153L183.289 212.24C182.311 216.242 185.96 219.881 189.913 218.979L215.907 212.878C219.865 211.975 223.516 215.622 222.532 219.626L202.343 305.956C201.032 311.538 208.665 314.429 211.677 309.66L213.74 306.428L335.167 84.5582C337.388 80.4251 333.664 75.6446 329.047 76.7577L287.847 86.8851C283.778 87.8817 280.196 84.1313 281.425 80.1261L306.501 -1.71706C307.739 -5.75067 304.103 -9.51422 300.02 -8.47395L292.965 1.58065Z' />
    </svg>
  );
}

function TanStackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill='currentColor' viewBox='0 0 100 100'>
      <path d='M50 5C25.1 5 5 25.1 5 50s20.1 45 45 45 45-20.1 45-45S74.9 5 50 5zm0 80c-19.3 0-35-15.7-35-35s15.7-35 35-35 35 15.7 35 35-15.7 35-35 35z' />
      <path d='M50 25c-13.8 0-25 11.2-25 25s11.2 25 25 25 25-11.2 25-25-11.2-25-25-25zm0 40c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15z' />
      <circle cx='50' cy='50' r='8' />
    </svg>
  );
}

function AstroIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill='currentColor' viewBox='0 0 128 128'>
      <path d='M81.504 9.465c.973 1.207 1.469 2.836 2.457 6.09l21.656 67.835a63.07 63.07 0 0 0-25.871-8.677L66.349 29.77a.512.512 0 0 0-.98 0l-13.32 44.927a63.07 63.07 0 0 0-25.87 8.677L47.831 15.52c.99-3.218 1.485-4.827 2.457-6.034a7.978 7.978 0 0 1 3.16-2.39c1.4-.576 3.07-.576 6.41-.576h12.076c3.342 0 5.013 0 6.414.577a7.978 7.978 0 0 1 3.156 2.368z' />
      <path d='M84.094 90.074c-3.57 3.055-10.696 5.137-18.903 5.137-10.07 0-18.515-3.137-20.754-7.356-.8 2.418-.98 5.184-.98 6.9 0 0-.527 8.675 5.508 14.71a5.67 5.67 0 0 1 5.676-5.671c5.37 0 5.362 4.684 5.355 8.488v.336c0 5.453 3.332 10.132 8.07 12.099a11.3 11.3 0 0 1-1.07-4.848c0-5.395 3.168-7.404 6.89-9.763 2.953-1.871 6.257-3.965 8.64-7.945a16.02 16.02 0 0 0 2.297-8.348c0-1.388-.176-2.73-.505-4.012-.063-.25-.13-.494-.207-.737l-.017.01z' />
    </svg>
  );
}

function GatsbyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill='currentColor' viewBox='0 0 256 256'>
      <path d='M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zM28 129.1l99 99c-54.5-.5-98.5-44.6-99-99zm123.6 95.9L32.9 106.4C45.3 59.3 88.7 24 140 24c35.5 0 67.1 16.4 87.8 42.1l-12.8 11.3C197.4 53.9 170.3 40 140 40c-40.5 0-74.8 26.8-86.1 63.6l99.5 99.5c30-9.3 53.2-33.8 60.5-64.1h-50.9v-16h68c0 51.3-36.3 94.7-79.4 107z' />
    </svg>
  );
}

const frameworks = [
  { icon: NextIcon, name: 'Next.js' },
  { icon: RemixIcon, name: 'Remix' },
  { icon: ViteIcon, name: 'Vite' },
  { icon: TanStackIcon, name: 'TanStack' },
  { icon: AstroIcon, name: 'Astro' },
  { icon: GatsbyIcon, name: 'Gatsby' }
];

export const LandingHero = () => {
  return (
    <section className='relative flex min-h-[90vh] items-center overflow-hidden'>
      <div
        className='absolute inset-0'
        style={{
          background:
            'radial-gradient(circle at 50% 25%, color-mix(in oklab, var(--brand) 7%, transparent), transparent 48%)'
        }}
      />
      <LandingBackdrop />

      <div className='pointer-events-none absolute top-1/4 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:color-mix(in_oklab,var(--brand)_8%,transparent)] blur-[180px] dark:bg-[color:color-mix(in_oklab,var(--brand)_5%,transparent)]' />

      <div className='relative mx-auto w-full max-w-6xl px-6 py-20 md:py-28 lg:py-32'>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col items-start'
          initial={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className='mb-8 flex items-center gap-6'>
            <h1 className='font-display text-foreground text-7xl leading-none font-bold tracking-tighter md:text-[10rem] lg:text-[12rem]'>
              reactuse
            </h1>
            <Icons.logo className='h-16 w-16 shrink-0 md:h-28 md:w-28 lg:h-36 lg:w-36' />
          </div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className='mb-6 flex flex-wrap items-center gap-3'
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className='font-display text-foreground text-2xl tracking-tight md:text-3xl lg:text-4xl'>
              The largest
            </span>
            <span
              className='font-display text-2xl tracking-tight md:text-3xl lg:text-4xl'
              style={{ color: 'var(--brand)' }}
            >
              React hooks
            </span>
            <span className='font-display text-foreground text-2xl tracking-tight md:text-3xl lg:text-4xl'>
              library
            </span>
          </motion.div>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className='text-muted-foreground mb-10 max-w-xl text-lg leading-relaxed md:text-xl'
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            158+ production-ready hooks. Lightweight, tree-shakeable, and TypeScript-first.
          </motion.p>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className='flex flex-col items-start gap-4 sm:flex-row'
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href='/docs/installation'>
              <Button className='h-10 rounded-full px-8 text-sm transition-colors' size='sm'>
                Get Started
                <IconArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
            <Link href={siteConfig.links.github} rel='noreferrer' target='_blank'>
              <Button
                className='border-border text-foreground h-10 rounded-full bg-transparent px-8 text-sm transition-colors hover:bg-[color:color-mix(in_oklab,var(--brand)_8%,transparent)] hover:text-[var(--brand)]'
                size='sm'
                variant='outline'
              >
                <IconBrandGithub className='mr-2 h-4 w-4' />
                GitHub
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className='mt-20'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className='text-muted-foreground mb-8 text-center text-sm tracking-widest uppercase'>
            Works with any React framework
          </p>
          <div className='flex flex-wrap items-center justify-center gap-8 md:gap-12'>
            {frameworks.map((framework) => {
              const Icon = framework.icon;

              return (
                <div
                  className='text-muted-foreground/60 flex items-center gap-2.5 transition-colors hover:text-[var(--brand)]'
                  key={framework.name}
                >
                  <Icon className='h-5 w-5' />
                  <span className='text-sm font-medium'>{framework.name}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
