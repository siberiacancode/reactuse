---
title: useWakeLock
description: Hook that provides a wake lock functionality
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1782026158000
---

# useWakeLock

Hook that provides a wake lock functionality

## Demo

```tsx
import { useWakeLock } from '@siberiacancode/reactuse';
import { MoonIcon } from 'lucide-react';

const INGREDIENTS = [
  '300g pizza dough',
  '100g tomato sauce',
  '200g fresh mozzarella',
  'A handful of basil leaves',
  '2 tbsp olive oil',
  'Salt to taste'
];

const STEPS = [
  'Preheat your oven to 250°C (480°F) with a baking stone or tray inside.',
  'Roll out the dough on a floured surface into a thin, round base.',
  'Spread the tomato sauce evenly, leaving a small border for the crust.',
  'Tear the mozzarella over the top and drizzle with olive oil.',
  'Bake for 10–12 minutes, until the crust is golden and the cheese bubbles.',
  'Finish with fresh basil, a pinch of salt, and serve immediately.'
];

const Demo = () => {
  const wakeLock = useWakeLock({
    immediately: true
  });

  if (!wakeLock.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/WakeLock'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <article className='mx-auto flex w-full max-w-xl flex-col gap-6 p-6'>
      <header className='flex flex-col items-start gap-4'>
        <div className='size-14! shrink-0 text-3xl' data-slot='avatar'>
          <span className='text-3xl!' data-slot='avatar-fallback'>
            🍕
          </span>
        </div>
        <div className='flex flex-col gap-1'>
          <h1 className='text-foreground text-2xl font-bold tracking-tight'>Margherita Pizza</h1>
          <p className='text-muted-foreground text-sm'>
            The classic Neapolitan pizza — simple, fresh, and ready in about 25 minutes.
          </p>
        </div>
      </header>

      <section className='flex flex-col gap-3'>
        <h2 className='text-foreground text-lg font-semibold'>Ingredients</h2>
        <ul className='text-muted-foreground marker:text-muted-foreground/50 flex list-disc flex-col gap-1.5 pl-5 text-base leading-relaxed'>
          {INGREDIENTS.map((ingredient) => (
            <li key={ingredient}>{ingredient}</li>
          ))}
        </ul>
      </section>

      <section className='flex flex-col gap-3'>
        <h2 className='text-foreground text-lg font-semibold'>Method</h2>
        <ol className='text-muted-foreground marker:text-muted-foreground/50 flex list-decimal flex-col gap-3 pl-5 text-base leading-relaxed marker:font-medium'>
          {STEPS.map((step) => (
            <li key={step} className='pl-1'>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <p className='text-muted-foreground border-border flex items-center gap-2 border-t pt-4 text-sm'>
        <MoonIcon className='size-4 shrink-0' />
        Your screen will stay awake while you follow this recipe.
      </p>
    </article>
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
npx useverse@latest add useWakeLock
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

/** The use wake lock options type */
export interface UseWakeLockOptions {
  /** Determines if the wake lock should be automatically reacquired when the document becomes visible. */
  immediately?: boolean;
  /** A string specifying the screen wake lock type. */
  type?: WakeLockType;
}

/** The use wake lock return type */
export interface UseWakeLockReturn {
  /** Indicates if the wake lock is currently active. */
  active: boolean;
  /** Indicates if the Wake Lock API is supported in the current environment. */
  supported: boolean;
  /** Function to release the wake lock. */
  release: () => Promise<void>;
  /** Function to request the wake lock. */
  request: (type?: WakeLockType) => Promise<void>;
}

/**
 * @name useWakeLock
 * @description - Hook that provides a wake lock functionality
 * @category Browser
 * @usage low
 *
 * @browserapi navigator.wakeLock https://developer.mozilla.org/en-US/docs/Web/API/WakeLock
 *
 * @param {boolean} [options.immediately=false] Determines if the wake lock should be automatically reacquired when the document becomes visible
 * @param {WakeLockType} [options.type='screen'] A string specifying the wake lock type
 * @returns {UseWakeLockReturn} An object containing the wake lock state and control methods.
 *
 * @example
 * const { supported, active, request, release } = useWakeLock();
 */
export const useWakeLock = (options?: UseWakeLockOptions): UseWakeLockReturn => {
  const supported =
    typeof navigator !== 'undefined' && 'wakeLock' in navigator && !!navigator.wakeLock;

  const [active, setActive] = useState(false);
  const sentinel = useRef<WakeLockSentinel>(undefined);

  const immediately = options?.immediately ?? false;
  const type = options?.type ?? 'screen';

  const request = async (type?: WakeLockType) => {
    if (!supported) return;

    sentinel.current = await navigator.wakeLock.request(type ?? options?.type);
    sentinel.current.addEventListener('release', () => {
      setActive(false);
      sentinel.current = undefined;
    });

    setActive(true);
  };

  const release = async () => {
    if (!supported || !sentinel.current) return;

    await sentinel.current.release();
    sentinel.current = undefined;
    setActive(false);
  };

  useEffect(() => {
    if (!supported || !immediately || document.visibilityState !== 'visible' || type !== 'screen')
      return;

    const onVisibilityChange = async () => {
      await release();
      await request(type);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [type]);

  return { supported, active, request, release };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { supported, active, request, release } = useWakeLock();
```

## Type Declarations

```tsx
export interface UseWakeLockOptions {
  /** Determines if the wake lock should be automatically reacquired when the document becomes visible. */
  immediately?: boolean;
  /** A string specifying the screen wake lock type. */
  type?: WakeLockType;
}

export interface UseWakeLockReturn {
  /** Indicates if the wake lock is currently active. */
  active: boolean;
  /** Indicates if the Wake Lock API is supported in the current environment. */
  supported: boolean;
  /** Function to release the wake lock. */
  release: () => Promise<void>;
  /** Function to request the wake lock. */
  request: (type?: WakeLockType) => Promise<void>;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.immediately | `boolean` | false | Determines if the wake lock should be automatically reacquired when the document becomes visible |
| options.type | `WakeLockType` | 'screen' | A string specifying the wake lock type |

### Returns

`UseWakeLockReturn` - An object containing the wake lock state and control methods.