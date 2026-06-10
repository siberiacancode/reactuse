'use client'

import { usePrevious, useQuery } from '@siberiacancode/reactuse';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

const fetchRate = async () => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return Number((1.05 + (Math.random() - 0.5) * 0.04).toFixed(4));
};

const Demo = () => {
  const rateQuery = useQuery(fetchRate, { refetchInterval: 2000 });
  const previousRate = usePrevious(rateQuery.data);

  const price = rateQuery.data;
  const diff = price !== undefined && previousRate !== undefined ? price - previousRate : 0;
  const up = diff > 0;
  const down = diff < 0;
  const percent = previousRate ? (diff / previousRate) * 100 : 0;

  return (
    <section className='flex w-full justify-center p-6'>
      <div className='border-border bg-card flex w-full max-w-xs flex-col gap-4 rounded-xl border p-5'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='text-foreground text-sm font-semibold'>EUR/USD</span>
            <span className='text-muted-foreground text-xs'>Euro / US Dollar</span>
          </div>
          <span className='bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase'>
            Live
          </span>
        </div>

        <div className='flex items-end justify-between gap-3'>
          <div className='flex flex-col gap-1'>
            {rateQuery.isLoading && (
              <>
                <div className='bg-muted h-9 w-28 animate-pulse rounded-md' />
                <div className='bg-muted h-4 w-20 animate-pulse rounded-md' />
              </>
            )}

            {!rateQuery.isLoading && !!price && (
              <>
                <span className='text-foreground font-mono text-3xl font-bold tabular-nums'>
                  {price.toFixed(4)}
                </span>
                <span className='text-muted-foreground font-mono text-xs tabular-nums'>
                  prev {previousRate?.toFixed(4) ?? '—'}
                </span>
              </>
            )}
          </div>

          {rateQuery.isLoading && <div className='bg-muted h-8 w-16 animate-pulse rounded-lg' />}

          {!rateQuery.isLoading && !!price && (
            <div
              className={cn(
                'flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-sm font-semibold tabular-nums transition-colors',
                up && 'bg-green-500/10 text-green-600 dark:text-green-500',
                down && 'bg-destructive/10 text-destructive',
                !up && !down && 'bg-muted text-muted-foreground'
              )}
            >
              {up && <ArrowUpIcon className='size-3.5' />}
              {down && <ArrowDownIcon className='size-3.5' />}
              {diff >= 0 ? '+' : ''}
              {percent.toFixed(2)}%
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Demo;
