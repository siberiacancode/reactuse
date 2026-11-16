'use client'

import type { MouseEvent } from 'react';

import { useThrottleState } from '@siberiacancode/reactuse';

interface Point {
  x: number;
  y: number;
}

const Demo = () => {
  const [point, setPoint] = useThrottleState<Point | undefined>(undefined, 100);

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPoint({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  const onMouseLeave = () => setPoint(undefined);

  return (
    <section className='flex w-full max-w-md flex-col p-4'>
      <div
        className='border-border bg-card relative h-72 w-full overflow-hidden rounded-xl border'
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
      >
        {point && (
          <span
            className='bg-primary pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[left,top] duration-100 ease-out'
            style={{ left: point.x, top: point.y }}
          />
        )}

        <div className='text-muted-foreground pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs'>
          Move your cursor — the dot follows
        </div>
      </div>
    </section>
  );
};

export default Demo;
