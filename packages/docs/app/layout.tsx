import type { ReactNode } from 'react';
import { ThemeProvider } from '@docs/components/theme-provider';
import { TooltipProvider } from '@docs/ui/tooltip';

import { Geist } from 'next/font/google';
import { cn } from '@docs/lib/utils';

import '../styles/global.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning className={cn('font-sans', geist.variable)}>
      <body className='mb-10 flex min-h-screen flex-col'>
        <TooltipProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
