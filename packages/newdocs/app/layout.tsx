import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google';
import process from 'node:process';

import { CONFIG } from '@/src/constants';
import { cn } from '@/src/lib';

import { ThemeScript } from './_scripts';
import { Provider } from './provider';

import '../styles/global.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000/new'),
  title: {
    default: CONFIG.NAME,
    template: '%s'
  },
  description: CONFIG.DESCRIPTION,
  applicationName: CONFIG.NAME,
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  }
};

interface RootLayoutProps {
  children: ReactNode;
}

export const RootLayout = ({ children }: RootLayoutProps) => (
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

export default RootLayout;
