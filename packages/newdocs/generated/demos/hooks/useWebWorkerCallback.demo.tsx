'use client';
import { useBoolean, useTime, useWebWorkerCallback } from '@siberiacancode/reactuse';
import { CpuIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const heavyTask = () => {
  const numbers = Array.from({ length: 5_000_000 }, () => Math.trunc(Math.random() * 500_000));
  numbers.sort((a, b) => a - b);
  return numbers.slice(0, 5);
};

const Demo = () => {
  const [result, setResult] = useState<number[]>();
  const [thread, setThread] = useState<'main' | 'worker'>();
  const [blocking, toggleBlocking] = useBoolean();

  const time = useTime();
  const worker = useWebWorkerCallback(heavyTask);

  const runMain = () => {
    setResult(undefined);
    setThread('main');
    toggleBlocking(true);

    requestAnimationFrame(() => {
      setResult(heavyTask());
      toggleBlocking(false);
    });
  };

  const runWorker = async () => {
    setResult(undefined);
    setThread('worker');
    setResult(await worker.run());
  };

  const clock = [time.hours, time.minutes, time.seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');

  const running = blocking || worker.pending;

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div className='bg-card flex flex-col gap-4 rounded-xl p-5 shadow-sm'>
        <div className='flex items-start gap-3'>
          <div className='bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-full'>
            <CpuIcon className='size-5' />
          </div>

          <div className='flex min-w-0 flex-1 flex-col gap-1 leading-tight'>
            <span className='text-foreground text-sm font-semibold'>Sorting 5M numbers</span>
            <span className='text-muted-foreground text-xs leading-relaxed'>
              The clock keeps ticking while the worker sorts, but freezes when the main thread does
              the same job.
            </span>
          </div>
        </div>

        <div className='border-border grid grid-cols-2 gap-3 border-t pt-3'>
          <div className='flex flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              Clock
            </span>
            <span className='text-foreground font-mono text-lg font-semibold tabular-nums'>
              {clock}
            </span>
          </div>

          <div className='flex flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              Thread
            </span>
            <span
              className={cn(
                'font-mono text-lg font-semibold',
                thread === 'main' ? 'text-destructive' : 'text-foreground'
              )}
            >
              {thread ?? 'idle'}
            </span>
          </div>
        </div>

        <div className='border-border flex items-center justify-between border-t pt-3'>
          <div className='flex min-w-0 flex-col leading-tight'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              Lowest values
            </span>
            <span className='text-foreground truncate font-mono text-lg font-semibold tabular-nums'>
              {result ? result.join(', ') : '—'}
            </span>
          </div>

          <div className='flex shrink-0 gap-2'>
            <button
              data-size='sm'
              data-variant='outline'
              disabled={running}
              type='button'
              onClick={runMain}
            >
              Main
            </button>
            <button
              data-size='sm'
              data-variant={worker.pending ? 'destructive' : 'default'}
              disabled={blocking}
              type='button'
              onClick={worker.pending ? worker.terminate : () => runWorker()}
            >
              {worker.pending ? 'Terminate' : 'Worker'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
