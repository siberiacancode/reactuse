import type { ReactNode } from 'react';

import { ThemeProvider } from '@docs/components/theme-provider';
import { cn } from '@docs/lib/utils';
import { TooltipProvider } from '@docs/ui/tooltip';
import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google';

import '../styles/global.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export const Layout = ({ children }: { children: ReactNode }) => (
  <html
    suppressHydrationWarning
    className={cn('font-sans', geist.variable, geistMono.variable, jetbrainsMono.variable)}
    lang='en'
  >
    <body className='mb-10 flex min-h-screen flex-col'>
      <TooltipProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </TooltipProvider>
    </body>
  </html>
);

export default Layout;
