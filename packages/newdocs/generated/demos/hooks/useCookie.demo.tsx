'use client'

import { getCookie, useCookie } from '@siberiacancode/reactuse';
import { MoonIcon, SunIcon } from 'lucide-react';

type Theme = 'dark' | 'light';

const getInitialTheme = (): Theme => {
  const cookieTheme = getCookie('reactuse_docs_theme') as Theme | undefined;
  if (cookieTheme === 'dark' || cookieTheme === 'light') return cookieTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const Demo = () => {
  const themeCookie = useCookie<Theme>('reactuse_docs_theme', {
    initialValue: getInitialTheme,
    path: '/'
  });

  const onToggle = () => {
    const nextTheme = themeCookie.value === 'dark' ? 'light' : 'dark';
    themeCookie.set(nextTheme, { path: '/' });
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(themeCookie.value);
  };

  return (
    <section className='flex w-full max-w-sm flex-col items-center gap-3 p-8'>
      <button
        aria-label='Toggle theme'
        className='rounded-full!'
        data-size='icon'
        data-variant='outline'
        type='button'
        onClick={onToggle}
      >
        {themeCookie.value === 'dark' && <MoonIcon className='text-foreground size-5' />}
        {themeCookie.value === 'light' && <SunIcon className='text-foreground size-5' />}
      </button>
    </section>
  );
};

export default Demo;
