'use client'

import { useCounter } from '@siberiacancode/reactuse';
import { MinusIcon, PlusIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

const getGuestLabel = (count: number) => {
  if (count === 1) return 'Just you';
  if (count === 2) return 'For two';
  if (count <= 4) return 'Small group';
  if (count <= 7) return 'Medium group';
  return 'Large party';
};

const Demo = () => {
  const counter = useCounter(2, { min: 1, max: 10 });

  return (
    <div className='flex flex-col items-center gap-3'>
      <span className='text-muted-foreground text-sm font-medium tracking-widest'>GUESTS</span>

      <div className='flex items-center gap-6'>
        <button
          className={cn(counter.value <= 1 && 'opacity-25')}
          data-variant='ghost'
          type='button'
          onClick={() => counter.dec()}
        >
          <MinusIcon size={22} strokeWidth={1.5} />
        </button>

        <span className='w-26 text-center text-7xl font-light tabular-nums'>{counter.value}</span>

        <button
          className={cn(counter.value >= 10 && 'opacity-25')}
          data-variant='ghost'
          type='button'
          onClick={() => counter.inc()}
        >
          <PlusIcon size={22} strokeWidth={1.5} />
        </button>
      </div>

      <span className='text-muted-foreground text-sm'>{getGuestLabel(counter.value)}</span>
    </div>
  );
};

export default Demo;
