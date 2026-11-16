'use client'

import { useSize } from '@siberiacancode/reactuse';
import { PlusIcon, SparklesIcon } from 'lucide-react';
import { useRef } from 'react';

const Demo = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  const size = useSize<HTMLDivElement>((value) => {
    if (cardRef.current) cardRef.current.dataset.wide = String(value.width >= 320);
  });

  return (
    <section className='flex flex-col items-center gap-3 p-4'>
      <div
        ref={size.ref}
        className='border-border relative min-h-[160px] max-w-full min-w-[200px] overflow-hidden rounded-xl border'
        style={{ resize: 'both' }}
      >
        <span className='absolute top-2 right-2 z-10' data-slot='badge'>
          <SparklesIcon className='size-3' />
          New
        </span>

        <div
          ref={cardRef}
          className='group flex h-full flex-col data-[wide=true]:flex-row'
          data-wide='false'
        >
          <div className='bg-muted flex h-32 w-full shrink-0 items-center justify-center text-8xl group-data-[wide=true]:h-full group-data-[wide=true]:w-32 group-data-[wide=true]:text-7xl'>
            🍔
          </div>

          <div className='flex min-w-0 flex-1 flex-col gap-2 p-4'>
            <div className='flex flex-col gap-0.5'>
              <span className='text-foreground font-semibold'>Classic Burger</span>
              <span className='text-muted-foreground text-xs'>Beef patty · cheddar · 320g</span>
            </div>

            <div className='mt-auto flex items-center justify-between gap-2'>
              <span className='text-foreground text-lg font-semibold tabular-nums'>$8.50</span>
              <button data-size='sm' type='button'>
                <PlusIcon className='size-4' />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
