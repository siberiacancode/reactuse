'use client'

import { useMemory } from '@siberiacancode/reactuse';
import { useEffect, useState } from 'react';

const formatBytes = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
};

const HISTORY_LENGTH = 40;

const Demo = () => {
  const memory = useMemory();
  const [history, setHistory] = useState<number[]>([]);

  const used = memory.value?.usedJSHeapSize ?? 0;
  const limit = memory.value?.jsHeapSizeLimit ?? 1;
  const percent = (used / limit) * 100;

  useEffect(() => {
    if (!memory.supported) return;
    setHistory((current) => [...current, percent].slice(-HISTORY_LENGTH));
  }, [used]);

  if (!memory.supported) {
    return (
      <section className='flex w-full max-w-md flex-col gap-2 p-4'>
        <h2 className='text-foreground text-sm font-semibold'>Memory monitor</h2>
        <p className='text-muted-foreground text-xs leading-relaxed'>
          The <code>performance.memory</code> API is only available in Chromium-based browsers
          (Chrome, Edge). Open this page there to see live memory usage.
        </p>
      </section>
    );
  }

  const points = history
    .map((value, index) => {
      const x = (index / (HISTORY_LENGTH - 1)) * 100;
      const y = 100 - value;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <section className='flex w-full max-w-md flex-col gap-4 p-4'>
      <div className='border-border bg-card flex flex-col gap-4 rounded-xl border p-4 shadow-sm'>
        <div className='flex items-center justify-between'>
          <span className='text-foreground text-sm font-semibold'>JS Heap</span>
          <span className='text-muted-foreground font-mono text-xs tabular-nums'>
            {percent.toFixed(1)}%
          </span>
        </div>

        <div className='bg-background relative h-24 overflow-hidden rounded-lg border'>
          <svg
            className='absolute inset-0 h-full w-full'
            preserveAspectRatio='none'
            viewBox='0 0 100 100'
          >
            <polyline
              className='text-foreground'
              fill='none'
              points={points}
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='1.5'
              vectorEffect='non-scaling-stroke'
            />
            {history.length > 0 && (
              <polygon
                className='text-foreground/10'
                fill='currentColor'
                points={`0,100 ${points} 100,100`}
              />
            )}
          </svg>
        </div>

        <div className='grid grid-cols-3 gap-3'>
          <div className='flex flex-col gap-0.5'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>Used</span>
            <span className='text-foreground font-mono text-sm font-semibold tabular-nums'>
              {formatBytes(used)}
            </span>
          </div>
          <div className='flex flex-col gap-0.5'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              Total
            </span>
            <span className='text-foreground font-mono text-sm font-semibold tabular-nums'>
              {formatBytes(memory.value?.totalJSHeapSize ?? 0)}
            </span>
          </div>
          <div className='flex flex-col gap-0.5'>
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>
              Limit
            </span>
            <span className='text-foreground font-mono text-sm font-semibold tabular-nums'>
              {formatBytes(limit)}
            </span>
          </div>
        </div>
      </div>

      <span className='text-muted-foreground px-1 text-[10px]'>
        Sampled once per second via performance.memory.
      </span>
    </section>
  );
};

export default Demo;
