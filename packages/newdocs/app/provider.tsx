'use client';

import { TooltipProvider } from '@/ui/tooltip';

import { ThemeProvider } from './_contexts/theme';

interface ProviderProps {
  children: React.ReactNode;
}

export const Provider = ({ children }: ProviderProps) => (
  <TooltipProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </TooltipProvider>
);
