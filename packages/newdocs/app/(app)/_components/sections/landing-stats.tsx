'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

import { Button } from '@/src/components/ui';

interface LandingStatsProps {
  stats: {
    description?: string;
    label: string;
    value: string;
  }[];
}

export const LandingStats = ({ stats }: LandingStatsProps) => (
  <section>
    <div className='container mx-auto px-6 py-24 md:py-32'>
      <motion.div
        className='flex max-w-3xl flex-col gap-6'
        initial={{ opacity: 0, y: -28 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.45 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h2 className='font-display text-foreground text-4xl font-bold tracking-tight uppercase md:text-8xl'>
          Trusted at scale
        </h2>

        <p className='text-muted-foreground text-lg leading-relaxed md:text-xl'>
          The metrics behind the largest React hooks library — production-ready, fully typed, and
          shipped with zero dependencies.
        </p>

        <div className='flex flex-wrap items-center gap-2'>
          <Button
            className='rounded-full px-7 py-6 font-mono text-lg font-semibold'
            nativeButton={false}
            render={<Link href='/docs/installation' prefetch={false} />}
          >
            <span>Get started</span>
            <ArrowRight className='size-4' />
          </Button>
          <Button
            className='rounded-full px-7 py-6 font-mono text-lg font-semibold'
            nativeButton={false}
            render={<Link href='/docs/functions' prefetch={false} />}
            variant='secondary'
          >
            <span>Browse all functions</span>
            <ArrowRight className='size-4' />
          </Button>
        </div>
      </motion.div>

      <motion.div
        className='mt-16 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3'
        initial={{ opacity: 0, y: -32 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.2 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {stats.map((stat) => (
          <div key={stat.label} className='flex flex-col gap-2'>
            <span className='font-display text-foreground text-5xl font-bold tracking-tight tabular-nums md:text-6xl'>
              {stat.value}
            </span>
            <span className='text-muted-foreground text-sm font-medium tracking-wider uppercase'>
              {stat.label}
            </span>
            {stat.description && (
              <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>
                {stat.description}
              </p>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);
