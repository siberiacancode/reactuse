---
title: useRafState
description: Hook that returns the value and a function to set the value
category: state
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useRafState

Hook that returns the value and a function to set the value

## Demo

```tsx
import type { UIEvent } from 'react';

import { useRafState } from '@siberiacancode/reactuse';

const getStatus = (progress: number) => {
  if (progress >= 100)
    return {
      title: "You've reached the end",
      description: 'The value updated smoothly on every animation frame as you scrolled.'
    };
  if (progress >= 50)
    return {
      title: 'Halfway there',
      description: 'Each scroll event is throttled to a single update per frame for performance.'
    };
  return {
    title: 'Start scrolling',
    description: 'Scroll inside this area to update the progress in sync with the browser repaint.'
  };
};

const Demo = () => {
  const [progress, setProgress] = useRafState(0);

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const max = scrollHeight - clientHeight;
    setProgress(max > 0 ? Math.round((scrollTop / max) * 100) : 0);
  };

  const status = getStatus(progress);

  return (
    <section className='flex w-full max-w-sm justify-center p-6'>
      <div className='no-scrollbar relative h-72 w-full overflow-y-auto' onScroll={onScroll}>
        <div className='pointer-events-none sticky top-0 flex h-72 flex-col items-center justify-center gap-3 px-4 text-center'>
          <h3 className='text-2xl!'>{status.title}</h3>

          <div className='bg-muted h-1 w-40 overflow-hidden rounded-full'>
            <div className='bg-primary h-full rounded-full' style={{ width: `${progress}%` }} />
          </div>

          <p className='text-muted-foreground max-w-[18rem] text-sm leading-relaxed'>
            {status.description}
          </p>

          <span className='text-muted-foreground font-mono text-xs tabular-nums'>{progress}%</span>
        </div>

        <div className='h-[800px]' />
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
npx useverse@latest add useRafState
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useRef, useState } from 'react';

import { useUnmount } from '../useUnmount/useUnmount';

/* The use raf value params type */
export type UseRafStateReturn<Value> = [Value, (value: Value) => void];

/**
 * @name useRafState
 * @description - Hook that returns the value and a function to set the value
 * @category State
 * @usage low
 *
 * @browserapi requestAnimationFrame https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 *
 * @template Value The type of the value
 * @param {Value} initialValue The initial value
 * @returns {UseRafStateReturn<Value>} An array containing the value and a function to set the value
 *
 * @example
 * const [value, setValue] = useRafState(initialValue);
 */
export const useRafState = <Value>(initialValue: (() => Value) | Value) => {
  const rafIdRef = useRef(0);
  const [value, setValue] = useState(initialValue);

  const set = (value: Value) => {
    cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => setValue(value));
  };

  useUnmount(() => cancelAnimationFrame(rafIdRef.current));

  return [value, set] as const;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const [value, setValue] = useRafState(initialValue);
```

## Type Declarations

```tsx
export type UseRafStateReturn<Value> = [Value, (value: Value) => void];
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| initialValue | `Value` | - | The initial value |

### Returns

`UseRafStateReturn<Value>` - An array containing the value and a function to set the value