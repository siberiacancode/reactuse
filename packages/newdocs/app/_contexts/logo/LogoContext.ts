'use client';

import { createContext } from 'react';

export type Logo = 'classic' | 'uwu';

export interface LogoContextValue {
  value: Logo;
  toggle: () => void;
}

export const LogoContext = createContext<LogoContextValue>({
  value: 'classic',
  toggle: () => {}
});
