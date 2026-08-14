---
title: useThrottleCallback
description: Hook that creates a throttled callback
category: utilities
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useThrottleCallback

Hook that creates a throttled callback

## Demo

```tsx
import { useThrottleCallback } from '@siberiacancode/reactuse';
import { useState } from 'react';

const SETTINGS = [
  { key: 'quality', label: 'Quality', min: 10, max: 100 },
  { key: 'brightness', label: 'Brightness', min: 50, max: 150 },
  { key: 'contrast', label: 'Contrast', min: 50, max: 150 },
  { key: 'saturation', label: 'Saturation', min: 0, max: 200 }
] as const;

const DEFAULT_SETTINGS = { quality: 80, brightness: 100, contrast: 100, saturation: 100 };

const Demo = () => {
  const [values, setValues] = useState(DEFAULT_SETTINGS);
  const [applied, setApplied] = useState(DEFAULT_SETTINGS);

  const applyValues = useThrottleCallback((next: typeof DEFAULT_SETTINGS) => setApplied(next), 100);

  const onChange = (key: string, value: number) => {
    const next = { ...values, [key]: value };
    setValues(next);
    applyValues(next);
  };

  const sizeKb = Math.round(60 + (applied.quality / 100) * 1840);
  const blur = (100 - applied.quality) / 50;

  const filter = [
    `blur(${blur}px)`,
    `brightness(${applied.brightness}%)`,
    `contrast(${applied.contrast}%)`,
    `saturate(${applied.saturation}%)`
  ].join(' ');

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div data-slot='card'>
        <div className='flex flex-col gap-4' data-slot='card-content'>
          <div className='bg-muted relative aspect-[4/3] w-full overflow-hidden rounded-xl'>
            <img
              alt='Tokyo'
              className='size-full object-cover transition-[filter] duration-200'
              src='/images/tokyo.png'
              style={{ filter }}
            />
            <span className='bg-background/85 text-foreground absolute top-2.5 left-2.5 rounded-md px-2 py-1 font-mono text-xs tabular-nums shadow-sm backdrop-blur'>
              {(sizeKb / 1024).toFixed(2)} MB
            </span>
          </div>

          <div className='flex flex-col gap-3'>
            {SETTINGS.map((setting) => {
              const value = values[setting.key as keyof typeof values];
              const progress = ((value - setting.min) / (setting.max - setting.min)) * 100;
              return (
                <div key={setting.key} className='flex flex-col gap-1.5'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-foreground font-medium'>{setting.label}</span>
                    <span className='text-muted-foreground font-mono text-xs tabular-nums'>
                      {value}
                      {setting.key === 'quality' ? '%' : ''}
                    </span>
                  </div>
                  <input
                    max={setting.max}
                    min={setting.min}
                    style={{ ['--range-progress' as string]: `${progress}%` }}
                    type='range'
                    value={value}
                    onChange={(event) => onChange(setting.key, Number(event.target.value))}
                  />
                </div>
              );
            })}
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
npx useverse@latest add useThrottleCallback
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useMemo, useRef } from 'react';

export type ThrottledCallback<Params extends unknown[]> = ((...args: Params) => void) & {
  cancel: () => void;
};

/**
 * @name useThrottleCallback
 * @description - Hook that creates a throttled callback
 * @category Utilities
 * @usage medium
 *
 * @template Params The type of the params
 * @template Return The type of the return
 * @param {(...args: Params) => Return} callback The callback function
 * @param {number} delay The delay in milliseconds
 * @returns {(...args: Params) => Return} The callback with throttle
 *
 * @example
 * const throttled = useThrottleCallback(() => console.log('callback'), 500);
 */
export const useThrottleCallback = <Params extends unknown[], Return>(
  callback: (...args: Params) => Return,
  delay: number
): ThrottledCallback<Params> => {
  const internalCallbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCalledRef = useRef(false);
  const delayRef = useRef(delay);
  const lastArgsRef = useRef<Params | null>(null);

  internalCallbackRef.current = callback;
  delayRef.current = delay;

  const throttled = useMemo(() => {
    const timer = () => {
      isCalledRef.current = false;

      if (!lastArgsRef.current) return;
      internalCallbackRef.current.apply(this, lastArgsRef.current);
      lastArgsRef.current = null;
      setTimeout(timer, delayRef.current);
    };

    const cancel = () => {
      if (!timeoutRef.current) return;
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      isCalledRef.current = false;
    };

    const throttledCallback = function (this: any, ...args: Params) {
      lastArgsRef.current = args;
      if (isCalledRef.current) return;

      internalCallbackRef.current.apply(this, args);
      isCalledRef.current = true;
      timeoutRef.current = setTimeout(timer, delayRef.current);
    };

    throttledCallback.cancel = cancel;

    cancel();
    return throttledCallback;
  }, [delay]);

  return throttled;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const throttled = useThrottleCallback(() => console.log('callback'), 500);
```

## Type Declarations

```tsx
export type ThrottledCallback<Params extends unknown[]> = ((...args: Params) => void) & {
  cancel: () => void;
};
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(...args: Params) => Return` | - | The callback function |
| delay | `number` | - | The delay in milliseconds |

### Returns

`(...args: Params) => Return` - The callback with throttle