---
title: useRaf
description: Hook that defines the logic for raf callback
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useRaf

Hook that defines the logic for raf callback

## Demo

```tsx
import { useRaf } from '@siberiacancode/reactuse';
import { useRef, useState } from 'react';

const Demo = () => {
  const [fps, setFps] = useState(0);
  const framesRef = useRef(0);
  const elapsedRef = useRef(0);

  useRaf(({ delta }) => {
    framesRef.current += 1;
    elapsedRef.current += delta;

    if (elapsedRef.current >= 1000) {
      setFps(Math.round((framesRef.current * 1000) / elapsedRef.current));
      framesRef.current = 0;
      elapsedRef.current = 0;
    }
  });

  return (
    <section className='flex flex-col items-center gap-2 p-8'>
      <span className='text-foreground font-mono text-6xl font-bold tabular-nums'>{fps}</span>
      <span className='text-muted-foreground text-sm'>frames per second</span>
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
npx useverse@latest add useRaf
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

/* The use raf params type */
export interface UseRafParams {
  /** The delta between each frame in milliseconds */
  delta: number;
  /** The timestamp of the current frame in milliseconds */
  timestamp: DOMHighResTimeStamp;
}

/* The use raf type */
export type UseRafCallback = (params: UseRafParams) => void;

/* The use raf options type */
export interface UseRafOptions {
  /** The delay between each frame in milliseconds */
  delay?: number;
  /** Whether the callback should be enabled */
  enabled?: boolean;
}

/* The use raf return type */
export interface UseRafReturn {
  /** Whether the callback is active */
  active: boolean;
  /** Function to pause the callback */
  pause: () => void;
  /** Function to resume the callback */
  resume: () => void;
}

/**
 * @name useRaf
 * @description - Hook that defines the logic for raf callback
 * @category Browser
 * @usage low
 *
 * @browserapi requestAnimationFrame https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 *
 * @param {UseRafCallback} callback The callback to execute
 * @param {number} [options.delay] The delay between each frame in milliseconds
 * @param {boolean} [options.enabled=true] Whether the callback should be enabled
 * @returns {UseRafCallbackReturn} An object of raf callback functions
 *
 * @example
 * useRaf(() => console.log('callback'));
 */
export const useRaf = (callback: UseRafCallback, options?: UseRafOptions): UseRafReturn => {
  const rafIdRef = useRef<number | null>(null);
  const previousFrameTimestampRef = useRef(0);
  const [active, setActive] = useState(false);
  const enabled = options?.enabled ?? true;

  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  const loop = (timestamp: DOMHighResTimeStamp) => {
    const delta = timestamp - previousFrameTimestampRef.current;

    if (options?.delay && delta < options?.delay) {
      rafIdRef.current = window.requestAnimationFrame(loop);
      return;
    }

    previousFrameTimestampRef.current = timestamp;
    internalCallbackRef.current({ delta, timestamp });
    rafIdRef.current = window.requestAnimationFrame(loop);
  };

  const resume = () => {
    if (active) return;
    setActive(true);
    previousFrameTimestampRef.current = 0;
    rafIdRef.current = window.requestAnimationFrame(loop);
  };

  function pause() {
    if (!rafIdRef.current) return;

    setActive(false);
    window.cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = null;
  }

  useEffect(() => {
    if (!enabled) return;
    resume();

    return pause;
  }, [enabled, options?.delay]);

  return {
    active,
    pause,
    resume
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
useRaf(() => console.log('callback'));
```

## Type Declarations

```tsx
export interface UseRafParams {
  /** The delta between each frame in milliseconds */
  delta: number;
  /** The timestamp of the current frame in milliseconds */
  timestamp: DOMHighResTimeStamp;
}

export type UseRafCallback = (params: UseRafParams) => void;

export interface UseRafOptions {
  /** The delay between each frame in milliseconds */
  delay?: number;
  /** Whether the callback should be enabled */
  enabled?: boolean;
}

export interface UseRafReturn {
  /** Whether the callback is active */
  active: boolean;
  /** Function to pause the callback */
  pause: () => void;
  /** Function to resume the callback */
  resume: () => void;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `UseRafCallback` | - | The callback to execute |
| options.delay | `number` | - | The delay between each frame in milliseconds |
| options.enabled | `boolean` | true | Whether the callback should be enabled |

### Returns

`UseRafCallbackReturn` - An object of raf callback functions