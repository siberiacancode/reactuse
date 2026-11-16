---
title: usePrevious
description: Hook that returns the previous value
category: utilities
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# usePrevious

Hook that returns the previous value

## Demo

```tsx
import { usePrevious, useQuery } from '@siberiacancode/reactuse';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

const fetchRate = async () => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return Number((1.05 + (Math.random() - 0.5) * 0.04).toFixed(4));
};

const Demo = () => {
  const rateQuery = useQuery(fetchRate, { refetchInterval: 2000 });
  const previousRate = usePrevious(rateQuery.data);

  const price = rateQuery.data;
  const diff = price !== undefined && previousRate !== undefined ? price - previousRate : 0;
  const up = diff >= 0;
  const percent = previousRate ? (diff / previousRate) * 100 : 0;

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date());

  return (
    <section className='flex w-full justify-center p-6'>
      <div className='bg-card flex w-full max-w-xs flex-col gap-4 rounded-xl p-5'>
        <span className='text-muted-foreground text-xs tabular-nums'>{formattedDate}</span>

        <div className='flex items-center justify-between gap-3'>
          <div className='flex h-9 items-center'>
            {rateQuery.isLoading && <div className='bg-muted h-9 w-32 animate-pulse rounded-md' />}
            {!rateQuery.isLoading && !!price && (
              <span className='text-foreground font-mono text-3xl leading-none font-bold tabular-nums'>
                {price.toFixed(4)}
              </span>
            )}
          </div>

          <div className='flex h-7 items-center'>
            {rateQuery.isLoading && <div className='bg-muted h-7 w-16 animate-pulse rounded-md' />}
            {!rateQuery.isLoading && !!price && (
              <div
                className={cn(
                  'flex h-7 items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold tabular-nums',
                  up
                    ? 'bg-green-500/10 text-green-600 dark:text-green-500'
                    : 'bg-destructive/10 text-destructive'
                )}
              >
                {up ? <ArrowUpIcon className='size-3.5' /> : <ArrowDownIcon className='size-3.5' />}
                {percent >= 0 ? '+' : ''}
                {percent.toFixed(2)}%
              </div>
            )}
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <span className='text-foreground text-sm font-semibold'>EUR/USD</span>
          <span className='text-muted-foreground text-xs'>Euro / US Dollar</span>
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
npx useverse@latest add usePrevious
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useRef } from 'react';

export interface UsePreviousOptions<Value> {
  equality: (a: Value, b: Value) => boolean;
}

/**
 * @name usePrevious
 * @description - Hook that returns the previous value
 * @category Utilities
 * @usage low
 *
 * @template Value The type of the value
 * @param {Value} value The value to get the previous value
 * @param {(a: Value, b: Value) => boolean} [options.equality] The custom equality function to determine if the value has changed
 * @returns {Value | undefined} The previous value
 *
 * @example
 * const prevValue = usePrevious(value);
 */
export const usePrevious = <Value>(value: Value, options?: UsePreviousOptions<Value>) => {
  const currentRef = useRef<Value>(value);
  const previousRef = useRef<Value>(undefined);

  const equality = options?.equality ?? Object.is;

  if (!equality(value, currentRef.current)) {
    previousRef.current = currentRef.current;
    currentRef.current = value;
  }

  return previousRef.current;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const prevValue = usePrevious(value);
```

## Type Declarations

```tsx
export interface UsePreviousOptions<Value> {
  equality: (a: Value, b: Value) => boolean;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| value | `Value` | - | The value to get the previous value |
| options.equality | `(a: Value, b: Value) => boolean` | - | The custom equality function to determine if the value has changed |

### Returns

`Value | undefined` - The previous value