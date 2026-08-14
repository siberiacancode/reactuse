---
title: useQueue
description: Hook that manages a queue
category: state
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1782130513000
---

# useQueue

Hook that manages a queue

## Demo

```tsx
import { useInterval, useQueue } from '@siberiacancode/reactuse';
import { CheckIcon } from 'lucide-react';
import { useRef } from 'react';

interface Order {
  id: string;
  items: string[];
  number: number;
}

const EMOJIS = ['🍔', '🍟', '🌭', '🥤', '🍕', '🌮', '🍗', '🍦'];

const createOrder = (number: number): Order => {
  const count = 1 + Math.floor(Math.random() * 3);

  const items = Array.from(
    { length: count },
    () => EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
  );
  return { id: crypto.randomUUID(), number, items };
};
const formatNumber = (number: number) => `#${String(number).padStart(3, '0')}`;

const Demo = () => {
  const counterRef = useRef(5);

  const { queue, add, remove, first, size } = useQueue<Order>(
    Array.from({ length: 4 }, (_, index) => createOrder(5 + index))
  );

  useInterval(() => {
    if (size >= 12) return;
    counterRef.current += 1;
    add(createOrder(counterRef.current + 3));
  }, 1800);

  const waiting = queue.slice(1);

  return (
    <section className='flex w-full max-w-md flex-col gap-4 p-5'>
      <div className='flex items-center gap-3'>
        <h3 className='text-lg!'>Pickup counter</h3>
        <span className='bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums'>
          {size} waiting
        </span>
      </div>

      <div className='bg-card border-border flex min-h-32 items-center gap-4 rounded-2xl border p-5'>
        {first && (
          <>
            <div className='flex flex-1 flex-col gap-1'>
              <span className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
                Now serving
              </span>
              <div className='flex items-center gap-3'>
                <span className='text-foreground font-mono text-4xl font-bold tabular-nums'>
                  {formatNumber(first.number)}
                </span>
                <div className='flex items-center gap-1'>
                  {first.items.map((emoji, index) => (
                    <span key={index} className='text-2xl'>
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>
              <span className='text-muted-foreground text-xs'>
                {first.items.length} {first.items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <button
              aria-label='Complete order'
              className='size-14! rounded-full!'
              data-size='icon-lg'
              type='button'
              onClick={remove}
            >
              <CheckIcon className='size-6' />
            </button>
          </>
        )}

        {!first && (
          <span className='text-muted-foreground w-full py-4 text-center text-sm'>
            Waiting for orders…
          </span>
        )}
      </div>

      <div className='flex items-center gap-3'>
        <span className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
          Up next
        </span>
        <div className='bg-border h-px flex-1' />
        <span className='text-muted-foreground text-xs tabular-nums'>waiting</span>
      </div>

      <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
        {waiting.map((order, index) => (
          <div
            key={order.id}
            className='border-border bg-card animate-in fade-in flex items-center gap-3 rounded-xl border p-3'
          >
            <span className='border-border text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium tabular-nums'>
              {index + 1}
            </span>
            <span className='text-foreground font-mono text-sm font-semibold tabular-nums'>
              {formatNumber(order.number)}
            </span>
            <div className='ml-auto flex items-center gap-1'>
              {order.items.map((emoji, emojiIndex) => (
                <span key={emojiIndex} className='text-lg'>
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        ))}

        {!waiting.length && (
          <span className='text-muted-foreground col-span-full py-2 text-center text-xs'>
            No orders waiting
          </span>
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
npx useverse@latest add useQueue
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useState } from 'react';

/** The use queue return type */
export interface UseQueueReturn<Value> {
  /** Get the first element of the queue */
  first: Value;
  /** Get the last element of the queue */
  last: Value;
  /** The current queue */
  queue: Value[];
  /** Get the size of the queue */
  size: number;
  /** Add an element to the queue */
  add: (element: Value) => void;
  /** Clear the queue */
  clear: () => void;
  /** Remove an element from the queue */
  remove: () => Value;
}

/**
 * @name useQueue
 * @description - Hook that manages a queue
 * @category State
 * @usage medium
 *
 * @template Value The type of the value
 * @param {Value[]} [initialValue=[]] The initial value of the queue
 * @returns {UseQueueReturn} An object containing the current queue and functions to interact with the queue
 *
 * @example
 * const { queue, add, remove, clear, first, last, size } = useQueue([1, 2, 3]);
 */
export const useQueue = <Value>(initialValue: Value[] = []): UseQueueReturn<Value> => {
  const [queue, setQueue] = useState(initialValue);

  const add = (element: Value) => setQueue((queue) => [...queue, element]);
  const clear = () => setQueue([]);
  const remove = () => {
    const [first] = queue;
    setQueue((rest) => rest.slice(1));
    return first;
  };

  return {
    add,
    remove,
    clear,
    first: queue[0],
    last: queue[queue.length - 1],
    size: queue.length,
    queue
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { queue, add, remove, clear, first, last, size } = useQueue([1, 2, 3]);
```

## Type Declarations

```tsx
export interface UseQueueReturn<Value> {
  /** Get the first element of the queue */
  first: Value;
  /** Get the last element of the queue */
  last: Value;
  /** The current queue */
  queue: Value[];
  /** Get the size of the queue */
  size: number;
  /** Add an element to the queue */
  add: (element: Value) => void;
  /** Clear the queue */
  clear: () => void;
  /** Remove an element from the queue */
  remove: () => Value;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| initialValue | `Value[]` | [] | The initial value of the queue |

### Returns

`UseQueueReturn` - An object containing the current queue and functions to interact with the queue