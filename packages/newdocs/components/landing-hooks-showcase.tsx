import Link from 'next/link';

import { Button } from '@docs/ui/button';
import { IconArrowRight } from '@tabler/icons-react';

interface LandingHooksShowcaseProps {
  hooks: string[];
}

const chunk = <T,>(items: T[], size: number) => {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

const duplicate = <T,>(items: T[]) => [...items, ...items];

export const LandingHooksShowcase = ({ hooks }: LandingHooksShowcaseProps) => {
  const displayHooks = hooks.slice(0, 80);
  const rows = chunk(displayHooks, 16).slice(0, 5);

  return (
    <section className='border-t border-border bg-card/30'>
      <div className='mx-auto max-w-6xl px-6 pt-24 md:pt-32'>
        <div>
          <h2 className='font-display text-5xl font-bold tracking-tighter text-foreground md:text-7xl lg:text-8xl'>
            Explore Hooks
          </h2>
          <p className='mt-4 text-lg text-muted-foreground md:text-xl'>
            158+ production-ready hooks for every use case
          </p>
        </div>
      </div>

      <div className='mt-12 space-y-5 md:mt-16'>
        <div className='space-y-5'>
          {rows.map((row, index) => {
            const rowClass = index % 2 === 0 ? 'landing-hooks-row-left' : 'landing-hooks-row-right';

            return (
              <div className='overflow-hidden' key={`row-${index}`}>
                <div className={rowClass}>
                  {duplicate(row).map((hook, hookIndex) => (
                    <Link
                      className='mx-2 inline-flex items-center rounded-full border border-black/10 bg-white px-7 py-4 font-mono text-lg font-semibold text-black shadow-[0_1px_0_rgba(0,0,0,0.05)] transition-transform duration-300 hover:scale-[1.02] dark:border-white/10 dark:bg-white dark:text-black'
                      href={`/functions/hooks/${hook}`}
                      key={`${hook}-${hookIndex}`}
                    >
                      {hook}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className='mx-auto flex max-w-6xl justify-start gap-4 px-6 pt-6 pb-24 md:pb-32'>
          <Link
            className='inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-4 font-mono text-lg font-semibold text-background transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--brand)] hover:text-black'
            href='/functions/hooks/useActiveElement'
          >
            <span>View All</span>
            <IconArrowRight className='h-4 w-4' />
          </Link>

          <Link
            className='inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-7 py-4 font-mono text-lg font-semibold text-foreground transition-all duration-300 hover:scale-[1.02] hover:bg-[color:color-mix(in_oklab,var(--brand)_8%,transparent)] hover:text-[var(--brand)]'
            href='/functions/hooks/useActiveElement'
          >
            <span>+{Math.max(0, hooks.length - displayHooks.length)} more hooks</span>
            <IconArrowRight className='h-4 w-4' />
          </Link>
        </div>
      </div>
    </section>
  );
};
