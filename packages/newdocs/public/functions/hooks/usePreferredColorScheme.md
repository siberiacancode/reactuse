---
title: usePreferredColorScheme
description: Hook that returns user preferred color scheme
category: user
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# usePreferredColorScheme

Hook that returns user preferred color scheme

## Demo

```tsx
import { usePreferredColorScheme } from '@siberiacancode/reactuse';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';

const Demo = () => {
  const preferredColorScheme = usePreferredColorScheme();

  return (
    <section className='flex flex-col items-center gap-3 p-8'>
      <div className='bg-muted text-foreground flex size-12 items-center justify-center rounded-full'>
        {preferredColorScheme === 'light' && <SunIcon className='size-5' />}
        {preferredColorScheme === 'dark' && <MoonIcon className='size-5' />}
        {preferredColorScheme === 'no-preference' && <MonitorIcon className='size-5' />}
      </div>

      <div className='flex flex-col items-center gap-1 text-center'>
        {preferredColorScheme === 'light' && (
          <p className='text-foreground text-sm font-medium'>Light mode is on</p>
        )}
        {preferredColorScheme === 'dark' && (
          <p className='text-foreground text-sm font-medium'>Dark mode is on</p>
        )}
        {preferredColorScheme === 'no-preference' && (
          <p className='text-foreground text-sm font-medium'>No theme set</p>
        )}
        <p className='text-muted-foreground text-xs'>Detected from your system settings</p>
      </div>
    </section>
  );
};

export default Demo;
```

## Installation

### Library

```bash
npm install @siberiacancode/reactuse
```

### CLI

```bash
npx useverse@latest add usePreferredColorScheme
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useMediaQuery } from '../useMediaQuery/useMediaQuery';

/** The use preferred color scheme return type */
export type UsePreferredColorSchemeReturn = 'dark' | 'light' | 'no-preference';

/**
 * @name usePreferredColorScheme
 * @description - Hook that returns user preferred color scheme
 * @category User
 * @usage medium
 *
 * @returns {UsePreferredColorSchemeReturn} String of preferred color scheme
 *
 * @example
 * const colorScheme = usePreferredColorScheme();
 */
export const usePreferredColorScheme = (): UsePreferredColorSchemeReturn => {
  const isLight = useMediaQuery('(prefers-color-scheme: light)');
  const isDark = useMediaQuery('(prefers-color-scheme: dark)');

  if (isLight) return 'light';
  if (isDark) return 'dark';
  return 'no-preference';
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const colorScheme = usePreferredColorScheme();
```

## Type Declarations

```tsx
export type UsePreferredColorSchemeReturn = 'dark' | 'light' | 'no-preference';
```

## API

### Returns

`UsePreferredColorSchemeReturn` - String of preferred color scheme