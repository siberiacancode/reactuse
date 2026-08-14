---
title: useInterval
description: Hook that makes and interval and returns controlling functions
category: time
usage: high
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1776172602000
---

# useInterval

Hook that makes and interval and returns controlling functions

## Demo

```tsx
import { useInterval } from '@siberiacancode/reactuse';
import { useState } from 'react';

const GREETINGS = [
  'Hello',
  'Привет',
  'Hola',
  'Bonjour',
  'こんにちは',
  '你好',
  'Ciao',
  'Olá',
  'Hallo',
  'Salam'
];

const INTERVAL = 3000;

const Demo = () => {
  const [index, setIndex] = useState(0);

  useInterval(() => {
    setIndex((current) => (current + 1) % GREETINGS.length);
  }, INTERVAL);

  return (
    <section className='flex w-full max-w-md flex-col items-center gap-6 p-8'>
      <div key={index} className='animate-in fade-in slide-in-from-bottom-2 duration-500'>
        <span className='text-foreground text-5xl font-bold tracking-tight'>
          {GREETINGS[index]}
        </span>
      </div>

      <div className='bg-muted h-1 w-32 overflow-hidden rounded-full'>
        <div
          key={index}
          style={{
            animation: `progress ${INTERVAL}ms linear`
          }}
          className='bg-foreground h-full origin-left'
        />
      </div>

      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
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
npx useverse@latest add useInterval
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

/** The use interval options */
export interface UseIntervalOptions {
  /** Start the interval immediately */
  immediately?: boolean;
}

/** The use interval return type */
export interface UseIntervalReturn {
  /** Is the interval active */
  active: boolean;
  /** Pause the interval */
  pause: () => void;
  /** Resume the interval */
  resume: () => void;
  /** Toggle the interval */
  toggle: () => void;
}

interface UseInterval {
  (callback: () => void, interval?: number, options?: UseIntervalOptions): UseIntervalReturn;

  (callback: () => void, options?: UseIntervalOptions & { interval?: number }): UseIntervalReturn;
}

/**
 * @name useInterval
 * @description - Hook that makes and interval and returns controlling functions
 * @category Time
 * @usage high
 *
 * @overload
 * @param {() => void} callback Any callback function
 * @param {number} [interval=1000] Time in milliseconds
 * @param {boolean} [options.immediately=true] Start the interval immediately
 * @returns {UseIntervalReturn}
 *
 * @example
 * const { active, pause, resume, toggle } = useInterval(() => console.log('inside interval'), 2500);
 *
 * @overload
 * @param {() => void} callback Any callback function
 * @param {number} [options.interval=1000] Time in milliseconds
 * @param {boolean} [options.immediately=true] Start the interval immediately
 *
 * @example
 * const { active, pause, resume, toggle } = useInterval(() => console.log('inside interval'), { interval: 2500 });
 */
export const useInterval = ((...params: any[]): UseIntervalReturn => {
  const callback = params[0] as () => void;
  const interval =
    ((typeof params[1] === 'number'
      ? params[1]
      : (params[1] as (UseIntervalOptions & { interval?: number }) | undefined)
          ?.interval) as number) ?? 1000;
  const options =
    typeof params[1] === 'object'
      ? (params[1] as (UseIntervalOptions & { interval?: number }) | undefined)
      : (params[2] as UseIntervalOptions | undefined);
  const immediately = options?.immediately ?? true;

  const [active, setActive] = useState<boolean>(immediately);

  const intervalIdRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    if (!active) return;

    intervalIdRef.current = setInterval(() => internalCallbackRef.current(), interval);
    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [active, interval]);

  const pause = () => setActive(false);

  const resume = () => {
    if (interval <= 0) return;
    setActive(true);
  };

  const toggle = (value = !active) => setActive(value);

  return {
    active,
    pause,
    resume,
    toggle
  };
}) as UseInterval;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { active, pause, resume, toggle } = useInterval(() => console.log('inside interval'), 2500);
// or
const { active, pause, resume, toggle } = useInterval(() => console.log('inside interval'), { interval: 2500 });
```

## Type Declarations

```tsx
export interface UseIntervalOptions {
  /** Start the interval immediately */
  immediately?: boolean;
}

export interface UseIntervalReturn {
  /** Is the interval active */
  active: boolean;
  /** Pause the interval */
  pause: () => void;
  /** Resume the interval */
  resume: () => void;
  /** Toggle the interval */
  toggle: () => void;
}

interface UseInterval {
  (callback: () => void, interval?: number, options?: UseIntervalOptions): UseIntervalReturn;

  (callback: () => void, options?: UseIntervalOptions & { interval?: number }): UseIntervalReturn;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `() => void` | - | Any callback function |
| interval | `number` | 1000 | Time in milliseconds |
| options.immediately | `boolean` | true | Start the interval immediately |

#### Returns

`UseIntervalReturn`

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `() => void` | - | Any callback function |
| options.interval | `number` | 1000 | Time in milliseconds |
| options.immediately | `boolean` | true | Start the interval immediately |