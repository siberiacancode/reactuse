import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/src/components/ui';

interface LandingExploreHooksProps {
  hooks: string[];
}

const ROW_COUNT = 4;
const PER_ROW = 14;

export const LandingExploreHooks = ({ hooks }: LandingExploreHooksProps) => {
  const rows = Array.from({ length: ROW_COUNT }, (_, rowIndex) =>
    Array.from({ length: PER_ROW }, (_, index) => hooks[(rowIndex * PER_ROW + index) % hooks.length])
  );

  const displayCount = Math.min(hooks.length, ROW_COUNT * PER_ROW);
  const remaining = Math.max(0, hooks.length - displayCount);

  return (
    <section>
      <div className='mx-auto max-w-6xl px-6 py-24 md:py-32'>
        <div className='max-w-3xl'>
          <h2 className='font-display text-foreground text-4xl font-bold tracking-tight uppercase md:text-6xl'>
            Explore hooks
          </h2>
          <p className='text-muted-foreground mt-6 text-lg leading-relaxed md:text-xl'>
            158+ production-ready hooks for every use case.
          </p>
        </div>

        {/* ── Running rows with soft side fade (no border) ── */}
        <div className='relative mt-12 overflow-hidden'>
          <div className='space-y-4 py-4'>
            {rows.map((row, index) => (
                <div key={`row-${index}`}>
                  <div className={index % 2 === 0 ? 'landing-hooks-row-left' : 'landing-hooks-row-right'}>
                    {row.map((hook) => (
                      <Link
                        key={hook}
                        className='mx-1 inline-flex items-center rounded-full border border-black/20 bg-white px-7 py-4 font-mono text-lg font-semibold text-black shadow-[0_1px_0_rgba(0,0,0,0.05)] transition-transform duration-300 hover:scale-[1.02] dark:border-white/10 dark:bg-black dark:text-white'
                        href={`/functions/hooks/${hook}`}
                      >
                        {hook}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          {/* soft side fade masks */}
          <div className='from-background pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r via-background/30 to-transparent' />
          <div className='from-background pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l via-background/30 to-transparent' />
        </div>

        {/* ── Actions ── */}
        <div className='mt-8 flex flex-wrap items-center gap-2'>
          <Button asChild className='rounded-full px-7 py-6 font-mono text-lg font-semibold'>
            <Link href='/functions/hooks/useActiveElement'>
              <span>View all</span>
              <ArrowRight className='size-4' />
            </Link>
          </Button>

          <Button
            asChild
            className='rounded-full px-7 py-6 font-mono text-lg font-semibold'
            variant='secondary'
          >
            <Link href='/functions'>
              <span>+{remaining} additional functions</span>
              <ArrowRight className='size-4' />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};