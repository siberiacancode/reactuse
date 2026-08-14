---
title: useTimeout
description: Hook that executes a callback function after a specified delay
category: time
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useTimeout

Hook that executes a callback function after a specified delay

## Demo

```tsx
import { useTimeout } from '@siberiacancode/reactuse';

const DELAY = 5000;

const Demo = () => {
  const timeout = useTimeout(() => {}, DELAY);

  return (
    <section className='flex w-full max-w-md flex-col items-center gap-6 p-8'>
      <div
        key={String(timeout.ready)}
        className='animate-in fade-in slide-in-from-bottom-2 duration-500'
      >
        <span className='text-foreground text-5xl font-bold tracking-tight'>
          {timeout.ready ? "You're awesome" : 'Hold on'}
        </span>
      </div>

      <div className='bg-muted h-1 w-32 overflow-hidden rounded-full'>
        <div
          className='bg-foreground h-full origin-left'
          style={{ animation: `progress ${DELAY}ms linear forwards` }}
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
npx useverse@latest add useTimeout
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

import { useEvent } from '../useEvent/useEvent';

/** The use timeout return type */
interface UseTimeoutReturn {
  /**  Timeout is ready state value */
  ready: boolean;
  /** Function to clear timeout */
  clear: () => void;
}

/**
 * @name useTimeout
 * @description - Hook that executes a callback function after a specified delay
 * @category Time
 * @usage medium
 *
 * @param {() => void} callback The function to be executed after the timeout
 * @param {number} delay The delay in milliseconds before the timeout executes the callback function
 * @returns {UseTimeoutReturn} An object with a `ready` boolean state value and a `clear` function to clear timeout
 *
 * @example
 * const { clear, ready } = useTimeout(() => {}, 5000);
 */
export function useTimeout(callback: () => void, delay: number): UseTimeoutReturn {
  const [ready, setReady] = useState(false);

  const timeoutIdRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const internalCallback = useEvent(callback);

  useEffect(() => {
    timeoutIdRef.current = setTimeout(() => {
      internalCallback();
      setReady(true);
    }, delay);

    return () => {
      clearTimeout(timeoutIdRef.current);
    };
  }, [delay]);

  const clear = () => {
    clearTimeout(timeoutIdRef.current);
    setReady(true);
  };

  return { ready, clear };
}
```

Update the import paths to match your project setup.

## Usage

```tsx
const { clear, ready } = useTimeout(() => {}, 5000);
```

## Type Declarations

```tsx
interface UseTimeoutReturn {
  /**  Timeout is ready state value */
  ready: boolean;
  /** Function to clear timeout */
  clear: () => void;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `() => void` | - | The function to be executed after the timeout |
| delay | `number` | - | The delay in milliseconds before the timeout executes the callback function |

### Returns

`UseTimeoutReturn` - An object with a `ready` boolean state value and a `clear` function to clear timeout