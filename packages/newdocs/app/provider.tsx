import type { ReactNode } from 'react';

import { TooltipProvider } from '@/src/components/ui/tooltip';

import { ThemeProvider } from './_contexts/theme/ThemeProvider';

interface ProviderProps {
  children: ReactNode;
}

export const Provider = ({ children }: ProviderProps) => (
  <TooltipProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </TooltipProvider>
);
