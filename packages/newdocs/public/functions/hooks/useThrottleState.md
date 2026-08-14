---
title: useThrottleState
description: Hook that creates a throttled state
category: utilities
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1756623419000
---

# useThrottleState

Hook that creates a throttled state

## Demo

```tsx
import type { MouseEvent } from 'react';

import { useThrottleState } from '@siberiacancode/reactuse';

interface Point {
  x: number;
  y: number;
}

const Demo = () => {
  const [point, setPoint] = useThrottleState<Point | undefined>(undefined, 100);

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPoint({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  const onMouseLeave = () => setPoint(undefined);

  return (
    <section className='flex w-full max-w-md flex-col p-4'>
      <div
        className='border-border bg-card relative h-72 w-full overflow-hidden rounded-xl border'
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
      >
        {point && (
          <span
            className='bg-primary pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[left,top] duration-100 ease-out'
            style={{ left: point.x, top: point.y }}
          />
        )}

        <div className='text-muted-foreground pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs'>
          Move your cursor — the dot follows
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
npx useverse@latest add useThrottleState
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useState } from 'react';

import { useThrottleCallback } from '../useThrottleCallback/useThrottleCallback';

/**
 * @name useThrottleState
 * @description - Hook that creates a throttled state
 * @category Utilities
 * @usage medium
 *
 * @template Value The type of the value
 * @param {Value} value The value to be throttled
 * @param {number} delay The delay in milliseconds
 * @returns {[Value, (value: Value) => void]} The throttled state
 *
 * @example
 * const [throttledValue, setThrottledValue] = useThrottleState(value, 500);
 */
export const useThrottleState = <Value>(initialValue: Value, delay: number) => {
  const [throttledValue, setThrottledValue] = useState(initialValue);
  const throttledSetState = useThrottleCallback(setThrottledValue, delay);

  return [throttledValue, throttledSetState] as const;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const [throttledValue, setThrottledValue] = useThrottleState(value, 500);
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| value | `Value` | - | The value to be throttled |
| delay | `number` | - | The delay in milliseconds |

### Returns

`[Value, (value: Value) => void]` - The throttled state