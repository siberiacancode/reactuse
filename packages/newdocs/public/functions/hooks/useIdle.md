---
title: useIdle
description: Hook that defines the logic when the user is idle
category: sensors
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1780207176000
---

# useIdle

Hook that defines the logic when the user is idle

## Demo

```tsx
import { useIdle } from '@siberiacancode/reactuse';

import { cn } from '@/utils/lib';

const IDLE_TIMEOUT = 2500;

const Demo = () => {
  const { idle } = useIdle(IDLE_TIMEOUT);

  return (
    <section className='flex flex-col items-center gap-4 p-4'>
      <div className='border-border bg-background inline-flex w-fit items-center gap-3 rounded-full border px-3 py-2'>
        <div className='relative shrink-0'>
          <div className='flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 text-sm font-semibold text-white'>
            SC
          </div>
          <span
            className={cn(
              'ring-background absolute right-0 bottom-0 block size-2.5 rounded-full ring-2 transition-colors',
              idle ? 'bg-amber-500' : 'bg-green-500'
            )}
          />
        </div>

        <div className='flex flex-col items-start gap-0.5 leading-none'>
          <span className='text-foreground text-sm font-medium'>siberiacancode</span>
          <span className='text-muted-foreground text-xs'>{idle ? 'Away' : 'Online'}</span>
        </div>
      </div>

      <p className='text-muted-foreground max-w-[220px] text-center text-[10px] leading-relaxed'>
        Stop moving the mouse and keyboard for a moment to switch to the idle state.
      </p>
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
npx useverse@latest add useIdle
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

import { throttle } from '@/utils/helpers';

/** The use idle callback type */
export type UseIdleCallback = (idle: boolean) => void;

/** The use idle options type */
export interface UseIdleOptions {
  /** The idle events */
  events?: Array<keyof DocumentEventMap>;
  /** The idle state */
  initialValue?: boolean;
  /** The callback to execute when idle state changes */
  onChange?: UseIdleCallback;
}

const IDLE_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'wheel',
  'resize'
] satisfies Array<keyof DocumentEventMap>;
const ONE_MINUTE = 60e3;

/** The use idle return type */
export interface UseIdleReturn {
  /** The idle state */
  idle: boolean;
  /** The last active time */
  lastActive: number;
}

export interface UseIdle {
  (): UseIdleReturn;

  (milliseconds: number, callback: UseIdleCallback): UseIdleReturn;

  (milliseconds: number, options?: UseIdleOptions): UseIdleReturn;
}

/**
 * @name useIdle
 * @description - Hook that defines the logic when the user is idle
 * @category Sensors
 * @usage low
 *
 * @overload
 * @returns {UseIdleReturn} An object containing the idle state and the last active time
 *
 * @example
 * const { idle, lastActive } = useIdle();
 *
 * @overload
 * @param {number} [milliseconds=ONE_MINUTE] The idle time in milliseconds
 * @param {(idle: boolean) => void} callback The callback to execute when idle state changes
 * @returns {UseIdleReturn} An object containing the idle state and the last active time
 *
 * @example
 * const { idle, lastActive } = useIdle(1000, (idle) => console.log(idle));
 *
 * @overload
 * @param {number} [milliseconds=ONE_MINUTE] The idle time in milliseconds
 * @param {(idle: boolean) => void} [options.onChange] The callback to execute when idle state changes
 * @param {boolean} [options.initialValue=false] The options for the hook
 * @param {Array<keyof WindowEventMap>} [options.events=IDLE_EVENTS]
 * @returns {UseIdleReturn} An object containing the idle state and the last active time
 *
 * @example
 * const { idle, lastActive } = useIdle(1000, { onChange: (idle) => console.log(idle) });
 */
export const useIdle = ((...params: any[]) => {
  const milliseconds = (typeof params[0] === 'number' ? params[0] : ONE_MINUTE) as number;
  const options = (typeof params[1] === 'function' ? { onChange: params[1] } : params[1]) as
    | UseIdleOptions
    | undefined;

  const initialValue = options?.initialValue ?? false;
  const events = options?.events ?? IDLE_EVENTS;

  const [idle, setIdle] = useState(initialValue);
  const [lastActive, setLastActive] = useState(Date.now());

  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const onTimeout = () => {
      internalOptionsRef.current?.onChange?.(true);
      setIdle(true);
    };

    const onEvent = throttle(() => {
      internalOptionsRef.current?.onChange?.(false);
      setIdle(false);
      setLastActive(Date.now());
      clearTimeout(timeoutId);
      timeoutId = setTimeout(onTimeout, milliseconds);
    }, 500);

    const onVisibilitychange = () => {
      if (!document.hidden) onEvent();
    };

    timeoutId = setTimeout(onTimeout, milliseconds);

    events.forEach((event) => window.addEventListener(event, onEvent));
    document.addEventListener('visibilitychange', onVisibilitychange);

    return () => {
      events.forEach((event) => window.removeEventListener(event, onEvent));
      document.removeEventListener('visibilitychange', onVisibilitychange);
      clearTimeout(timeoutId);
    };
  }, [milliseconds, events]);

  return { idle, lastActive };
}) as UseIdle;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { idle, lastActive } = useIdle();
// or
const { idle, lastActive } = useIdle(1000, (idle) => console.log(idle));
// or
const { idle, lastActive } = useIdle(1000, { onChange: (idle) => console.log(idle) });
```

## Type Declarations

```tsx
export type UseIdleCallback = (idle: boolean) => void;

export interface UseIdleOptions {
  /** The idle events */
  events?: Array<keyof DocumentEventMap>;
  /** The idle state */
  initialValue?: boolean;
  /** The callback to execute when idle state changes */
  onChange?: UseIdleCallback;
}

export interface UseIdleReturn {
  /** The idle state */
  idle: boolean;
  /** The last active time */
  lastActive: number;
}

export interface UseIdle {
  (): UseIdleReturn;

  (milliseconds: number, callback: UseIdleCallback): UseIdleReturn;

  (milliseconds: number, options?: UseIdleOptions): UseIdleReturn;
}
```

## API

### Overload 1

#### Returns

`UseIdleReturn` - An object containing the idle state and the last active time

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| milliseconds | `number` | ONE_MINUTE | The idle time in milliseconds |
| callback | `(idle: boolean) => void` | - | The callback to execute when idle state changes |

#### Returns

`UseIdleReturn` - An object containing the idle state and the last active time

### Overload 3

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| milliseconds | `number` | ONE_MINUTE | The idle time in milliseconds |
| options.onChange | `(idle: boolean) => void` | - | The callback to execute when idle state changes |
| options.initialValue | `boolean` | false | The options for the hook |
| options.events | `Array<keyof WindowEventMap>` | IDLE_EVENTS | - |

#### Returns

`UseIdleReturn` - An object containing the idle state and the last active time