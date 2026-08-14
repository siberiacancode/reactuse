---
title: useSize
description: Hook that observes and returns the width and height of element
category: elements
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1781528880000
---

# useSize

Hook that observes and returns the width and height of element

## Demo

```tsx
import { useSize } from '@siberiacancode/reactuse';
import { PlusIcon, SparklesIcon } from 'lucide-react';
import { useRef } from 'react';

const Demo = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  const size = useSize<HTMLDivElement>((value) => {
    if (cardRef.current) cardRef.current.dataset.wide = String(value.width >= 320);
  });

  return (
    <section className='flex flex-col items-center gap-3 p-4'>
      <div
        ref={size.ref}
        className='border-border relative min-h-[160px] max-w-full min-w-[200px] overflow-hidden rounded-xl border'
        style={{ resize: 'both' }}
      >
        <span className='absolute top-2 right-2 z-10' data-slot='badge'>
          <SparklesIcon className='size-3' />
          New
        </span>

        <div
          ref={cardRef}
          className='group flex h-full flex-col data-[wide=true]:flex-row'
          data-wide='false'
        >
          <div className='bg-muted flex h-32 w-full shrink-0 items-center justify-center text-8xl group-data-[wide=true]:h-full group-data-[wide=true]:w-32 group-data-[wide=true]:text-7xl'>
            🍔
          </div>

          <div className='flex min-w-0 flex-1 flex-col gap-2 p-4'>
            <div className='flex flex-col gap-0.5'>
              <span className='text-foreground font-semibold'>Classic Burger</span>
              <span className='text-muted-foreground text-xs'>Beef patty · cheddar · 320g</span>
            </div>

            <div className='mt-auto flex items-center justify-between gap-2'>
              <span className='text-foreground text-lg font-semibold tabular-nums'>$8.50</span>
              <button data-size='sm' type='button'>
                <PlusIcon className='size-4' />
                Add
              </button>
            </div>
          </div>
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
npx useverse@latest add useSize
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useRef } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useRefState } from '../useRefState/useRefState';
import { useRerender } from '../useRerender/useRerender';

/** The size value type */
export interface UseSizeValue {
  /** The element's height */
  height: number;
  /** The element's width */
  width: number;
}

/** The use size return type */
export interface UseSizeReturn {
  /** The resize observer instance */
  observer?: ResizeObserver;
  /** The latest size value snapshot */
  snapshot: UseSizeValue;
  /** Function to enable subscriptions and rerender on next updates */
  watch: () => UseSizeValue;
}

export type UseSizeCallback = (value: UseSizeValue, observer: ResizeObserver) => void;

export interface UseSize {
  (target: HookTarget, callback?: UseSizeCallback): UseSizeReturn;

  <Target extends Element>(
    callback?: UseSizeCallback,
    target?: never
  ): {
    ref: StateRef<Target>;
  } & UseSizeReturn;
}

/**
 * @name useSize
 * @description - Hook that observes and returns the width and height of element
 * @category Elements
 * @usage low
 *
 * @overload
 * @param {HookTarget} target The target element to observe
 * @param {(value: UseSizeValue, observer: ResizeObserver) => void} [callback] The callback to invoke on size updates
 * @returns {UseSizeReturn} An object containing the resize observer and latest width and height snapshot
 *
 * @example
 * const { snapshot, watch, observer } = useSize(ref);
 *
 * @overload
 * @template Target The target element type
 * @param {(value: UseSizeValue, observer: ResizeObserver) => void} [callback] The callback to invoke on size updates
 * @returns { { ref: StateRef<Target> } & UseSizeReturn } An object containing the resize observer and latest width and height snapshot
 *
 * @example
 * const { ref, snapshot, watch, observer } = useSize();
 */
export const useSize = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const callback = (target ? params[1] : params[0]) as UseSizeCallback | undefined;

  const snapshotRef = useRef({ width: 0, height: 0 });
  const observerRef = useRef<ResizeObserver>(undefined);
  const internalCallbackRef = useRef(callback);
  const watchingRef = useRef(false);
  const rerender = useRerender();
  const internalRef = useRefState<Element>();

  internalCallbackRef.current = callback;

  const watch = () => {
    watchingRef.current = true;
    return snapshotRef.current;
  };

  const updateValue = (value: UseSizeValue, observer: ResizeObserver) => {
    snapshotRef.current = value;
    internalCallbackRef.current?.(value, observer);
    if (watchingRef.current) rerender();
  };

  useIsomorphicLayoutEffect(() => {
    const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;

    if (!element) return;

    const updateSize = (observer: ResizeObserver) => {
      const { width, height } = element.getBoundingClientRect();
      updateValue({ width, height }, observer);
    };

    const observer = new ResizeObserver(() => {
      updateSize(observer);
    });

    observerRef.current = observer;
    updateSize(observer);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [internalRef.state, target && isTarget.getRawElement(target)]);

  if (target) return { observer: observerRef.current, snapshot: snapshotRef.current, watch };
  return {
    observer: observerRef.current,
    ref: internalRef,
    snapshot: snapshotRef.current,
    watch
  };
}) as UseSize;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { snapshot, watch, observer } = useSize(ref);
// or
const { ref, snapshot, watch, observer } = useSize();
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export interface UseSizeValue {
  /** The element's height */
  height: number;
  /** The element's width */
  width: number;
}

export interface UseSizeReturn {
  /** The resize observer instance */
  observer?: ResizeObserver;
  /** The latest size value snapshot */
  snapshot: UseSizeValue;
  /** Function to enable subscriptions and rerender on next updates */
  watch: () => UseSizeValue;
}

export type UseSizeCallback = (value: UseSizeValue, observer: ResizeObserver) => void;

export interface UseSize {
  (target: HookTarget, callback?: UseSizeCallback): UseSizeReturn;

  <Target extends Element>(
    callback?: UseSizeCallback,
    target?: never
  ): {
    ref: StateRef<Target>;
  } & UseSizeReturn;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target element to observe |
| callback | `(value: UseSizeValue, observer: ResizeObserver) => void` | - | The callback to invoke on size updates |

#### Returns

`UseSizeReturn` - An object containing the resize observer and latest width and height snapshot

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(value: UseSizeValue, observer: ResizeObserver) => void` | - | The callback to invoke on size updates |

#### Returns

`{ ref: StateRef<Target> } & UseSizeReturn` - An object containing the resize observer and latest width and height snapshot