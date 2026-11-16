import type { ReactNode } from 'react';

import { TooltipProvider } from '@/src/components/ui/tooltip';

import { LogoProvider } from './_contexts/logo';
import { ThemeProvider } from './_contexts/theme';

interface ProviderProps {
  children: ReactNode;
}

export const Provider = ({ children }: ProviderProps) => (
  <TooltipProvider>
    <ThemeProvider>
      <LogoProvider>{children}</LogoProvider>
    </ThemeProvider>
  </TooltipProvider>
);
