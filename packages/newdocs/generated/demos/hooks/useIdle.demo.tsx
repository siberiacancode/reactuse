'use client'

import { useIdle } from '@siberiacancode/reactuse';

import { cn } from '@/utils/lib';

const IDLE_TIMEOUT = 2500;

const Demo = () => {
  const { idle } = useIdle(IDLE_TIMEOUT);

  return (
    <section className='flex flex-col items-center gap-4 p-4'>
      <div className='border-border bg-card relative w-full max-w-xs overflow-hidden rounded-2xl border p-4'>
        <div className='bg-muted/60 absolute inset-x-0 top-0 h-16' />

        <div className='relative flex items-center gap-3'>
          <div className='relative shrink-0'>
            <div className='ring-background flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 text-sm font-semibold text-white ring-4'>
              SC
            </div>
            <span
              className={cn(
                'ring-background absolute right-0 bottom-0 block size-2.5 rounded-full ring-2 transition-colors',
                idle ? 'bg-amber-500' : 'bg-green-500'
              )}
            />
          </div>

          <div className='flex flex-col items-start gap-0.5'>
            <span className='text-foreground text-sm font-medium'>siberiacancode</span>
            <span className='text-muted-foreground text-xs'>{idle ? 'Away' : 'Online'}</span>
          </div>
        </div>

        <p className='text-muted-foreground relative mt-4 text-[10px] leading-relaxed'>
          Stop moving the mouse and keyboard for a moment to switch to the idle state.
        </p>
      </div>
    </section>
  );
};

export default Demo;
