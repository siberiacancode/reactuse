'use client'

import { usePreferredColorScheme } from '@siberiacancode/reactuse';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';

const Demo = () => {
  const preferredColorScheme = usePreferredColorScheme();

  return (
    <section className='flex flex-col items-center gap-3 p-8'>
      <div className='bg-muted text-foreground flex size-12 items-center justify-center rounded-full'>
        {preferredColorScheme === 'light' && <SunIcon className='size-5' />}
        {preferredColorScheme === 'dark' && <MoonIcon className='size-5' />}
        {preferredColorScheme === 'no-preference' && <MonitorIcon className='size-5' />}
      </div>

      <div className='flex flex-col items-center gap-1 text-center'>
        {preferredColorScheme === 'light' && (
          <p className='text-foreground text-sm font-medium'>Light mode is on</p>
        )}
        {preferredColorScheme === 'dark' && (
          <p className='text-foreground text-sm font-medium'>Dark mode is on</p>
        )}
        {preferredColorScheme === 'no-preference' && (
          <p className='text-foreground text-sm font-medium'>No theme set</p>
        )}
        <p className='text-muted-foreground text-xs'>Detected from your system settings</p>
      </div>
    </section>
  );
};

export default Demo;
