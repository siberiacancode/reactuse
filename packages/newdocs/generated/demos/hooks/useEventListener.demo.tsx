'use client';

import { useEventListener } from '@siberiacancode/reactuse';
import { useState } from 'react';

const VARIANTS = [
  { size: 24, points: 3 },
  { size: 36, points: 2 },
  { size: 52, points: 1 }
];

const PADDING = 16;

const Demo = () => {
  const [target, setTarget] = useState({ x: 100, y: 100, size: 36, points: 2 });
  const [score, setScore] = useState(0);

  const containerRef = useEventListener<HTMLDivElement>('click', (event) => {
    if (!(event.target as HTMLElement).dataset.target) return;

    const container = containerRef.current;
    if (!container) return;

    setScore((value) => value + target.points);

    const rect = container.getBoundingClientRect();
    const next = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
    const x = PADDING + Math.random() * (rect.width - next.size - PADDING * 2);
    const y = PADDING + Math.random() * (rect.height - next.size - PADDING * 2);

    setTarget({ x, y, ...next });
  });

  return (
    <section className='flex w-full max-w-2xl flex-col p-4'>
      <div
        ref={containerRef}
        className='border-border bg-card relative h-[320px] w-full cursor-crosshair overflow-hidden rounded-xl border shadow-sm select-none'
      >
        <div className='pointer-events-none absolute top-3 right-3 z-10 flex items-baseline gap-1.5 font-mono tabular-nums'>
          <span className='text-muted-foreground text-[10px] tracking-[0.15em] uppercase'>
            Score
          </span>
          <span className='text-foreground text-sm font-semibold'>
            {String(score).padStart(3, '0')}
          </span>
        </div>

        <div
          style={{
            left: target.x,
            top: target.y,
            width: target.size,
            height: target.size
          }}
          className='bg-foreground absolute rounded-full shadow-lg'
          data-target='true'
        />
      </div>
    </section>
  );
};

export default Demo;
