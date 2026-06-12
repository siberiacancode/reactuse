'use client';

import { usePreferredContrast } from '@siberiacancode/reactuse';
import { CircleIcon, ContrastIcon, SlidersHorizontalIcon } from 'lucide-react';

const Demo = () => {
  const contrast = usePreferredContrast();

  return (
    <section className='flex flex-col items-center gap-3 p-8'>
      <div className='bg-muted text-foreground flex size-12 items-center justify-center rounded-full'>
        {contrast === 'more' && <ContrastIcon className='size-5' />}
        {contrast === 'less' && <CircleIcon className='size-5' />}
        {contrast === 'custom' && <SlidersHorizontalIcon className='size-5' />}
        {contrast === 'no-preference' && <ContrastIcon className='size-5' />}
      </div>

      <div className='flex flex-col items-center gap-1 text-center'>
        {contrast === 'more' && (
          <p className='text-foreground text-sm font-medium'>Higher contrast preferred</p>
        )}
        {contrast === 'less' && (
          <p className='text-foreground text-sm font-medium'>Lower contrast preferred</p>
        )}
        {contrast === 'custom' && (
          <p className='text-foreground text-sm font-medium'>Custom contrast preferred</p>
        )}
        {contrast === 'no-preference' && (
          <p className='text-foreground text-sm font-medium'>Standard contrast</p>
        )}
        <p className='text-muted-foreground text-xs'>Detected from your system settings</p>
      </div>
    </section>
  );
};

export default Demo;
