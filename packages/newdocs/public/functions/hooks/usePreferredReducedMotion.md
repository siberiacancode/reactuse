---
title: usePreferredReducedMotion
description: Hook that returns the reduced motion preference
category: user
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# usePreferredReducedMotion

Hook that returns the reduced motion preference

## Demo

```tsx
import { usePreferredReducedMotion } from '@siberiacancode/reactuse';
import { Loader2Icon } from 'lucide-react';

import { cn } from '@/utils/lib';

const Demo = () => {
  const motion = usePreferredReducedMotion();

  const reduced = motion === 'reduce';

  return (
    <section className='flex flex-col items-center gap-4 p-8'>
      <div className='bg-muted text-foreground flex size-12 items-center justify-center rounded-full'>
        <Loader2Icon className={cn('size-5', !reduced && 'animate-spin')} />
      </div>

      <div className='flex flex-col items-center gap-1 text-center'>
        <p className='text-foreground text-sm font-medium'>
          {reduced ? 'Reduced motion is on' : 'Animations are enabled'}
        </p>
        <p className='text-muted-foreground text-xs'>
          {reduced
            ? 'The spinner stays still to respect your setting'
            : 'The spinner animates — turn on reduced motion to stop it'}
        </p>
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
npx useverse@latest add usePreferredReducedMotion
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useMediaQuery } from '../useMediaQuery/useMediaQuery';

/** The use preferred reduced motion return type */
export type UsePreferredReducedMotionReturn = 'no-preference' | 'reduce';

/**
 * @name usePreferredReducedMotion
 * @description - Hook that returns the reduced motion preference
 * @category User
 * @usage low
 *
 * @returns {UsePreferredReducedMotionReturn} The reduced motion preference
 *
 * @example
 * const reduced = usePreferredReducedMotion();
 */
export const usePreferredReducedMotion = (): UsePreferredReducedMotionReturn => {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  return reduced ? 'reduce' : 'no-preference';
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const reduced = usePreferredReducedMotion();
```

## Type Declarations

```tsx
export type UsePreferredReducedMotionReturn = 'no-preference' | 'reduce';
```

## API

### Returns

`UsePreferredReducedMotionReturn` - The reduced motion preference