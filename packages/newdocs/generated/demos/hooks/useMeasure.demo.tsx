'use client'

import { useBoolean, useMeasure } from '@siberiacancode/reactuse';
import { useState } from 'react';

const COLLAPSED_HEIGHT = 60;

const Demo = () => {
  const [expanded, setExpanded] = useBoolean(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const measure = useMeasure<HTMLParagraphElement>(({ height }) => {
    const nextIsOverflowing = height > COLLAPSED_HEIGHT;
    setIsOverflowing((isOverflowing) =>
      isOverflowing === nextIsOverflowing ? isOverflowing : nextIsOverflowing
    );
  });

  return (
    <section className='flex w-full max-w-sm flex-col gap-2 p-4'>
      <div className='border-border bg-card flex flex-col gap-2 rounded-xl border p-4 shadow-sm'>
        <span className='text-foreground text-sm font-semibold'>About reactuse</span>

        <div
          className='relative overflow-hidden transition-[max-height] duration-300'
          style={{ maxHeight: expanded ? undefined : COLLAPSED_HEIGHT }}
        >
          <p ref={measure.ref} className='text-muted-foreground text-xs leading-relaxed'>
            reactuse is a collection of essential React hooks designed to handle the most common
            patterns in modern web applications. From state management and side effects to browser
            APIs and sensor data — every hook is lightweight, fully typed, and dependency-free. The
            library covers async, lifecycle, state, sensors, elements and utilities, so you can drop
            them into any codebase without friction.
          </p>

          {!expanded && isOverflowing && (
            <div className='from-card pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t to-transparent' />
          )}
        </div>

        {isOverflowing && (
          <button
            className='self-start'
            data-size='sm'
            data-variant='link'
            type='button'
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </section>
  );
};

export default Demo;
