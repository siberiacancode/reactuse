---
title: useLongPress
description: Hook that defines the logic when long pressing an element
category: elements
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1770651919000
---

# useLongPress

Hook that defines the logic when long pressing an element

## Demo

```tsx
import { useDisclosure, useLongPress } from '@siberiacancode/reactuse';
import { CheckIcon, Loader2Icon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const THRESHOLD = 1500;

const FEATURES = [
  'Full access to all 50+ hooks',
  'Lifetime updates and new hooks',
  'Private community and chats',
  'Priority support from the team',
  'Exclusive useVue early access'
];

const Demo = () => {
  const success = useDisclosure();
  const [holding, setHolding] = useState(false);

  const longPress = useLongPress<HTMLButtonElement>(
    () => {
      setHolding(false);
      success.open();
    },
    {
      threshold: THRESHOLD,
      onStart: () => setHolding(true),
      onCancel: () => setHolding(false)
    }
  );

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div className='bg-card flex flex-col gap-5 rounded-2xl p-6 shadow-sm'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground text-[10px] tracking-[0.15em] uppercase'>
              Lifetime plan
            </span>
            <span className='rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-semibold text-green-600 dark:text-green-500'>
              Save 90%
            </span>
          </div>
          <div className='flex items-baseline gap-2'>
            <span className='text-foreground text-5xl font-bold tracking-tight tabular-nums'>
              $49
            </span>
            <span className='text-muted-foreground text-lg tabular-nums line-through'>$499</span>
          </div>
          <span className='text-muted-foreground text-xs'>
            ≈ <span className='text-foreground font-semibold'>$0.13</span> per day
          </span>
        </div>

        <div className='flex flex-col gap-2.5'>
          {FEATURES.map((feature) => (
            <div key={feature} className='flex items-center gap-2.5'>
              <span className='bg-foreground/40 size-1.5 shrink-0 rounded-full' />
              <span className='text-foreground text-xs leading-relaxed'>{feature}</span>
            </div>
          ))}
        </div>

        <button
          ref={longPress.ref}
          className={cn(
            'relative flex h-10! w-full items-center justify-center overflow-hidden rounded-full! text-sm font-semibold transition-colors select-none',
            holding ? 'bg-muted text-muted-foreground' : 'bg-white text-neutral-900'
          )}
          data-variant='unstyled'
          disabled={holding}
          type='button'
        >
          {holding && (
            <span className='flex items-center gap-2'>
              <Loader2Icon className='size-4 animate-spin' />
              Processing...
            </span>
          )}
          {!holding && 'Hold to get lifetime access'}
        </button>

        <span className='text-muted-foreground text-center text-[10px]'>
          Press and hold the button to confirm
        </span>
      </div>

      {success.opened && (
        <div
          className='animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-150'
          onClick={success.close}
        >
          <div className='animate-in fade-in zoom-in-95 border-border bg-card relative flex w-full max-w-xs flex-col items-center gap-4 rounded-xl border p-6 text-center shadow-2xl duration-200'>
            <button
              aria-label='Close'
              className='absolute top-3 right-3'
              data-size='icon'
              data-variant='ghost'
              type='button'
              onClick={success.close}
            >
              <XIcon className='size-4' />
            </button>

            <div className='flex size-12 items-center justify-center rounded-full bg-green-500/15'>
              <CheckIcon className='size-6 text-green-600 dark:text-green-500' strokeWidth={3} />
            </div>

            <div className='flex flex-col gap-2'>
              <h3 className='text-foreground text-base font-bold'>You're all set</h3>
              <p className='text-muted-foreground text-xs leading-relaxed'>
                Your lifetime access is now active. Check your inbox for the welcome guide and setup
                instructions.
              </p>
            </div>
          </div>
        </div>
      )}
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
npx useverse@latest add useLongPress
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

export type LongPressEvents = MouseEvent | TouchEvent;

// * The use long press options type */
export interface UseLongPressOptions {
  // * The threshold time in milliseconds
  threshold?: number;
  // * The callback function to be invoked on long press cancel
  onCancel?: (event: LongPressEvents) => void;
  // * The callback function to be invoked on long press end
  onFinish?: (event: LongPressEvents) => void;
  // * The callback function to be invoked on long press start
  onStart?: (event: LongPressEvents) => void;
}

/** The use long press return type */
export interface UseLongPressReturn {
  /** The long pressing state */
  pressed: boolean;
  /** The ref to attach to the element */
  ref: StateRef<Element>;
}

export interface UseLongPress {
  (
    target: HookTarget,
    callback: (event: LongPressEvents) => void,
    options?: UseLongPressOptions
  ): UseLongPressReturn;

  <Target extends Element>(
    callback: (event: LongPressEvents) => void,
    options?: UseLongPressOptions,
    target?: never
  ): {
    ref: StateRef<Target>;
  } & UseLongPressReturn;
}

const DEFAULT_THRESHOLD_TIME = 400;

/**
 * @name useLongPress
 * @description - Hook that defines the logic when long pressing an element
 * @category Elements
 * @usage medium
 *
 * @overload
 * @param {HookTarget} target The target element to be long pressed
 * @param {(event: LongPressEvents) => void} callback The callback function to be invoked on long press
 * @param {UseLongPressOptions} [options] The options for the long press
 * @returns {boolean} The long pressing state
 *
 * @example
 * const pressed = useLongPress(ref, () => console.log('callback'));
 *
 * @overload
 * @template Target The target element
 * @param {(event: LongPressEvents) => void} callback The callback function to be invoked on long press
 * @param {UseLongPressOptions} [options] The options for the long press
 * @returns {boolean} The long pressing state
 *
 * @example
 * const { ref, pressed } = useLongPress(() => console.log('callback'));
 */
export const useLongPress = ((...params: any[]): any => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const callback = (target ? params[1] : params[0]) as (event: LongPressEvents) => void;
  const options = (target ? params[2] : params[1]) as UseLongPressOptions | undefined;

  const [pressed, setPressed] = useState(false);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isPressedRef = useRef(false);
  const internalRef = useRefState<Element>();

  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;

    const onStart = (event: LongPressEvents) => {
      internalOptionsRef.current?.onStart?.(event);

      isPressedRef.current = true;
      timeoutIdRef.current = setTimeout(() => {
        internalCallbackRef.current(event);
        setPressed(true);
      }, internalOptionsRef.current?.threshold ?? DEFAULT_THRESHOLD_TIME);
    };

    const onCancel = (event: LongPressEvents) => {
      setPressed((prevPressed) => {
        if (prevPressed) {
          internalOptionsRef.current?.onFinish?.(event);
        } else if (isPressedRef.current) {
          internalOptionsRef.current?.onCancel?.(event);
        }

        isPressedRef.current = false;
        if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);

        return false;
      });
    };

    element.addEventListener('mousedown', onStart as EventListener);
    window.addEventListener('mouseup', onCancel as EventListener);

    element.addEventListener('touchstart', onStart as EventListener);
    window.addEventListener('touchend', onCancel as EventListener);

    return () => {
      element.removeEventListener('mousedown', onStart as EventListener);
      window.removeEventListener('mouseup', onCancel as EventListener);

      element.removeEventListener('touchstart', onStart as EventListener);
      window.removeEventListener('touchend', onCancel as EventListener);

      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  if (target) return { pressed };
  return { pressed, ref: internalRef };
}) as UseLongPress;
```

Update the import paths to match your project setup.

## Usage

```tsx
const pressed = useLongPress(ref, () => console.log('callback'));
// or
const { ref, pressed } = useLongPress(() => console.log('callback'));
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export type LongPressEvents = MouseEvent | TouchEvent;

export interface UseLongPressOptions {
  // * The threshold time in milliseconds
  threshold?: number;
  // * The callback function to be invoked on long press cancel
  onCancel?: (event: LongPressEvents) => void;
  // * The callback function to be invoked on long press end
  onFinish?: (event: LongPressEvents) => void;
  // * The callback function to be invoked on long press start
  onStart?: (event: LongPressEvents) => void;
}

export interface UseLongPressReturn {
  /** The long pressing state */
  pressed: boolean;
  /** The ref to attach to the element */
  ref: StateRef<Element>;
}

export interface UseLongPress {
  (
    target: HookTarget,
    callback: (event: LongPressEvents) => void,
    options?: UseLongPressOptions
  ): UseLongPressReturn;

  <Target extends Element>(
    callback: (event: LongPressEvents) => void,
    options?: UseLongPressOptions,
    target?: never
  ): {
    ref: StateRef<Target>;
  } & UseLongPressReturn;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target element to be long pressed |
| callback | `(event: LongPressEvents) => void` | - | The callback function to be invoked on long press |
| options | `UseLongPressOptions` | - | The options for the long press |

#### Returns

`boolean` - The long pressing state

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(event: LongPressEvents) => void` | - | The callback function to be invoked on long press |
| options | `UseLongPressOptions` | - | The options for the long press |

#### Returns

`boolean` - The long pressing state