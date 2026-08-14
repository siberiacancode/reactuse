---
title: useWindowSize
description: Hook that manages a window size
category: sensors
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1782054576000
---

# useWindowSize

Hook that manages a window size

## Demo

```tsx
import { useWindowSize } from '@siberiacancode/reactuse';

const DISHES = [
  { emoji: '🍕', name: 'Pizza', place: 'Naples' },
  { emoji: '🍣', name: 'Sushi', place: 'Tokyo' },
  { emoji: '🥐', name: 'Croissant', place: 'Paris' },
  { emoji: '🌮', name: 'Tacos', place: 'Mexico City' },
  { emoji: '🍜', name: 'Ramen', place: 'Osaka' },
  { emoji: '🥘', name: 'Paella', place: 'Valencia' }
];

const Demo = () => {
  const windowSize = useWindowSize();
  const { width } = windowSize.watch();

  const view = width >= 1024 ? 'desktop' : width >= 768 ? 'tablet' : 'mobile';

  if (view === 'mobile') {
    return (
      <section className='flex justify-center p-6'>
        <div className='relative flex h-107.5 w-66 flex-col gap-4 overflow-hidden rounded-4xl border px-4 pt-12 pb-4'>
          <div className='bg-border absolute top-3 left-1/2 h-5 w-22 -translate-x-1/2 rounded-full' />

          <div className='flex items-center justify-between px-1'>
            <h3 className='text-3xl!'>Mobile view</h3>
          </div>

          <p className='text-muted-foreground px-1 text-sm'>
            A compact layout for small screens. Dishes are stacked into a single column with
            tap-friendly actions and short, scannable copy.
          </p>

          <div className='flex flex-col gap-2'>
            {DISHES.slice(0, 3).map((dish) => (
              <div
                key={dish.name}
                className='bg-muted flex items-center gap-3 rounded-2xl px-3 py-2'
              >
                <div data-size='lg' data-slot='avatar'>
                  <span data-slot='avatar-fallback'>{dish.emoji}</span>
                </div>
                <div className='flex-1'>
                  <p className='text-sm font-medium'>{dish.name}</p>
                  <p className='text-muted-foreground text-xs'>{dish.place}</p>
                </div>
                <button className='rounded-lg px-2 py-1 text-xs' type='button'>
                  Order
                </button>
              </div>
            ))}
            <p className='text-muted-foreground text-center text-xs'>+3 more</p>
          </div>
        </div>
      </section>
    );
  }

  if (view === 'tablet') {
    return (
      <section className='flex justify-center p-6'>
        <div className='relative flex h-[440px] w-96 flex-col gap-4 overflow-hidden rounded-3xl border px-5 pt-10 pb-5'>
          <div className='bg-border absolute top-4 left-1/2 size-2 -translate-x-1/2 rounded-full' />

          <div className='flex items-center justify-between'>
            <h3 className='text-xl!'>Tablet view</h3>
          </div>

          <p className='text-muted-foreground text-sm'>
            A balanced layout for medium screens. There's room to browse comfortably with a tidy
            two-column grid of dishes.
          </p>

          <div className='grid grid-cols-2 gap-2'>
            {DISHES.slice(0, 4).map((dish) => (
              <div key={dish.name} className='bg-muted flex flex-col gap-1.5 rounded-2xl p-3'>
                <div data-size='lg' data-slot='avatar'>
                  <span data-slot='avatar-fallback'>{dish.emoji}</span>
                </div>
                <div>
                  <p className='text-sm font-medium'>{dish.name}</p>
                  <p className='text-muted-foreground text-xs'>{dish.place}</p>
                </div>
                <button className='rounded-lg py-1 text-xs font-medium' type='button'>
                  Order
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='flex justify-center p-6'>
      <div className='flex flex-col items-center'>
        <div className='relative flex h-80 w-[480px] flex-col gap-4 overflow-hidden rounded-xl border px-6 pt-9 pb-5'>
          <div className='bg-border absolute top-0 left-1/2 h-2 w-16 -translate-x-1/2 rounded-b-md' />

          <div className='flex items-center justify-between'>
            <h3 className='text-4xl!'>Desktop view</h3>
          </div>

          <p className='text-muted-foreground text-sm'>
            A wide layout for large displays. Dishes spread across three columns with richer detail
            and room to compare them side by side.
          </p>

          <div className='mt-5 grid grid-cols-3 gap-2'>
            {DISHES.map((dish) => (
              <div key={dish.name} className='bg-muted flex flex-col gap-1.5 rounded-xl p-2.5'>
                <div data-slot='avatar'>
                  <span data-slot='avatar-fallback'>{dish.emoji}</span>
                </div>
                <div>
                  <p className='text-xs font-medium'>{dish.name}</p>
                  <p className='text-muted-foreground text-[10px]'>{dish.place}</p>
                </div>
                <button className='rounded-lg py-0.5 text-[10px] font-medium' type='button'>
                  Order
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-muted h-1.5 w-[540px] rounded-b-lg' />
        <div className='bg-muted/60 -mt-1 h-1 w-20 rounded-b-md' />
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
npx useverse@latest add useWindowSize
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef } from 'react';

import { useRerender } from '../useRerender/useRerender';

/** The use window size params type */
export interface UseWindowSizeOptions {
  /** Whether to include the scrollbar in the window size calculation */
  includeScrollbar?: boolean;
}

/** The use window size value type */
export interface UseWindowSizeValue {
  /** The current window height */
  height: number;
  /** The current window width */
  width: number;
}

/** The use window size return type */
export interface UseWindowSizeReturn {
  /** The latest window size snapshot */
  snapshot: UseWindowSizeValue;
  /** Function to enable subscriptions and rerender on next updates */
  watch: () => UseWindowSizeValue;
}

export type UseWindowSizeCallback = (value: UseWindowSizeValue, event: Event) => void;

export interface UseWindowSize {
  (callback?: UseWindowSizeCallback, options?: UseWindowSizeOptions): UseWindowSizeReturn;
  (options?: UseWindowSizeOptions): UseWindowSizeReturn;
}

/**
 * @name useWindowSize
 * @description - Hook that manages a window size
 * @category Sensors
 * @usage low
 *
 * @overload
 * @param {(value: UseWindowSizeValue, event: Event) => void} [callback] The callback to invoke on window size updates
 * @param {boolean} [options.includeScrollbar=true] Whether to include the scrollbar in the window size calculation
 * @returns {UseWindowSizeReturn} An object containing the latest window size snapshot and watch function
 *
 * @example
 * const { snapshot, watch } = useWindowSize((value) => console.log(value));
 *
 * @overload
 * @param {boolean} [options.includeScrollbar=true] Whether to include the scrollbar in the window size calculation
 * @returns {UseWindowSizeReturn} An object containing the latest window size snapshot and watch function
 *
 * @example
 * const { snapshot, watch } = useWindowSize();
 */
export const useWindowSize = ((...params: any[]) => {
  const callback =
    typeof params[0] === 'function' ? (params[0] as UseWindowSizeCallback | undefined) : undefined;
  const options = (callback ? params[1] : params[0]) as UseWindowSizeOptions | undefined;
  const includeScrollbar = options?.includeScrollbar ?? true;

  const getSize = (): UseWindowSizeValue => {
    if (typeof window === 'undefined') {
      return {
        width: Number.POSITIVE_INFINITY,
        height: Number.POSITIVE_INFINITY
      };
    }

    return {
      width: includeScrollbar ? window.innerWidth : window.document.documentElement.clientWidth,
      height: includeScrollbar ? window.innerHeight : window.document.documentElement.clientHeight
    };
  };

  const snapshotRef = useRef<UseWindowSizeValue>(getSize());
  const callbackRef = useRef(callback);
  const watchingRef = useRef(false);
  const rerender = useRerender();

  callbackRef.current = callback;

  const watch = () => {
    watchingRef.current = true;
    return snapshotRef.current;
  };

  useEffect(() => {
    const updateValue = () => {
      snapshotRef.current = getSize();
      if (watchingRef.current) rerender();
    };

    updateValue();

    if (typeof window === 'undefined') return;

    const onResize = (event: Event) => {
      updateValue();
      callbackRef.current?.(snapshotRef.current, event);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [includeScrollbar]);

  return { snapshot: snapshotRef.current, watch };
}) as UseWindowSize;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { snapshot, watch } = useWindowSize((value) => console.log(value));
// or
const { snapshot, watch } = useWindowSize();
```

## Type Declarations

```tsx
export interface UseWindowSizeOptions {
  /** Whether to include the scrollbar in the window size calculation */
  includeScrollbar?: boolean;
}

export interface UseWindowSizeValue {
  /** The current window height */
  height: number;
  /** The current window width */
  width: number;
}

export interface UseWindowSizeReturn {
  /** The latest window size snapshot */
  snapshot: UseWindowSizeValue;
  /** Function to enable subscriptions and rerender on next updates */
  watch: () => UseWindowSizeValue;
}

export type UseWindowSizeCallback = (value: UseWindowSizeValue, event: Event) => void;

export interface UseWindowSize {
  (callback?: UseWindowSizeCallback, options?: UseWindowSizeOptions): UseWindowSizeReturn;
  (options?: UseWindowSizeOptions): UseWindowSizeReturn;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(value: UseWindowSizeValue, event: Event) => void` | - | The callback to invoke on window size updates |
| options.includeScrollbar | `boolean` | true | Whether to include the scrollbar in the window size calculation |

#### Returns

`UseWindowSizeReturn` - An object containing the latest window size snapshot and watch function

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.includeScrollbar | `boolean` | true | Whether to include the scrollbar in the window size calculation |

#### Returns

`UseWindowSizeReturn` - An object containing the latest window size snapshot and watch function