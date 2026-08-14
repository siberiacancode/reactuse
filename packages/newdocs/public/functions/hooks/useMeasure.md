---
title: useMeasure
description: Hook to measure the size and position of an element
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1781528880000
---

# useMeasure

Hook to measure the size and position of an element

## Demo

```tsx
import { useBoolean, useMeasure } from '@siberiacancode/reactuse';
import { useState } from 'react';

const COLLAPSED_HEIGHT = 60;

const Demo = () => {
  const [expanded, setExpanded] = useBoolean(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const measure = useMeasure<HTMLParagraphElement>(({ height }) => {
    const nextIsOverflowing = height > COLLAPSED_HEIGHT;
    setIsOverflowing((isOverflowing) =>
      isOverflowing === nextIsOverflowing ? isOverflowing : nextIsOverflowing
    );
  });

  return (
    <section className='flex w-full max-w-sm flex-col gap-2 p-4'>
      <div className='bg-card flex flex-col gap-2 rounded-xl p-4 shadow-sm'>
        <span className='text-foreground text-sm font-semibold'>About reactuse</span>

        <div
          className='relative overflow-hidden transition-[max-height] duration-300'
          style={{ maxHeight: expanded ? undefined : COLLAPSED_HEIGHT }}
        >
          <p ref={measure.ref} className='text-muted-foreground text-xs leading-relaxed'>
            reactuse is a collection of essential React hooks designed to handle the most common
            patterns in modern web applications. From state management and side effects to browser
            APIs and sensor data — every hook is lightweight, fully typed, and dependency-free. The
            library covers async, lifecycle, state, sensors, elements and utilities, so you can drop
            them into any codebase without friction.
          </p>

          {!expanded && isOverflowing && (
            <div className='from-card pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t to-transparent' />
          )}
        </div>

        {isOverflowing && (
          <button
            className='self-start'
            data-size='sm'
            data-variant='link'
            type='button'
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
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
npx useverse@latest add useMeasure
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';
import { useRerender } from '../useRerender/useRerender';

/** The measure value type */
export type UseMeasureValue = Pick<
  DOMRectReadOnly,
  'bottom' | 'height' | 'left' | 'right' | 'top' | 'width' | 'x' | 'y'
>;

/** The use measure return type */
export interface UseMeasureReturn {
  /** The latest measure value snapshot */
  snapshot: UseMeasureValue;
  /** Function to enable subscriptions and rerender on next updates */
  watch: () => UseMeasureValue;
}

export type UseMeasureCallback = (
  value: UseMeasureValue,
  entry: ResizeObserverEntry,
  observer: ResizeObserver
) => void;

export interface UseMeasure {
  (target: HookTarget, callback?: UseMeasureCallback): UseMeasureReturn;

  <Target extends Element>(
    callback?: UseMeasureCallback,
    target?: never
  ): UseMeasureReturn & {
    ref: StateRef<Target>;
  };
}

/**
 * @name useMeasure
 * @description - Hook to measure the size and position of an element
 * @category Browser
 * @usage low
 *
 * @overload
 * @param {HookTarget} target The element to measure
 * @param {(value: UseMeasureValue, entry: ResizeObserverEntry, observer: ResizeObserver) => void} [callback] The callback to invoke on measure updates
 * @returns {UseMeasureReturn} The element's size and position controls
 *
 * @example
 * const { snapshot, watch } = useMeasure(ref);
 *
 * @overload
 * @template Target The element to measure
 * @param {(value: UseMeasureValue, entry: ResizeObserverEntry, observer: ResizeObserver) => void} [callback] The callback to invoke on measure updates
 * @returns {UseMeasureReturn & { ref: StateRef<Target> }} The element's size and position controls
 *
 * @example
 * const { ref, snapshot, watch } = useMeasure();
 */
export const useMeasure = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const callback = (target ? params[1] : params[0]) as UseMeasureCallback | undefined;

  const internalRef = useRefState<Element>();
  const internalCallbackRef = useRef(callback);
  const snapshotRef = useRef<UseMeasureValue>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  });
  const watchingRef = useRef(false);
  const rerender = useRerender();

  internalCallbackRef.current = callback;

  const watch = () => {
    watchingRef.current = true;
    return snapshotRef.current;
  };

  const updateValue = (
    value: UseMeasureValue,
    entry: ResizeObserverEntry,
    observer: ResizeObserver
  ) => {
    snapshotRef.current = value;
    internalCallbackRef.current?.(value, entry, observer);
    if (watchingRef.current) rerender();
  };

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries, observer) => {
      const entry = entries[0];
      if (!entry) return;

      const { x, y, width, height, top, left, bottom, right } = entry.contentRect;
      updateValue({ x, y, width, height, top, left, bottom, right }, entry, observer);
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  if (target) return { snapshot: snapshotRef.current, watch };
  return { ref: internalRef, snapshot: snapshotRef.current, watch };
}) as UseMeasure;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { snapshot, watch } = useMeasure(ref);
// or
const { ref, snapshot, watch } = useMeasure();
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export type UseMeasureValue = Pick<
  DOMRectReadOnly,
  'bottom' | 'height' | 'left' | 'right' | 'top' | 'width' | 'x' | 'y'
>;

export interface UseMeasureReturn {
  /** The latest measure value snapshot */
  snapshot: UseMeasureValue;
  /** Function to enable subscriptions and rerender on next updates */
  watch: () => UseMeasureValue;
}

export type UseMeasureCallback = (
  value: UseMeasureValue,
  entry: ResizeObserverEntry,
  observer: ResizeObserver
) => void;

export interface UseMeasure {
  (target: HookTarget, callback?: UseMeasureCallback): UseMeasureReturn;

  <Target extends Element>(
    callback?: UseMeasureCallback,
    target?: never
  ): UseMeasureReturn & {
    ref: StateRef<Target>;
  };
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The element to measure |
| callback | `(value: UseMeasureValue, entry: ResizeObserverEntry, observer: ResizeObserver) => void` | - | The callback to invoke on measure updates |

#### Returns

`UseMeasureReturn` - The element's size and position controls

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(value: UseMeasureValue, entry: ResizeObserverEntry, observer: ResizeObserver) => void` | - | The callback to invoke on measure updates |

#### Returns

`UseMeasureReturn & { ref: StateRef<Target> }` - The element's size and position controls