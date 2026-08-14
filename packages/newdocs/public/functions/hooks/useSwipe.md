---
title: useSwipe
description: Hook that tracks swipe gestures for touch and pointer events
category: sensors
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1776345632000
---

# useSwipe

Hook that tracks swipe gestures for touch and pointer events

## Demo

```tsx
import { useSwipe } from '@siberiacancode/reactuse';
import { LockIcon, MinusIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useRef, useState } from 'react';

import { cn } from '@/utils/lib';

interface Plant {
  emoji: string;
  id: string;
  name: string;
  price: number;
  qty: number;
}

const INITIAL: Plant[] = [
  { id: 'monstera', name: 'Monstera', price: 42, emoji: '🪴', qty: 1 },
  { id: 'cactus', name: 'Mini cactus', price: 18, emoji: '🌵', qty: 2 },
  { id: 'tulip', name: 'Tulips', price: 24, emoji: '🌷', qty: 1 },
  { id: 'palm', name: 'Areca palm', price: 56, emoji: '🌴', qty: 1 }
];

const SHIPPING_RATE = 0.1;

const SwipeRow = ({
  plant,
  isLast,
  onRemove,
  onQty
}: {
  plant: Plant;
  isLast: boolean;
  onRemove: (id: string) => void;
  onQty: (id: string, delta: number) => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const qty = plant.qty ?? 1;

  const setX = (x: number) => {
    if (cardRef.current) cardRef.current.style.transform = `translateX(${x}px)`;
    if (bgRef.current) bgRef.current.style.opacity = x < 0 ? '1' : '0';
  };

  const swipe = useSwipe<HTMLDivElement>({
    onStart: () => {
      if (cardRef.current) cardRef.current.style.transition = 'none';
    },
    onMove: (value) => {
      if (value.lengthX <= 0) return setX(0);
      setX(isLast ? -Math.min(value.lengthX * 0.35, 64) : -value.lengthX);
    },
    onEnd: (value) => {
      if (cardRef.current) cardRef.current.style.transition = 'transform 200ms ease-out';

      if (isLast) return setX(0);

      const width = cardRef.current?.offsetWidth ?? 0;
      const dragged = value.lengthX > 0 ? value.lengthX : 0;
      const shouldRemove = width > 0 && dragged / width >= 0.4;

      if (shouldRemove) {
        setX(-width);
        setTimeout(onRemove, 180, plant.id);
      } else {
        setX(0);
      }
    }
  });

  return (
    <div className='relative overflow-hidden'>
      <div
        ref={bgRef}
        className={cn(
          'absolute inset-0 flex items-center justify-end pr-4 transition-opacity',
          isLast ? 'bg-muted' : 'bg-destructive'
        )}
        style={{ opacity: 0 }}
      >
        {isLast ? (
          <LockIcon className='text-muted-foreground size-4' />
        ) : (
          <Trash2Icon className='size-4 text-white' />
        )}
      </div>

      <div ref={swipe.ref} className='relative' style={{ touchAction: 'pan-y' }}>
        <div
          ref={cardRef}
          className='bg-background flex flex-col gap-3 py-3 pr-2 select-none sm:flex-row sm:items-center'
          style={{ transform: 'translateX(0)' }}
        >
          <div className='flex items-center gap-3'>
            <div data-size='lg' data-slot='avatar'>
              <span data-slot='avatar-fallback'>{plant.emoji}</span>
            </div>
            <div className='flex min-w-0 flex-1 flex-col leading-tight'>
              <span className='text-foreground truncate text-sm'>{plant.name}</span>
              <span className='text-muted-foreground text-[10px] tabular-nums'>
                ${plant.price} each
              </span>
            </div>
            <span className='text-foreground shrink-0 font-mono text-sm font-semibold tabular-nums sm:hidden'>
              ${plant.price * qty}
            </span>
          </div>

          <div className='flex items-center gap-3 sm:ml-auto'>
            <div className='flex shrink-0 items-center gap-1.5'>
              <button
                aria-label='Decrease'
                className='rounded-full!'
                data-size='icon-xs'
                data-variant='outline'
                disabled={isLast && qty <= 1}
                type='button'
                onClick={() => onQty(plant.id, -1)}
              >
                <MinusIcon className='size-3' />
              </button>
              <span className='text-foreground w-4 text-center font-mono text-xs font-semibold tabular-nums'>
                {qty}
              </span>
              <button
                aria-label='Increase'
                className='rounded-full!'
                data-size='icon-xs'
                data-variant='outline'
                type='button'
                onClick={() => onQty(plant.id, 1)}
              >
                <PlusIcon className='size-3' />
              </button>
            </div>

            <span className='text-foreground hidden w-12 shrink-0 text-right font-mono text-sm font-semibold tabular-nums sm:block'>
              ${plant.price * qty}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Demo = () => {
  const [plants, setPlants] = useState<Plant[]>(INITIAL);

  const isLast = plants.length <= 1;

  const onRemove = (id: string) => setPlants((prev) => prev.filter((plant) => plant.id !== id));

  const onQty = (id: string, delta: number) => {
    setPlants((currentPlants) => {
      const plant = currentPlants.find((currentPlant) => currentPlant.id === id);
      if (!plant) return currentPlants;

      const next = (plant.qty ?? 1) + delta;

      if (next < 1) {
        if (currentPlants.length <= 1) return currentPlants;
        return currentPlants.filter((currentPlant) => currentPlant.id !== id);
      }

      return currentPlants.map((currentPlant) =>
        currentPlant.id === id ? { ...currentPlant, qty: next } : currentPlant
      );
    });
  };

  const subtotal = plants.reduce((sum, plant) => sum + plant.price * (plant.qty ?? 1), 0);
  const shipping = Math.round(subtotal * SHIPPING_RATE);
  const total = subtotal + shipping;

  return (
    <section className='flex w-full max-w-sm flex-col gap-4 p-4'>
      <div className='flex items-baseline justify-between'>
        <h2 className='text-foreground text-base font-semibold'>Your cart</h2>
        <span className='text-muted-foreground text-xs tabular-nums'>{plants.length} items</span>
      </div>

      <div className='divide-border flex flex-col divide-y'>
        {plants.map((plant) => (
          <SwipeRow
            key={plant.id}
            isLast={isLast}
            plant={plant}
            onQty={onQty}
            onRemove={onRemove}
          />
        ))}
      </div>

      <div className='border-border flex flex-col gap-2 border-t pt-3'>
        <div className='flex items-center justify-between text-sm'>
          <span className='text-muted-foreground'>Subtotal</span>
          <span className='text-foreground font-mono tabular-nums'>${subtotal}</span>
        </div>
        <div className='flex items-center justify-between text-sm'>
          <span className='text-muted-foreground'>Shipping</span>
          <span className='text-foreground font-mono tabular-nums'>${shipping}</span>
        </div>
        <div className='border-border flex items-center justify-between border-t pt-2'>
          <span className='text-foreground text-sm font-medium'>Total</span>
          <span className='text-foreground font-mono text-lg font-bold tabular-nums'>${total}</span>
        </div>

        <button className='mt-1 w-full!' type='button'>
          Checkout
        </button>
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
npx useverse@latest add useSwipe
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';
import { useRerender } from '../useRerender/useRerender';

export type SwipeDirection = 'down' | 'left' | 'none' | 'right' | 'up';
export type SwipeEvent = PointerEvent | TouchEvent;
export type UseSwipeCallback = (value: UseSwipeValue, event: SwipeEvent) => void;

export interface UseSwipeOptions {
  /** Called when swipe moves */
  onMove?: UseSwipeCallback;
  /** Minimal distance in px to resolve direction */
  threshold?: number;
  /** Called when swipe ends */
  onEnd?: (value: UseSwipeValue, event: SwipeEvent) => void;
  /** Called when swipe starts */
  onStart?: (value: UseSwipeValue, event: SwipeEvent) => void;
}

export interface UseSwipeValue {
  /** Current swipe direction */
  direction: SwipeDirection;
  /** Horizontal swipe length */
  lengthX: number;
  /** Vertical swipe length */
  lengthY: number;
}

export interface UseSwipeReturn {
  /** The latest swipe value snapshot */
  snapshot: UseSwipeValue;
  /** Is swipe currently active */
  swiping: boolean;
  /** Function to enable subscriptions and rerender on next updates */
  watch: () => UseSwipeValue;
}

export interface UseSwipe {
  (target: HookTarget, callback?: UseSwipeCallback): UseSwipeReturn;
  (target: HookTarget, options?: UseSwipeOptions): UseSwipeReturn;

  <Target extends Element>(
    callback?: UseSwipeCallback,
    target?: never
  ): UseSwipeReturn & {
    ref: StateRef<Target>;
  };

  <Target extends Element>(
    options?: UseSwipeOptions,
    target?: never
  ): UseSwipeReturn & {
    ref: StateRef<Target>;
  };
}

const DEFAULT_SWIPE_THRESHOLD = 50;
interface Coords {
  x: number;
  y: number;
}

const getCoords = (event: SwipeEvent): Coords | undefined => {
  if ('touches' in event) {
    const touch = event.touches[0] ?? event.changedTouches[0];
    if (!touch) return;

    return {
      x: touch.clientX,
      y: touch.clientY
    };
  }

  return {
    x: event.clientX,
    y: event.clientY
  };
};

/**
 * @name useSwipe
 * @description - Hook that tracks swipe gestures for touch and pointer events
 * @category Sensors
 * @usage low
 *
 * @overload
 * @param {HookTarget} target The target element to track swipe on
 * @param {UseSwipeCallback} [callback] Swipe move callback
 * @returns {UseSwipeReturn} Swipe state
 *
 * @example
 * const swipe = useSwipe(ref, (value) => console.log(value.direction));
 *
 * @overload
 * @template Target The target element
 * @param {UseSwipeCallback} [callback] Swipe move callback
 * @returns {UseSwipeReturn & { ref: StateRef<Target> }} Swipe state and ref
 *
 * @example
 * const swipe = useSwipe<HTMLDivElement>((value) => console.log(value.direction));
 *
 * @overload
 * @param {HookTarget} target The target element to track swipe on
 * @param {UseSwipeOptions} [options] Swipe options
 * @returns {UseSwipeReturn} Swipe state
 *
 * @example
 * const swipe = useSwipe(ref);
 *
 * @overload
 * @template Target The target element
 * @param {UseSwipeOptions} [options] Swipe options
 * @returns {UseSwipeReturn & { ref: StateRef<Target> }} Swipe state and ref
 *
 * @example
 * const swipe = useSwipe<HTMLDivElement>();
 */
export const useSwipe = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (
    target
      ? typeof params[1] === 'function'
        ? { ...params[2], onMove: params[1] }
        : params[1]
      : typeof params[0] === 'function'
        ? { ...params[1], onMove: params[0] }
        : params[0]
  ) as UseSwipeOptions | undefined;

  const [swiping, setSwiping] = useState(false);
  const internalRef = useRefState<Element>();
  const snapshotRef = useRef<UseSwipeValue>({
    direction: 'none',
    lengthX: 0,
    lengthY: 0
  });
  const swipingRef = useRef(false);
  const watchingRef = useRef(false);
  const rerender = useRerender();
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const watch = () => {
    watchingRef.current = true;
    return snapshotRef.current;
  };

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;

    let start: Coords | undefined;

    const getCurrentDirection = (x: number, y: number) => {
      const absX = Math.abs(x);
      const absY = Math.abs(y);
      const maxLength = Math.max(absX, absY);
      const threshold = optionsRef.current?.threshold ?? DEFAULT_SWIPE_THRESHOLD;

      if (maxLength < threshold) return 'none';

      if (absX > absY) return x > 0 ? 'left' : 'right';
      return y > 0 ? 'up' : 'down';
    };

    const onStart = (event: SwipeEvent) => {
      if (swipingRef.current) return;

      const coords = getCoords(event);
      if (!coords) return;

      start = coords;
      const nextValue: UseSwipeValue = {
        direction: 'none',
        lengthX: 0,
        lengthY: 0
      };
      swipingRef.current = true;
      setSwiping(true);
      snapshotRef.current = nextValue;
      optionsRef.current?.onStart?.(nextValue, event);
      if (watchingRef.current) rerender();
    };

    const onMove = (event: SwipeEvent) => {
      if (!swipingRef.current || !start) return;

      const coords = getCoords(event);
      if (!coords) return;

      const nextLengthX = start.x - coords.x;
      const nextLengthY = start.y - coords.y;

      snapshotRef.current = {
        direction: getCurrentDirection(nextLengthX, nextLengthY),
        lengthX: nextLengthX,
        lengthY: nextLengthY
      };
      optionsRef.current?.onMove?.(snapshotRef.current, event);
      if (watchingRef.current) rerender();
    };

    const onEnd = (event: SwipeEvent) => {
      if (!swipingRef.current || !start) return;

      const coords = getCoords(event);
      const x = coords ? start.x - coords.x : snapshotRef.current.lengthX;
      const y = coords ? start.y - coords.y : snapshotRef.current.lengthY;
      const nextValue: UseSwipeValue = {
        direction: getCurrentDirection(x, y),
        lengthX: x,
        lengthY: y
      };
      swipingRef.current = false;
      setSwiping(false);
      snapshotRef.current = nextValue;
      optionsRef.current?.onEnd?.(nextValue, event);
      if (watchingRef.current) rerender();

      start = undefined;
    };

    const onPointerStart = (event: PointerEvent) => {
      if (!event.isPrimary) return;
      onStart(event);
    };

    const onPointerMove = (event: PointerEvent) => onMove(event);
    const onPointerEnd = (event: PointerEvent) => onEnd(event);

    const onTouchStart = (event: TouchEvent) => onStart(event);
    const onTouchMove = (event: TouchEvent) => onMove(event);
    const onTouchEnd = (event: TouchEvent) => onEnd(event);

    element.addEventListener('pointerdown', onPointerStart as EventListener);
    window.addEventListener('pointermove', onPointerMove as EventListener);
    window.addEventListener('pointerup', onPointerEnd as EventListener);
    window.addEventListener('pointercancel', onPointerEnd as EventListener);

    element.addEventListener('touchstart', onTouchStart as EventListener);
    window.addEventListener('touchmove', onTouchMove as EventListener);
    window.addEventListener('touchend', onTouchEnd as EventListener);
    window.addEventListener('touchcancel', onTouchEnd as EventListener);

    return () => {
      element.removeEventListener('pointerdown', onPointerStart as EventListener);
      window.removeEventListener('pointermove', onPointerMove as EventListener);
      window.removeEventListener('pointerup', onPointerEnd as EventListener);
      window.removeEventListener('pointercancel', onPointerEnd as EventListener);

      element.removeEventListener('touchstart', onTouchStart as EventListener);
      window.removeEventListener('touchmove', onTouchMove as EventListener);
      window.removeEventListener('touchend', onTouchEnd as EventListener);
      window.removeEventListener('touchcancel', onTouchEnd as EventListener);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  if (target) return { swiping, snapshot: snapshotRef.current, watch };
  return { ref: internalRef, swiping, snapshot: snapshotRef.current, watch };
}) as UseSwipe;
```

Update the import paths to match your project setup.

## Usage

```tsx
const swipe = useSwipe(ref, (value) => console.log(value.direction));
// or
const swipe = useSwipe<HTMLDivElement>((value) => console.log(value.direction));
// or
const swipe = useSwipe(ref);
// or
const swipe = useSwipe<HTMLDivElement>();
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export type SwipeDirection = 'down' | 'left' | 'none' | 'right' | 'up';

export type SwipeEvent = PointerEvent | TouchEvent;

export type UseSwipeCallback = (value: UseSwipeValue, event: SwipeEvent) => void;

export interface UseSwipeOptions {
  /** Called when swipe moves */
  onMove?: UseSwipeCallback;
  /** Minimal distance in px to resolve direction */
  threshold?: number;
  /** Called when swipe ends */
  onEnd?: (value: UseSwipeValue, event: SwipeEvent) => void;
  /** Called when swipe starts */
  onStart?: (value: UseSwipeValue, event: SwipeEvent) => void;
}

export interface UseSwipeValue {
  /** Current swipe direction */
  direction: SwipeDirection;
  /** Horizontal swipe length */
  lengthX: number;
  /** Vertical swipe length */
  lengthY: number;
}

export interface UseSwipeReturn {
  /** The latest swipe value snapshot */
  snapshot: UseSwipeValue;
  /** Is swipe currently active */
  swiping: boolean;
  /** Function to enable subscriptions and rerender on next updates */
  watch: () => UseSwipeValue;
}

export interface UseSwipe {
  (target: HookTarget, callback?: UseSwipeCallback): UseSwipeReturn;
  (target: HookTarget, options?: UseSwipeOptions): UseSwipeReturn;

  <Target extends Element>(
    callback?: UseSwipeCallback,
    target?: never
  ): UseSwipeReturn & {
    ref: StateRef<Target>;
  };

  <Target extends Element>(
    options?: UseSwipeOptions,
    target?: never
  ): UseSwipeReturn & {
    ref: StateRef<Target>;
  };
}

interface Coords {
  x: number;
  y: number;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target element to track swipe on |
| callback | `UseSwipeCallback` | - | Swipe move callback |

#### Returns

`UseSwipeReturn` - Swipe state

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `UseSwipeCallback` | - | Swipe move callback |

#### Returns

`UseSwipeReturn & { ref: StateRef<Target> }` - Swipe state and ref

### Overload 3

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target element to track swipe on |
| options | `UseSwipeOptions` | - | Swipe options |

#### Returns

`UseSwipeReturn` - Swipe state

### Overload 4

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options | `UseSwipeOptions` | - | Swipe options |

#### Returns

`UseSwipeReturn & { ref: StateRef<Target> }` - Swipe state and ref