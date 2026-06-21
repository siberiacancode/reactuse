'use client'

import { useWindowFocus } from '@siberiacancode/reactuse';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const Demo = () => {
  const focused = useWindowFocus();

  return (
    <section className='flex flex-col p-4'>
      <div className='bg-card flex w-fit items-center gap-3 rounded-xl p-4'>
        <div className='bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg'>
          {focused ? <EyeIcon className='size-5' /> : <EyeOffIcon className='size-5' />}
        </div>

        <div className='flex flex-col leading-tight'>
          <span className='text-foreground text-sm font-medium whitespace-nowrap'>
            {focused ? "You're viewing this page" : 'You left this tab'}
          </span>
          <span className='text-muted-foreground text-xs whitespace-nowrap'>
            {focused ? 'The tab is active and in focus' : 'Come back anytime to continue'}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Demo;
