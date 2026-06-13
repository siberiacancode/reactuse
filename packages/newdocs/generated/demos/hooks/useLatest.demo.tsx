'use client'

import { useLatest } from '@siberiacancode/reactuse';
import { TrendingUpIcon, ZapIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/utils/lib';

const MULTIPLIERS = [1, 10, 100, 1000];

const formatDateRange = () => {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  const format = (date: Date) => date.toISOString().slice(0, 10);
  return `${format(weekAgo)} to ${format(now)}`;
};

const Demo = () => {
  const [downloads, setDownloads] = useState(2276);
  const [multiplierIndex, setMultiplierIndex] = useState(0);
  const multiplier = MULTIPLIERS[multiplierIndex];
  const latestMultiplier = useLatest(multiplier);

  useEffect(() => {
    const id = setInterval(() => {
      setDownloads((current) => current + latestMultiplier.value);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const onBoost = () => {
    setMultiplierIndex((current) => (current + 1) % MULTIPLIERS.length);
  };

  return (
    <section className='flex w-full max-w-sm flex-col gap-5 p-4'>
      <div className='flex flex-col gap-3'>
        <div className='border-border border-b pb-1.5'>
          <span className='text-foreground text-[10px] font-semibold tracking-wider uppercase'>
            Weekly downloads
          </span>
        </div>

        <div className='flex items-end justify-between gap-3'>
          <div className='flex flex-col gap-0.5 leading-tight'>
            <span className='text-muted-foreground text-[10px]'>Across all versions</span>
            <span className='text-muted-foreground font-mono text-[10px] tabular-nums'>
              {formatDateRange()}
            </span>
            <div className='mt-1.5 flex items-baseline gap-2'>
              <span className='text-foreground font-mono text-3xl font-bold tabular-nums'>
                {downloads.toLocaleString()}
              </span>
              <span className='flex items-center gap-0.5 text-[10px] font-medium text-green-600 dark:text-green-500'>
                <TrendingUpIcon className='size-2.5' />+{multiplier.toLocaleString()}/s
              </span>
            </div>
          </div>

          <button data-size='sm' data-variant='ghost' type='button' onClick={onBoost}>
            <ZapIcon className={cn('size-3.5', multiplier > 1 && 'fill-current')} />×
            {multiplier.toLocaleString()}
          </button>
        </div>
      </div>

      <div className='flex flex-col gap-3'>
        <div className='border-border border-b pb-1.5'>
          <span className='text-foreground text-[10px] font-semibold tracking-wider uppercase'>
            Compatibility
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <img
              alt='Node.js'
              className='size-5 invert dark:invert-0'
              src='https://cdn.simpleicons.org/nodedotjs/ffffff/ffffff'
            />
            <span className='text-foreground text-sm font-medium'>Node.js</span>
          </div>
          <span className='text-muted-foreground font-mono text-sm tabular-nums'>≥ 18</span>
        </div>
      </div>

      <div className='flex flex-col gap-3'>
        <div className='border-border border-b pb-1.5'>
          <span className='text-foreground text-[10px] font-semibold tracking-wider uppercase'>
            Latest version
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex flex-col leading-tight'>
            <span className='text-foreground font-mono text-sm font-medium'>0.3.31</span>
            <span className='text-foreground text-[9px] font-semibold tracking-wider uppercase'>
              Latest
            </span>
          </div>
          <span className='text-muted-foreground text-xs'>Jun 1, 2026</span>
        </div>
      </div>
    </section>
  );
};

export default Demo;
