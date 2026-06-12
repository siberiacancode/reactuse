'use client';

import { motion } from 'motion/react';

interface Stat {
  label: string;
  value: string;
}

interface LandingStatsProps {
  stats: Stat[];
}

const STAT_REPEAT_KEYS = ['first', 'second', 'third', 'fourth'] as const;

export const LandingStats = ({ stats }: LandingStatsProps) => (
  <motion.div
    className='border-border bg-card/30 relative overflow-hidden border-y py-6'
    initial={{ opacity: 0, y: 18 }}
    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    viewport={{ once: true, amount: 0.35 }}
    whileInView={{ opacity: 1, y: 0 }}
  >
    <div className='animate-marquee flex whitespace-nowrap'>
      {STAT_REPEAT_KEYS.flatMap((repeatKey) =>
        stats.map((stat) => (
          <div key={`${repeatKey}-${stat.label}`} className='mx-12 flex items-center gap-3'>
            <span className='font-display text-foreground text-3xl font-bold md:text-4xl'>
              {stat.value}
            </span>
            <span className='text-muted-foreground text-sm tracking-wider uppercase md:text-base'>
              {stat.label}
            </span>
          </div>
        ))
      )}
    </div>
  </motion.div>
);
