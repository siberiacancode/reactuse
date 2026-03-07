import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/ui/tooltip';
import { RootProvider } from 'fumadocs-ui/provider/next';

import { Geist } from 'next/font/google';
import { cn } from '@/lib/utils';

import '@/styles/global.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning className={cn('font-sans', geist.variable)}>
      <body className='mb-10 flex min-h-screen flex-col'>
        <RootProvider>
          <TooltipProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </TooltipProvider>
        </RootProvider>
      </body>
    </html>
  );
}
