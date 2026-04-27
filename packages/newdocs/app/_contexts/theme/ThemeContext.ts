import { createContext } from 'react';

export type Theme = 'dark' | 'light' | 'system';

export interface ThemeContextValue {
  value: Exclude<Theme, 'system'>;
  animate: (x: number, y: number, theme: Theme) => Promise<void>;
  set: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  value: 'light',
  set: () => {},
  animate: async () => {}
});
