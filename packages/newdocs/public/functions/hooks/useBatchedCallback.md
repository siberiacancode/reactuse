---
title: useBatchedCallback
description: Hook that batches calls and forwards them to a callback
category: utilities
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1777807410000
---

# useBatchedCallback

Hook that batches calls and forwards them to a callback

## Demo

```tsx
import { useBatchedCallback } from '@siberiacancode/reactuse';
import { useState } from 'react';

import { cn } from '@/utils/lib';

interface AnalyticsEvent {
  action: 'deselected' | 'selected';
  tag: string;
}

const INTERESTS = [
  { tag: 'work', label: 'Work' },
  { tag: 'study', label: 'Study' },
  { tag: 'hobby', label: 'Hobby' },
  { tag: 'business', label: 'Business' },
  { tag: 'creative', label: 'Creative' },
  { tag: 'team', label: 'Team' },
  { tag: 'research', label: 'Research' },
  { tag: 'fun', label: 'Fun' },
  { tag: 'other', label: 'Other' }
];

const Demo = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [requestsSent, setRequestsSent] = useState(0);

  const sendAnalytics = useBatchedCallback<AnalyticsEvent[]>(
    () => setRequestsSent((current) => current + 1),
    { size: 5, delay: 1500 }
  );

  const onToggle = (tag: string) => {
    const isSelected = tags.includes(tag);
    const action: AnalyticsEvent['action'] = isSelected ? 'deselected' : 'selected';

    setTags((current) => (isSelected ? current.filter((item) => item !== tag) : [...current, tag]));

    const event: AnalyticsEvent = { tag, action };
    setTotalEvents((current) => current + 1);
    sendAnalytics(event);
  };

  return (
    <section className='flex max-w-md flex-col items-center gap-4 p-4'>
      <h3 className='text-foreground text-center text-base font-semibold'>
        What will you use the service for?
      </h3>

      <div className='flex flex-wrap justify-center gap-1'>
        {INTERESTS.map((interest) => {
          const active = tags.includes(interest.tag);
          return (
            <button
              key={interest.tag}
              className={cn(
                'h-9 rounded-full! px-3 text-sm font-medium transition-colors',
                active
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-foreground hover:bg-accent'
              )}
              data-variant='unstyled'
              type='button'
              onClick={() => onToggle(interest.tag)}
            >
              {interest.label}
            </button>
          );
        })}
      </div>

      <p className='text-muted-foreground max-w-xs text-center text-xs'>
        We batch analytics events for economy of scale. So far we tracked <code>{totalEvents}</code>{' '}
        events and sent <code>{requestsSent}</code> requests.
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
npx useverse@latest add useBatchedCallback
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useMemo, useRef } from 'react';

export type BatchedCallback<Params extends unknown[]> = ((...args: Params) => void) & {
  flush: () => void;
  cancel: () => void;
};

export interface UseBatchedCallbackOptions {
  delay?: number;
  size: number;
}

/**
 * @name useBatchedCallback
 * @description - Hook that batches calls and forwards them to a callback
 * @category Utilities
 * @usage medium
 *
 * @template Params The type of the params
 * @param {(batch: Params[]) => void} callback The callback that receives a batch of calls
 * @param {number} options.size The batch settings with size and optional delay
 * @param {number} [options.delay=1000] The delay (ms) after which pending calls are flushed
 * @returns {BatchedCallback<Params>} The batched callback with flush and cancel helpers
 *
 * @example
 * const delayed = useBatchedCallback((batch) => console.log(batch), { size: 5, delay: 1000 });
 */
export function useBatchedCallback<Params extends unknown[]>(
  callback: (batch: Params[]) => void,
  options: UseBatchedCallbackOptions
): BatchedCallback<Params> {
  const { size, delay } = options;

  const internalCallbackRef = useRef(callback);
  const sizeRef = useRef(size);
  const delayRef = useRef(delay ?? 0);
  const queueRef = useRef<Params[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  internalCallbackRef.current = callback;
  sizeRef.current = Math.max(1, size);
  delayRef.current = Math.max(0, delay ?? 0);

  const clearTimer = () => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const flush = () => {
    if (!queueRef.current.length) return;
    clearTimer();
    const batch = queueRef.current;
    queueRef.current = [];
    internalCallbackRef.current(batch);
  };

  const batched = useMemo(() => {
    const batchedCallback = (...args: Params) => {
      queueRef.current.push(args);
      if (queueRef.current.length >= sizeRef.current) {
        flush();
        return;
      }

      if (!delayRef.current || timerRef.current) return;
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        flush();
      }, delayRef.current);
    };

    batchedCallback.flush = flush;
    batchedCallback.cancel = () => {
      clearTimer();
      queueRef.current = [];
    };

    return batchedCallback as BatchedCallback<Params>;
  }, []);

  useEffect(
    () => () => {
      clearTimer();
    },
    []
  );

  return batched;
}
```

Update the import paths to match your project setup.

## Usage

```tsx
const delayed = useBatchedCallback((batch) => console.log(batch), { size: 5, delay: 1000 });
```

## Type Declarations

```tsx
export type BatchedCallback<Params extends unknown[]> = ((...args: Params) => void) & {
  flush: () => void;
  cancel: () => void;
};

export interface UseBatchedCallbackOptions {
  delay?: number;
  size: number;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(batch: Params[]) => void` | - | The callback that receives a batch of calls |
| options.size | `number` | - | The batch settings with size and optional delay |
| options.delay | `number` | 1000 | The delay (ms) after which pending calls are flushed |

### Returns

`BatchedCallback<Params>` - The batched callback with flush and cancel helpers