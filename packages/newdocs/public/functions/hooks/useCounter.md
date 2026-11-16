---
title: useCounter
description: Hook that manages a counter
category: state
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useCounter

Hook that manages a counter

## Demo

```tsx
import { useCounter } from '@siberiacancode/reactuse';
import { MinusIcon, PlusIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

const getGuestLabel = (count: number) => {
  if (count === 1) return 'Just you';
  if (count === 2) return 'For two';
  if (count <= 4) return 'Small group';
  if (count <= 7) return 'Medium group';
  return 'Large party';
};

const Demo = () => {
  const counter = useCounter(2, { min: 1, max: 10 });

  return (
    <div className='flex flex-col items-center gap-3'>
      <span className='text-muted-foreground text-sm font-medium tracking-widest'>GUESTS</span>

      <div className='flex items-center gap-6'>
        <button
          className={cn(counter.value <= 1 && 'opacity-25')}
          data-size='icon'
          data-variant='ghost'
          type='button'
          onClick={() => counter.dec()}
        >
          <MinusIcon strokeWidth={1.5} />
        </button>

        <span className='w-26 text-center text-7xl font-light tabular-nums'>{counter.value}</span>

        <button
          className={cn(counter.value >= 10 && 'opacity-25')}
          data-size='icon'
          data-variant='ghost'
          type='button'
          onClick={() => counter.inc()}
        >
          <PlusIcon strokeWidth={1.5} />
        </button>
      </div>

      <span className='text-muted-foreground text-sm'>{getGuestLabel(counter.value)}</span>
    </div>
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
npx useverse@latest add useCounter
```

### Manual

Copy and paste the following code into your project.

```tsx
import type { Dispatch, SetStateAction } from 'react';

import { useState } from 'react';

/** The use counter options */
export interface UseCounterOptions {
  /** The max of count value */
  max?: number;
  /** The min of count value */
  min?: number;
}

/** The use counter return type */
export interface UseCounterReturn {
  /** Function to set a specific value to the counter */
  set: Dispatch<SetStateAction<number>>;
  /** The current count value */
  value: number;
  /** Function to decrement the counter */
  dec: (value?: number) => void;
  /** Function to increment the counter */
  inc: (value?: number) => void;
  /** Function to reset the counter to its initial value. */
  reset: () => void;
}

export interface UseCounter {
  (initialValue?: number, options?: UseCounterOptions): UseCounterReturn;

  (options: UseCounterOptions & { initialValue?: number }, initialValue?: never): UseCounterReturn;
}

/**
 * @name useCounter
 * @description - Hook that manages a counter
 * @category State
 * @usage low

 * @overload
 * @param {number} [initialValue=0] The initial number value
 * @param {number} [options.min=Number.NEGATIVE_INFINITY] The min of count value
 * @param {number} [options.max=Number.POSITIVE_INFINITY] The max of count value
 * @returns {UseCounterReturn} An object containing the current count and functions to interact with the counter

 * @overload
 * @param {number} [params.initialValue=0] The initial number value
 * @param {number} [params.min=Number.NEGATIVE_INFINITY] The min of count value
 * @param {number} [params.max=Number.POSITIVE_INFINITY] The max of count value
 * @returns {UseCounterReturn} An object containing the current count and functions to interact with the counter
 *
 * @example
 * const { count, dec, inc, reset, set } = useCounter(5);
 *
 * @example
 * const { count, dec, inc, reset, set } = useCounter({ initialValue: 5, min: 0, max: 10 });
 */
export const useCounter = ((...params: any[]) => {
  const initialValue =
    typeof params[0] === 'number'
      ? params[0]
      : (params[0] as UseCounterOptions & { initialValue?: number })?.initialValue;
  const { max = Number.POSITIVE_INFINITY, min = Number.NEGATIVE_INFINITY } =
    typeof params[0] === 'number'
      ? ((params[1] ?? {}) as UseCounterOptions)
      : ((params[0] ?? {}) as UseCounterOptions & { initialValue?: number });

  const [value, setValue] = useState(initialValue ?? 0);

  const inc = (value: number = 1) => {
    setValue((prevValue) => {
      if (typeof max === 'number' && prevValue === max) return prevValue;
      return Math.max(Math.min(max, prevValue + value), min);
    });
  };

  const dec = (value: number = 1) => {
    setValue((prevValue) => {
      if (typeof min === 'number' && prevValue === min) return prevValue;
      return Math.min(Math.max(min, prevValue - value), max);
    });
  };

  const reset = () => {
    const value = initialValue ?? 0;
    if (typeof max === 'number' && value > max) return setValue(max);
    if (typeof min === 'number' && value < min) return setValue(min);
    setValue(value);
  };

  const set = (value: SetStateAction<number>) => {
    setValue((prevValue) => {
      const updatedCount = Math.max(
        min,
        Math.min(max, typeof value === 'number' ? value : value(prevValue))
      );

      return updatedCount;
    });
  };

  return { value, set, inc, dec, reset };
}) as UseCounter;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { count, dec, inc, reset, set } = useCounter(5);
// or
const { count, dec, inc, reset, set } = useCounter({ initialValue: 5, min: 0, max: 10 });
```

## Type Declarations

```tsx
import type { Dispatch, SetStateAction } from 'react';

export interface UseCounterOptions {
  /** The max of count value */
  max?: number;
  /** The min of count value */
  min?: number;
}

export interface UseCounterReturn {
  /** Function to set a specific value to the counter */
  set: Dispatch<SetStateAction<number>>;
  /** The current count value */
  value: number;
  /** Function to decrement the counter */
  dec: (value?: number) => void;
  /** Function to increment the counter */
  inc: (value?: number) => void;
  /** Function to reset the counter to its initial value. */
  reset: () => void;
}

export interface UseCounter {
  (initialValue?: number, options?: UseCounterOptions): UseCounterReturn;

  (options: UseCounterOptions & { initialValue?: number }, initialValue?: never): UseCounterReturn;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| initialValue | `number` | 0 | The initial number value |
| options.min | `number` | Number.NEGATIVE_INFINITY | The min of count value |
| options.max | `number` | Number.POSITIVE_INFINITY | The max of count value |

#### Returns

`UseCounterReturn` - An object containing the current count and functions to interact with the counter

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| params.initialValue | `number` | 0 | The initial number value |
| params.min | `number` | Number.NEGATIVE_INFINITY | The min of count value |
| params.max | `number` | Number.POSITIVE_INFINITY | The max of count value |

#### Returns

`UseCounterReturn` - An object containing the current count and functions to interact with the counter