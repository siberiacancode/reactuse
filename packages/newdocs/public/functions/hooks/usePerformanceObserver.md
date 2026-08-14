---
title: usePerformanceObserver
description: Hook that allows you to observe performance entries
category: sensors
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1781981977000
---

# usePerformanceObserver

Hook that allows you to observe performance entries

## Demo

```tsx
import { usePerformanceObserver } from '@siberiacancode/reactuse';
import { GaugeIcon, RotateCwIcon } from 'lucide-react';

const formatMs = (value: number) => `${Math.round(value)}ms`;
const formatLabel = (name: string) =>
  name
    .split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');

const Demo = () => {
  const performance = usePerformanceObserver({
    entryTypes: ['paint'],
    buffered: true,
    immediate: true
  });

  if (!performance.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <section className='flex w-full max-w-sm flex-col gap-4 p-6'>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-start gap-2'>
          <div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg'>
            <GaugeIcon className='size-5' />
          </div>
          <div className='flex flex-col'>
            <h3 className='text-base!'>Page paint timings</h3>
            <p className='text-muted-foreground text-xs'>How fast this page rendered for you</p>
          </div>
        </div>

        <button
          aria-label='Refresh'
          className='self-start rounded-full!'
          data-size='icon'
          data-variant='outline'
          type='button'
          onClick={() => window.location.reload()}
        >
          <RotateCwIcon className='size-4' />
        </button>
      </div>

      {!performance.entries.length && (
        <p className='text-muted-foreground text-sm'>Waiting for paint entries...</p>
      )}

      {!!performance.entries.length && (
        <div className='divide-border flex flex-col divide-y'>
          {performance.entries.map((entry) => (
            <div key={entry.name} className='flex items-center justify-between py-2.5'>
              <span className='text-sm font-medium'>{formatLabel(entry.name)}</span>
              <span className='text-muted-foreground text-sm tabular-nums'>
                {formatMs(entry.startTime)}
              </span>
            </div>
          ))}
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
npx useverse@latest add usePerformanceObserver
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

/** The use performance observer options type */
export type UsePerformanceObserverOptions = PerformanceObserverInit & {
  /** Whether to start the observer immediately */
  immediate?: boolean;
};

/**
 * @name usePerformanceObserver
 * @description - Hook that allows you to observe performance entries
 * @category Sensors
 * @usage low
 *
 * @browserapi PerformanceObserver https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver
 *
 * @param {UsePerformanceObserverOptions} options The options for the performance observer
 * @param {PerformanceObserverCallback} callback The function to handle performance entries
 * @returns {object} An object containing the observer's support status and methods to start and stop the observer
 *
 * @example
 * const { supported, entries, start, stop } = usePerformanceObserver();
 */
export const usePerformanceObserver = (
  options: UsePerformanceObserverOptions,
  callback?: PerformanceObserverCallback
) => {
  const supported =
    typeof window !== 'undefined' &&
    'PerformanceObserver' in window &&
    !!window.PerformanceObserver;
  const [entries, setEntries] = useState<PerformanceEntry[]>([]);

  const observerRef = useRef<PerformanceObserver>(undefined);
  const internalCallback = useRef<PerformanceObserverCallback | null>(callback);
  internalCallback.current = callback;

  const start = () => {
    if (!supported) return;
    const observer = new PerformanceObserver((entryList, observer) => {
      setEntries(entryList.getEntries());
      internalCallback.current?.(entryList, observer);
    });
    observer.observe(options);
    observerRef.current = observer;
  };

  const stop = () => {
    if (!supported) return;
    observerRef.current?.disconnect();
    observerRef.current = undefined;
  };

  useEffect(() => {
    if (!supported) return;
    if (options.immediate) start();

    return () => {
      stop();
    };
  }, []);

  return { supported, entries, start, stop, observer: observerRef.current };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { supported, entries, start, stop } = usePerformanceObserver();
```

## Type Declarations

```tsx
export type UsePerformanceObserverOptions = PerformanceObserverInit & {
  /** Whether to start the observer immediately */
  immediate?: boolean;
};
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options | `UsePerformanceObserverOptions` | - | The options for the performance observer |
| callback | `PerformanceObserverCallback` | - | The function to handle performance entries |

### Returns

`object` - An object containing the observer's support status and methods to start and stop the observer