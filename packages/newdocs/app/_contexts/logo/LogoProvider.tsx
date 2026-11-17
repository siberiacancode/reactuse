'use client';

import type { ReactNode } from 'react';

import { useCookie } from '@siberiacancode/reactuse';
import { useLayoutEffect } from 'react';

import { COOKIES } from '@/src/constants';

import type { Logo } from './LogoContext';

import { LogoContext } from './LogoContext';

export interface LogoProviderProps {
  children: ReactNode;
}

export const LogoProvider = ({ children }: LogoProviderProps) => {
  const logoCookie = useCookie(COOKIES.LOGO, {
    initialValue: 'classic' as Logo,
    path: '/'
  });
  const logo: Logo = logoCookie.value === 'uwu' ? 'uwu' : 'classic';

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.remove('classic-logo', 'uwu-logo');
    root.classList.add(`${logo}-logo`);
  }, [logo]);

  const value = {
    value: logo,
    toggle: () => logoCookie.set(logo === 'uwu' ? 'classic' : 'uwu', { path: '/' })
  };

  return <LogoContext value={value}>{children}</LogoContext>;
};
