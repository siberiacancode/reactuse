import type { ReactNode } from 'react';

import { cn } from '@docs/lib/utils';
import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google';

import { ThemeScript } from './_scripts';
import { Provider } from './provider';

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
    <head>
      <ThemeScript />
    </head>
    <body className='mb-10 flex min-h-screen flex-col'>
      <Provider>{children}</Provider>
    </body>
  </html>
);

export default Layout;
