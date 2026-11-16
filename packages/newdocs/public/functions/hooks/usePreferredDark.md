---
title: usePreferredDark
description: Hook that returns if the user prefers dark mode
category: user
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# usePreferredDark

Hook that returns if the user prefers dark mode

## Demo

```tsx
import { usePreferredDark } from '@siberiacancode/reactuse';
import { MoonIcon, SunIcon } from 'lucide-react';

const Demo = () => {
  const isDark = usePreferredDark();

  return (
    <section className='flex flex-col items-center gap-3 p-8'>
      <div className='bg-muted text-foreground flex size-12 items-center justify-center rounded-full'>
        {isDark ? <MoonIcon className='size-5' /> : <SunIcon className='size-5' />}
      </div>

      <div className='flex flex-col items-center gap-1 text-center'>
        <p className='text-foreground text-sm font-medium'>
          {isDark ? 'Dark mode is on' : 'Light mode is on'}
        </p>
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
npx useverse@latest add usePreferredDark
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useMediaQuery } from '../useMediaQuery/useMediaQuery';

/**
 * @name usePreferredDark
 * @description - Hook that returns if the user prefers dark mode
 * @category User
 * @usage medium
 *
 * @example
 * const isDark = usePreferredDark();
 */
export const usePreferredDark = () => useMediaQuery('(prefers-color-scheme: dark)');
```

Update the import paths to match your project setup.

## Usage

```tsx
const isDark = usePreferredDark();
```