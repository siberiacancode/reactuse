'use client'

import { useShallowEffect } from '@siberiacancode/reactuse';
import { LayersIcon, RefreshCwIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const Demo = () => {
  const [, forceRerender] = useState(0);

  const filter = { role: 'admin', active: true };

  const effectCount = useRef(0);
  const shallowCount = useRef(0);

  useEffect(() => {
    effectCount.current++;
  }, [filter]);

  useShallowEffect(() => {
    shallowCount.current++;
  }, [filter]);

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div className='border-border bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-sm'>
        <div className='flex items-start gap-3'>
          <div className='bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-full'>
            <LayersIcon className='size-5' />
          </div>

          <div className='flex min-w-0 flex-1 flex-col gap-1 leading-tight'>
            <span className='text-foreground text-sm font-semibold'>Object dependency</span>
            <span className='text-muted-foreground text-xs leading-relaxed'>
              Compares by value, so it skips re-runs when nothing actually changed.
            </span>
          </div>
        </div>

        <div className='border-border grid grid-cols-2 gap-3 border-t pt-3'>
          <div className='flex flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              useEffect
            </span>
            <span className='text-foreground font-mono text-lg font-semibold tabular-nums'>
              {effectCount.current}
            </span>
            <span className='text-muted-foreground mt-0.5 text-[10px] leading-tight'>
              runs on every render
            </span>
          </div>

          <div className='flex flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              useShallowEffect
            </span>
            <span className='text-primary font-mono text-lg font-semibold tabular-nums'>
              {shallowCount.current}
            </span>
            <span className='text-muted-foreground mt-0.5 text-[10px] leading-tight'>
              skips identical values
            </span>
          </div>
        </div>

        <div className='border-border flex items-center justify-end border-t pt-3'>
          <button
            data-size='sm'
            data-variant='outline'
            type='button'
            onClick={() => forceRerender((n) => n + 1)}
          >
            <RefreshCwIcon className='size-3.5' />
            Re-render
          </button>
        </div>
      </div>
    </section>
  );
};

export default Demo;
