'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

export const ThemeProvider = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) => (
    <NextThemesProvider
      disableTransitionOnChange
      enableColorScheme
      enableSystem
      attribute='class'
      defaultTheme='system'
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
