'use client';

import { useMouse } from '@siberiacancode/reactuse';
import { ArrowRightIcon } from 'lucide-react';
import { useRef } from 'react';

const Demo = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);

  const mouse = useMouse<HTMLDivElement>((value) => {
    const spotlight = spotlightRef.current;
    if (!spotlight) return;
    spotlight.style.setProperty('--x', `${value.elementX}px`);
    spotlight.style.setProperty('--y', `${value.elementY}px`);
  });

  return (
    <section className='flex w-full max-w-md justify-center p-4'>
      <div
        ref={mouse.ref}
        className='group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 p-8'
      >
        <div
          ref={spotlightRef}
          style={{
            background:
              'radial-gradient(300px circle at var(--x) var(--y), rgba(255,255,255,0.1), transparent 65%)'
          }}
          className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100'
        />

        <div className='relative flex flex-col gap-4'>
          <img alt='reactuse' className='size-9' src='https://reactuse.org/logo.svg' />

          <div className='flex flex-col gap-1.5'>
            <h2 className='text-xl font-bold text-white'>Ship faster with reactuse</h2>
            <p className='max-w-xs text-sm text-neutral-400'>
              A collection of essential React hooks, fully typed and ready for production.
            </p>
          </div>

          <div className='mt-2'>
            <button type='button'>
              Get started
              <ArrowRightIcon className='size-4' />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
