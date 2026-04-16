import type { ReactNode } from 'react';

import { ThemeProvider } from '@docs/components/theme-provider';
import { cn } from '@docs/lib/utils';
import { TooltipProvider } from '@docs/ui/tooltip';
import { Geist } from 'next/font/google';

import '../styles/global.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const Layout = ({ children }: { children: ReactNode }) => (
  <html suppressHydrationWarning className={cn('font-sans', geist.variable)} lang='en'>
    <body className='mb-10 flex min-h-screen flex-col'>
      <TooltipProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </TooltipProvider>
    </body>
  </html>
);

export default Layout;
