---
title: useOrientation
description: Hook that provides the current screen orientation
category: sensors
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1781981977000
---

# useOrientation

Hook that provides the current screen orientation

## Demo

```tsx
import { useMediaQuery, useOrientation } from '@siberiacancode/reactuse';

const Demo = () => {
  const orientation = useOrientation();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (!orientation.supported || !orientation.value)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  if (isDesktop) {
    return (
      <section className='flex justify-center p-6'>
        <div className='flex flex-col items-center'>
          <div className='relative flex h-80 w-[480px] flex-col gap-4 overflow-hidden rounded-xl border px-6 pt-9 pb-5'>
            <div className='bg-border absolute top-0 left-1/2 h-2 w-16 -translate-x-1/2 rounded-b-md' />

            <div className='flex items-center justify-between'>
              <h3 className='text-4xl!'>Desktop orientation</h3>
            </div>

            <p className='text-muted-foreground text-sm'>
              Screen orientation does not change on <b>desktop</b> displays — they don't rotate.
              Open this page on a mobile device or use your browser's device inspector to see the
              orientation change in action.
            </p>
          </div>

          <div className='bg-muted h-1.5 w-[540px] rounded-b-lg' />
          <div className='bg-muted/60 -mt-1 h-1 w-20 rounded-b-md' />
        </div>
      </section>
    );
  }

  const portrait = orientation.value.orientationType?.startsWith('portrait') ?? true;

  return (
    <section className='flex flex-col items-center gap-5 p-6'>
      <p className='text-muted-foreground max-w-xs text-center text-sm'>
        Rotate your device or use your browser's inspector to simulate an orientation change.
      </p>

      <div className='mt-4 flex items-center justify-center'>
        <div
          style={{
            width: portrait ? 200 : 340,
            height: portrait ? 340 : 200
          }}
          className='border-foreground/20 relative flex shrink-0 flex-col items-center justify-center gap-1 rounded-[2rem] border-[3px] transition-all duration-500 ease-in-out'
        >
          <div
            className={
              portrait
                ? 'bg-foreground/15 absolute top-3 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full'
                : 'bg-foreground/15 absolute top-1/2 left-3 h-10 w-1 -translate-y-1/2 rounded-full'
            }
          />

          <span className='text-foreground text-xl font-semibold'>
            {portrait ? 'Portrait' : 'Landscape'}
          </span>
          <span className='text-muted-foreground text-sm tabular-nums'>
            {orientation.value.angle}°
          </span>
        </div>
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
npx useverse@latest add useOrientation
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

declare global {
  interface ScreenOrientation {
    lock: (orientation: OrientationLockType) => Promise<void>;
  }
}

/* The use device orientation value type */
export interface UseOrientationValue {
  /** The current angle */
  angle: number;
  /** The current orientation type */
  orientationType?: OrientationType;
}

/* The screen lock orientation type */
export type OrientationLockType =
  | 'any'
  | 'landscape-primary'
  | 'landscape-secondary'
  | 'landscape'
  | 'natural'
  | 'portrait-primary'
  | 'portrait-secondary'
  | 'portrait';

/* The use device orientation return type */
export interface useOrientationReturn {
  /** Whether the screen orientation is supported */
  supported: boolean;
  /** The current screen orientation value */
  value: UseOrientationValue;
  /** Lock the screen orientation */
  lock: (orientation: OrientationLockType) => void;
  /** Unlock the screen orientation */
  unlock: () => void;
}

/**
 * @name useOrientation
 * @description - Hook that provides the current screen orientation
 * @category Sensors
 * @usage low
 *
 * @browserapi screen.orientation https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
 *
 * @param {(value: UseOrientationValue) => void} [callback] The callback invoked when the orientation changes
 * @returns {useOrientationReturn} The current screen orientation
 *
 * @example
 * const { supported, value, lock, unlock } = useOrientation();
 */
export const useOrientation = (
  callback?: (value: UseOrientationValue) => void
): useOrientationReturn => {
  const supported =
    typeof window !== 'undefined' &&
    'screen' in window &&
    'orientation' in window.screen &&
    !!window.screen.orientation;
  const orientation = (supported ? window.screen.orientation : {}) as ScreenOrientation;

  const [value, setValue] = useState<UseOrientationValue>({
    angle: orientation.angle ?? 0,
    orientationType: orientation.type
  });
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    if (!supported) return;

    const onOrientationChange = () => {
      const nextValue = {
        angle: window.screen.orientation.angle,
        orientationType: window.screen.orientation.type
      };

      setValue(nextValue);
      internalCallbackRef.current?.(nextValue);
    };

    window.addEventListener('orientationchange', onOrientationChange);
    return () => {
      window.removeEventListener('orientationchange', onOrientationChange);
    };
  }, []);

  const lock = (type: OrientationLockType) => {
    if (supported && typeof orientation.lock === 'function') return orientation.lock(type);
  };

  const unlock = () => {
    if (supported && typeof orientation.unlock === 'function') orientation.unlock();
  };

  return {
    supported,
    value,
    lock,
    unlock
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { supported, value, lock, unlock } = useOrientation();
```

## Type Declarations

```tsx
interface ScreenOrientation {
    lock: (orientation: OrientationLockType) => Promise<void>;
  }

export interface UseOrientationValue {
  /** The current angle */
  angle: number;
  /** The current orientation type */
  orientationType?: OrientationType;
}

export type OrientationLockType =
  | 'any'
  | 'landscape-primary'
  | 'landscape-secondary'
  | 'landscape'
  | 'natural'
  | 'portrait-primary'
  | 'portrait-secondary'
  | 'portrait';

export interface useOrientationReturn {
  /** Whether the screen orientation is supported */
  supported: boolean;
  /** The current screen orientation value */
  value: UseOrientationValue;
  /** Lock the screen orientation */
  lock: (orientation: OrientationLockType) => void;
  /** Unlock the screen orientation */
  unlock: () => void;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(value: UseOrientationValue) => void` | - | The callback invoked when the orientation changes |

### Returns

`useOrientationReturn` - The current screen orientation