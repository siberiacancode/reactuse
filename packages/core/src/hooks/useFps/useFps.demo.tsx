import { useFps } from '@siberiacancode/reactuse';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const HISTORY = 30;

const getColor = (fps: number) => {
  if (fps >= 50) return 'text-green-500';
  if (fps >= 30) return 'text-amber-500';
  return 'text-destructive';
};

const getBarColor = (fps: number) => {
  if (fps >= 50) return 'bg-green-500';
  if (fps >= 30) return 'bg-amber-500';
  return 'bg-destructive';
};

const Demo = () => {
  const [history, setHistory] = useState<number[]>([]);

  const fps = useFps((value) => setHistory((current) => [...current.slice(-(HISTORY - 1)), value]));

  const max = Math.max(60, ...history);
  const avg = history.length
    ? Math.round(history.reduce((sum, value) => sum + value, 0) / history.length)
    : 0;
  const min = history.length ? Math.min(...history) : 0;
  const peak = history.length ? Math.max(...history) : 0;

  return (
    <section className='demo-ui flex w-full max-w-xs flex-col p-4'>
      <div className='border-border bg-card flex flex-col gap-3 rounded-xl border p-3 shadow-sm'>
        <div className='flex items-end justify-between gap-3'>
          <div className='flex flex-col leading-none'>
            <span className='text-muted-foreground text-[9px] tracking-[0.2em] uppercase'>
              Frames per second
            </span>
            <div className='flex items-baseline gap-1.5'>
              <span
                className={cn(
                  'font-mono text-2xl font-bold tabular-nums transition-colors',
                  getColor(fps)
                )}
              >
                {String(fps).padStart(2, '0')}
              </span>
              <span className='text-muted-foreground text-[10px]'>FPS</span>
            </div>
          </div>

          <div className='flex items-center gap-1.5'>
            <span className={cn('size-1.5 animate-pulse rounded-full', getBarColor(fps))} />
            <span className='text-muted-foreground font-mono text-[9px] tracking-wider uppercase'>
              Live
            </span>
          </div>
        </div>

        <div className='flex h-10 items-end gap-[2px]'>
          {Array.from({ length: HISTORY }).map((_, index) => {
            const value = history[history.length - HISTORY + index] ?? 0;
            const height = Math.max((value / max) * 100, 4);

            return (
              <div
                key={index}
                className={cn('flex-1 rounded-sm', value ? getBarColor(value) : 'bg-muted')}
                style={{ height: `${height}%`, opacity: value ? 1 : 0.4 }}
              />
            );
          })}
        </div>

        <div className='border-border grid grid-cols-3 gap-2 border-t pt-2'>
          <div className='flex flex-col items-center leading-tight'>
            <span className='text-muted-foreground text-[8px] tracking-[0.15em] uppercase'>
              Min
            </span>
            <span className='text-foreground font-mono text-xs font-semibold tabular-nums'>
              {min || '—'}
            </span>
          </div>
          <div className='flex flex-col items-center leading-tight'>
            <span className='text-muted-foreground text-[8px] tracking-[0.15em] uppercase'>
              Avg
            </span>
            <span className='text-foreground font-mono text-xs font-semibold tabular-nums'>
              {avg || '—'}
            </span>
          </div>
          <div className='flex flex-col items-center leading-tight'>
            <span className='text-muted-foreground text-[8px] tracking-[0.15em] uppercase'>
              Peak
            </span>
            <span className='text-foreground font-mono text-xs font-semibold tabular-nums'>
              {peak || '—'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
