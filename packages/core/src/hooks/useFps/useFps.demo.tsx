import { useFps } from '@siberiacancode/reactuse';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const HISTORY = 40;

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
    <section className='flex w-full max-w-lg flex-col gap-3 p-4'>
      <div className='flex items-center justify-between'>
        <span className='text-foreground text-sm font-semibold'>FRAME PER SECONDS</span>
        <span className='text-muted-foreground font-mono text-xs tabular-nums'>
          {String(fps).padStart(2, '0')} FPS
        </span>
      </div>

      <div className='bg-background flex h-44 items-end gap-[2px] rounded-lg border p-3'>
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

      <div className='grid grid-cols-3 gap-3'>
        <div className='flex flex-col gap-0.5'>
          <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>Min</span>
          <span className='text-foreground font-mono text-sm font-semibold tabular-nums'>
            {min || '--'}
          </span>
        </div>
        <div className='flex flex-col gap-0.5'>
          <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>Avg</span>
          <span className='text-foreground font-mono text-sm font-semibold tabular-nums'>
            {avg || '--'}
          </span>
        </div>
        <div className='flex flex-col gap-0.5'>
          <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>Peak</span>
          <span className='text-foreground font-mono text-sm font-semibold tabular-nums'>
            {peak || '--'}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Demo;
