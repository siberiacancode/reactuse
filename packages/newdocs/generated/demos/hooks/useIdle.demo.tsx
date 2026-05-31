'use client'

import { useIdle } from '@siberiacancode/reactuse';

import { cn } from '@/utils/lib';

const IDLE_TIMEOUT = 2500;

const Demo = () => {
  const { idle } = useIdle(IDLE_TIMEOUT);

  return (
    <section className='flex flex-col items-center p-4'>
      <div className='flex w-full max-w-xs items-center gap-3'>
        <div className='relative shrink-0'>
          <div className='flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 text-sm font-semibold text-white'>
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
          <span className='text-sm font-medium'>siberiacancode</span>
          <span className='text-muted-foreground text-xs'>Opensource team</span>
        </div>
      </div>
    </section>
  );
};

export default Demo;
