'use client'

import { useMemory } from '@siberiacancode/reactuse';
import { useState } from 'react';

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
  const [history, setHistory] = useState<number[]>([]);
  const [peak, setPeak] = useState(0);

  const memory = useMemory((value) => {
    setHistory((current) => [...current, value.usedJSHeapSize].slice(-HISTORY_LENGTH));
    setPeak((current) => Math.max(current, value.usedJSHeapSize));
  });

  const used = memory.value?.usedJSHeapSize ?? 0;
  const limit = memory.value?.jsHeapSizeLimit ?? 1;
  const percent = (used / limit) * 100;

  if (!memory.supported)
    return (
      <p>
        API not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory'
          rel='noreferrer'
          target='_blank'
        >
          API
        </a>
      </p>
    );

  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;

  const points = history
    .map((value, index) => {
      const x = (index / (HISTORY_LENGTH - 1)) * 100;
      const normalized = (value - min) / range;
      const y = 95 - normalized * 90;
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
            {history.length > 1 && (
              <>
                <polygon
                  className='text-foreground/10'
                  fill='currentColor'
                  points={`0,100 ${points} 100,100`}
                />
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
              </>
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
            <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>Peak</span>
            <span className='text-foreground font-mono text-sm font-semibold tabular-nums'>
              {formatBytes(peak)}
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
