'use client'

import { useSticky } from '@siberiacancode/reactuse';
import { useRef } from 'react';

import { cn } from '@/utils/lib';

const PARAGRAPHS = [
  'reactuse is a collection of essential React hooks for everyday development. Fully typed, tree-shakeable and built around a consistent API — whether you need debounce, local storage, media queries or device sensors, there is probably a hook for it.',
  'Every hook follows the same shape, so once you learn one you already know the rest. Options go in, a small object comes out, and the ref is always there when you need to attach to a DOM node.',
  'The library is built specifically for React. It leans on modern browser APIs and wraps them in ergonomic, predictable interfaces you can drop into any component.',
  'Because everything is tree-shakeable, you only ship what you import. No giant runtime, no hidden dependencies — just the hooks you actually use, typed end to end.',
  'Scroll down. While at the top the header is just a logo. The moment it sticks, useSticky flips its stuck flag — it turns into a floating pill and reveals a call-to-action.',
  'That single boolean is all you need to build polished scroll-aware navigation, collapsing toolbars, or shadow-on-scroll effects without wiring up scroll listeners by hand.'
];

const Demo = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { ref, stuck } = useSticky<HTMLElement>({ root: rootRef });

  return (
    <section className='flex w-full max-w-xl flex-col'>
      <div ref={rootRef} className='no-scrollbar h-96 overflow-y-auto px-3'>
        <div className='h-4' />

        <header
          ref={ref}
          className={cn(
            'sticky top-3 z-10 flex h-12 items-center justify-between gap-3 rounded-full transition-[background-color,box-shadow,border-color,padding] duration-300',
            stuck
              ? 'bg-card/85 border-border border px-3 shadow-md backdrop-blur'
              : 'border border-transparent bg-transparent'
          )}
        >
          <div className='flex items-center gap-2'>
            <img alt='reactuse' className='size-5' src='https://reactuse.org/logo.svg' />
            <span className='text-foreground font-semibold tracking-tight'>reactuse</span>
          </div>

          <button
            className={cn(
              'rounded-full! transition-all duration-300',
              stuck ? 'scale-100 opacity-100' : 'pointer-events-none scale-90 opacity-0'
            )}
            data-size='sm'
            type='button'
          >
            Getting started
          </button>
        </header>

        <div className='flex flex-col gap-4 px-1 pt-4 pb-4'>
          <h1 className='text-foreground text-3xl font-semibold tracking-tight'>Meet reactuse</h1>
          {PARAGRAPHS.map((text, index) => (
            <p key={index} className='text-foreground text-base leading-relaxed'>
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Demo;
