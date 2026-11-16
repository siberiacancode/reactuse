'use client';

import { useLogo } from '@/app/_contexts/logo';

export const LogoToggle = () => {
  const logo = useLogo();

  return (
    <button
      suppressHydrationWarning
      aria-pressed={logo.value === 'uwu'}
      className='text-muted-foreground hover:text-foreground w-fit cursor-pointer text-xs font-medium transition-colors'
      type='button'
      onClick={logo.toggle}
    >
      <span className='[.classic-logo_&]:hidden'>no uwu plz</span>
      <span className='hidden [.classic-logo_&]:inline'>uwu?</span>
    </button>
  );
};
