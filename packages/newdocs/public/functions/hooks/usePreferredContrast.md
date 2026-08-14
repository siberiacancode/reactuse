---
title: usePreferredContrast
description: Hook that returns the contrast preference
category: user
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# usePreferredContrast

Hook that returns the contrast preference

## Demo

```tsx
import { usePreferredContrast } from '@siberiacancode/reactuse';
import { CircleIcon, ContrastIcon, SlidersHorizontalIcon } from 'lucide-react';

const Demo = () => {
  const contrast = usePreferredContrast();

  return (
    <section className='flex flex-col items-center gap-3 p-8'>
      <div className='bg-muted text-foreground flex size-12 items-center justify-center rounded-full'>
        {contrast === 'more' && <ContrastIcon className='size-5' />}
        {contrast === 'less' && <CircleIcon className='size-5' />}
        {contrast === 'custom' && <SlidersHorizontalIcon className='size-5' />}
        {contrast === 'no-preference' && <ContrastIcon className='size-5' />}
      </div>

      <div className='flex flex-col items-center gap-1 text-center'>
        {contrast === 'more' && (
          <p className='text-foreground text-sm font-medium'>Higher contrast preferred</p>
        )}
        {contrast === 'less' && (
          <p className='text-foreground text-sm font-medium'>Lower contrast preferred</p>
        )}
        {contrast === 'custom' && (
          <p className='text-foreground text-sm font-medium'>Custom contrast preferred</p>
        )}
        {contrast === 'no-preference' && (
          <p className='text-foreground text-sm font-medium'>Standard contrast</p>
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
npx useverse@latest add usePreferredContrast
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useMediaQuery } from '../useMediaQuery/useMediaQuery';

/** The use preferred contrast return type */
export type UsePreferredContrastReturn = 'custom' | 'less' | 'more' | 'no-preference';

/**
 * @name usePreferredContrast
 * @description - Hook that returns the contrast preference
 * @category User
 * @usage medium
 *
 * @returns {UsePreferredContrastReturn} The contrast preference
 *
 * @example
 * const contrast = usePreferredContrast();
 */
export const usePreferredContrast = (): UsePreferredContrastReturn => {
  const more = useMediaQuery('(prefers-contrast: more)');
  const less = useMediaQuery('(prefers-contrast: less)');
  const custom = useMediaQuery('(prefers-contrast: custom)');
  return more ? 'more' : less ? 'less' : custom ? 'custom' : 'no-preference';
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const contrast = usePreferredContrast();
```

## Type Declarations

```tsx
export type UsePreferredContrastReturn = 'custom' | 'less' | 'more' | 'no-preference';
```

## API

### Returns

`UsePreferredContrastReturn` - The contrast preference