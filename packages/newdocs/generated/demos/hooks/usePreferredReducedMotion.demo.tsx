'use client';

import { usePreferredReducedMotion } from '@siberiacancode/reactuse';
import { Loader2Icon } from 'lucide-react';

import { cn } from '@/utils/lib';

const Demo = () => {
  const motion = usePreferredReducedMotion();

  const reduced = motion === 'reduce';

  return (
    <section className='flex flex-col items-center gap-4 p-8'>
      <div className='bg-muted text-foreground flex size-12 items-center justify-center rounded-full'>
        <Loader2Icon className={cn('size-5', !reduced && 'animate-spin')} />
      </div>

      <div className='flex flex-col items-center gap-1 text-center'>
        <p className='text-foreground text-sm font-medium'>
          {reduced ? 'Reduced motion is on' : 'Animations are enabled'}
        </p>
        <p className='text-muted-foreground text-xs'>
          {reduced
            ? 'The spinner stays still to respect your setting'
            : 'The spinner animates — turn on reduced motion to stop it'}
        </p>
      </div>
    </section>
  );
};

export default Demo;
