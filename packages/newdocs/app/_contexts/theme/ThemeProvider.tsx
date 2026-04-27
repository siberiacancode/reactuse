import type { ReactNode } from 'react';

import { getCookie, setCookie, usePreferredColorScheme } from '@siberiacancode/reactuse';
import { useLayoutEffect, useMemo, useState } from 'react';

import { COOKIES } from '@/src/constants';

import type { Theme } from './ThemeContext';

import { ThemeContext } from './ThemeContext';

const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getTheme = (theme: Theme): 'dark' | 'light' => {
  if (theme === 'system') return getSystemTheme();
  return theme;
};

export interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const colorScheme = usePreferredColorScheme();
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    return (getCookie(COOKIES.THEME) as Theme | undefined) ?? 'system';
  });

  useLayoutEffect(() => {
    const root = document.documentElement;
    const activeTheme = getTheme(theme);

    setCookie(COOKIES.THEME, theme, {
      path: '/'
    });
    root.classList.remove('light', 'dark');
    root.classList.add(activeTheme);
  }, [theme, colorScheme]);

  const animate = async (x: number, y: number, theme: Theme) => {
    const radius = Math.hypot(window.innerWidth, window.innerHeight);

    await document.startViewTransition(() => {
      setTheme(theme);
    }).ready;

    document.documentElement.animate(
      {
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]
      },
      {
        duration: 700,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)'
      }
    );
  };

  const value = useMemo(() => ({ value: getTheme(theme), set: setTheme, animate }), [theme]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
};
