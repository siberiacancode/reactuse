'use client'

import { useDisclosure, useLongPress } from '@siberiacancode/reactuse';
import { CheckIcon, Loader2Icon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const THRESHOLD = 1500;

const FEATURES = [
  'Full access to all 50+ hooks',
  'Lifetime updates and new hooks',
  'Private community and chats',
  'Priority support from the team',
  'Exclusive useVue early access'
];

const Demo = () => {
  const success = useDisclosure();
  const [holding, setHolding] = useState(false);

  const longPress = useLongPress<HTMLButtonElement>(
    () => {
      setHolding(false);
      success.open();
    },
    {
      threshold: THRESHOLD,
      onStart: () => setHolding(true),
      onCancel: () => setHolding(false)
    }
  );

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div className='bg-card flex flex-col gap-5 rounded-2xl p-6 shadow-sm'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground text-[10px] tracking-[0.15em] uppercase'>
              Lifetime plan
            </span>
            <span className='rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-semibold text-green-600 dark:text-green-500'>
              Save 90%
            </span>
          </div>
          <div className='flex items-baseline gap-2'>
            <span className='text-foreground text-5xl font-bold tracking-tight tabular-nums'>
              $49
            </span>
            <span className='text-muted-foreground text-lg tabular-nums line-through'>$499</span>
          </div>
          <span className='text-muted-foreground text-xs'>
            ≈ <span className='text-foreground font-semibold'>$0.13</span> per day
          </span>
        </div>

        <div className='flex flex-col gap-2.5'>
          {FEATURES.map((feature) => (
            <div key={feature} className='flex items-center gap-2.5'>
              <span className='bg-foreground/40 size-1.5 shrink-0 rounded-full' />
              <span className='text-foreground text-xs leading-relaxed'>{feature}</span>
            </div>
          ))}
        </div>

        <button
          ref={longPress.ref}
          className={cn(
            'relative flex h-10! w-full items-center justify-center overflow-hidden rounded-full! text-sm font-semibold transition-colors select-none',
            holding ? 'bg-muted text-muted-foreground' : 'bg-white text-neutral-900'
          )}
          data-variant='unstyled'
          disabled={holding}
          type='button'
        >
          {holding && (
            <span className='flex items-center gap-2'>
              <Loader2Icon className='size-4 animate-spin' />
              Processing...
            </span>
          )}
          {!holding && 'Hold to get lifetime access'}
        </button>

        <span className='text-muted-foreground text-center text-[10px]'>
          Press and hold the button to confirm
        </span>
      </div>

      {success.opened && (
        <div
          className='animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-150'
          onClick={success.close}
        >
          <div className='animate-in fade-in zoom-in-95 border-border bg-card relative flex w-full max-w-xs flex-col items-center gap-4 rounded-xl border p-6 text-center shadow-2xl duration-200'>
            <button
              aria-label='Close'
              className='absolute top-3 right-3'
              data-size='icon'
              data-variant='ghost'
              type='button'
              onClick={success.close}
            >
              <XIcon className='size-4' />
            </button>

            <div className='flex size-12 items-center justify-center rounded-full bg-green-500/15'>
              <CheckIcon className='size-6 text-green-600 dark:text-green-500' strokeWidth={3} />
            </div>

            <div className='flex flex-col gap-2'>
              <h3 className='text-foreground text-base font-bold'>You're all set</h3>
              <p className='text-muted-foreground text-xs leading-relaxed'>
                Your lifetime access is now active. Check your inbox for the welcome guide and setup
                instructions.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Demo;
