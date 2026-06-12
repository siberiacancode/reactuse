'use client';

import { usePreferredDark } from '@siberiacancode/reactuse';
import { MoonIcon, SunIcon } from 'lucide-react';

const Demo = () => {
  const isDark = usePreferredDark();

  return (
    <section className='flex flex-col items-center gap-3 p-8'>
      <div className='bg-muted text-foreground flex size-12 items-center justify-center rounded-full'>
        {isDark ? <MoonIcon className='size-5' /> : <SunIcon className='size-5' />}
      </div>

      <div className='flex flex-col items-center gap-1 text-center'>
        <p className='text-foreground text-sm font-medium'>
          {isDark ? 'Dark mode is on' : 'Light mode is on'}
        </p>
        <p className='text-muted-foreground text-xs'>Detected from your system settings</p>
      </div>
    </section>
  );
};

export default Demo;
