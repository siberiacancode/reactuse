import Link from 'next/link';

import { Button } from '@docs/ui/button';

import { Icons } from './icons';
import { ModeSwitcher } from './mode-switcher';

export const LandingHeader = () => {
  return (
    <header className='sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md'>
      <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-6'>
        <Link className='flex items-center gap-2.5' href='/'>
          <Icons.logo className='h-7 w-7' />
          <span className='font-display text-base font-semibold tracking-wide text-foreground uppercase'>
            reactuse
          </span>
        </Link>

        <div className='flex items-center gap-3'>
          <ModeSwitcher />
          <Link href='/docs/installation'>
            <Button className='h-8 rounded-full px-5 text-sm transition-colors' size='sm'>
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
