---
title: useMemory
description: Hook that gives you current memory usage
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1780638301000
---

# useMemory

Hook that gives you current memory usage

## Demo

```tsx
import { useMemory } from '@siberiacancode/reactuse';
import { useState } from 'react';

const formatBytes = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
};

const HISTORY_LENGTH = 60;

const buildSmoothPath = (coords: { x: number; y: number }[]) => {
  if (coords.length < 2) return '';
  let path = `M ${coords[0].x},${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i === 0 ? 0 : i - 1];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return path;
};

const Demo = () => {
  const [history, setHistory] = useState<number[]>([]);
  const [peak, setPeak] = useState(0);

  const memory = useMemory((value) => {
    setHistory((current) => [...current, value.usedJSHeapSize].slice(-HISTORY_LENGTH));
    setPeak((current) => Math.max(current, value.usedJSHeapSize));
  });

  const used = memory.value.usedJSHeapSize ?? 0;
  const limit = memory.value.jsHeapSizeLimit ?? 1;

  if (!memory.supported)
    return (
      <p>
        API not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory'
          rel='noreferrer'
          target='_blank'
        >
          API
        </a>
      </p>
    );

  const top = peak * 1.15 || 1;

  const coords = history.map((value, index) => {
    const x = (index / (HISTORY_LENGTH - 1)) * 100;
    const normalized = value / top;
    const y = 95 - normalized * 85;
    return { x, y };
  });

  const linePath = buildSmoothPath(coords);
  const areaPath =
    coords.length > 1
      ? `${linePath} L ${coords[coords.length - 1].x},100 L ${coords[0].x},100 Z`
      : '';

  const gridLines = [0, 25, 50, 75, 100];

  return (
    <section className='flex w-full max-w-lg flex-col gap-3 p-4'>
      <div className='flex items-center justify-between'>
        <span className='text-foreground text-sm font-semibold'>JS HEAP USAGE</span>
        <span className='text-muted-foreground font-mono text-xs tabular-nums'>
          {((used / limit) * 100).toFixed(1)}%
        </span>
      </div>

      <div className='bg-background relative h-44 w-full overflow-hidden rounded-lg border'>
        <svg
          className='absolute inset-0 h-full w-full'
          preserveAspectRatio='none'
          viewBox='0 0 100 100'
        >
          <defs>
            <linearGradient
              gradientUnits='userSpaceOnUse'
              id='heap-line'
              x1='0'
              x2='0'
              y1='0'
              y2='1'
            >
              <stop offset='0%' stopColor='#ef4444' />
              <stop offset='50%' stopColor='#eab308' />
              <stop offset='100%' stopColor='#22c55e' />
            </linearGradient>
            <linearGradient
              gradientUnits='userSpaceOnUse'
              id='heap-area'
              x1='0'
              x2='0'
              y1='0'
              y2='1'
            >
              <stop offset='0%' stopColor='#ef4444' stopOpacity='0.2' />
              <stop offset='100%' stopColor='#22c55e' stopOpacity='0' />
            </linearGradient>
          </defs>

          {gridLines.map((y) => (
            <line
              key={y}
              className='text-border'
              stroke='currentColor'
              strokeWidth='0.3'
              vectorEffect='non-scaling-stroke'
              x1='0'
              x2='100'
              y1={y}
              y2={y}
            />
          ))}

          {coords.length > 1 && (
            <>
              <path d={areaPath} fill='url(#heap-area)' />
              <path
                d={linePath}
                fill='none'
                stroke='url(#heap-line)'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                vectorEffect='non-scaling-stroke'
              />
            </>
          )}
        </svg>
      </div>

      <div className='grid grid-cols-3 gap-3'>
        <div className='flex flex-col gap-0.5'>
          <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>Used</span>
          <span className='text-foreground font-mono text-sm font-semibold tabular-nums'>
            {formatBytes(used)}
          </span>
        </div>
        <div className='flex flex-col gap-0.5'>
          <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>Peak</span>
          <span className='text-foreground font-mono text-sm font-semibold tabular-nums'>
            {formatBytes(peak)}
          </span>
        </div>
        <div className='flex flex-col gap-0.5'>
          <span className='text-muted-foreground text-[10px] tracking-wider uppercase'>Limit</span>
          <span className='text-foreground font-mono text-sm font-semibold tabular-nums'>
            {formatBytes(limit)}
          </span>
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
npx useverse@latest add useMemory
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Performance {
    memory: {
      readonly jsHeapSizeLimit: number;
      readonly totalJSHeapSize: number;
      readonly usedJSHeapSize: number;
    };
  }
}

/** The use memory return type */
export interface UseMemoryReturn {
  /** The memory supported status */
  supported: boolean;
  /** The current memory usage */
  value: Performance['memory'];
}

/** The use memory callback type */
export type UseMemoryCallback = (value: Performance['memory']) => void;

/**
 * @name useMemory
 * @description - Hook that gives you current memory usage
 * @category Browser
 * @usage low
 *
 * @browserapi performance.memory https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory
 *
 * @param {(value: Performance['memory']) => void} [callback] The callback to execute when the memory usage changes
 * @returns {UseMemoryReturn} An object containing the current memory usage
 *
 * @example
 * const { supported, value } = useMemory();
 *
 * @example
 * const { value } = useMemory((nextValue) => {
 *   console.log(nextValue.usedJSHeapSize);
 * });
 */
export const useMemory = (callback?: UseMemoryCallback): UseMemoryReturn => {
  const supported =
    typeof performance !== 'undefined' && 'memory' in performance && !!performance.memory;

  const [value, setValue] = useState<Performance['memory']>(
    supported
      ? performance.memory
      : {
          jsHeapSizeLimit: 0,
          totalJSHeapSize: 0,
          usedJSHeapSize: 0
        }
  );

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!supported) return;

    const intervalId = setInterval(() => {
      const nextValue = performance.memory;
      setValue(nextValue);
      callbackRef.current?.(nextValue);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [supported]);

  return { supported, value };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { supported, value } = useMemory();
// or
const { value } = useMemory((nextValue) => { console.log(nextValue.usedJSHeapSize); });
```

## Type Declarations

```tsx
interface Performance {
    memory: {
      readonly jsHeapSizeLimit: number;
      readonly totalJSHeapSize: number;
      readonly usedJSHeapSize: number;
    };
  }

export interface UseMemoryReturn {
  /** The memory supported status */
  supported: boolean;
  /** The current memory usage */
  value: Performance['memory'];
}

export type UseMemoryCallback = (value: Performance['memory']) => void;
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(value: Performance['memory']) => void` | - | The callback to execute when the memory usage changes |

### Returns

`UseMemoryReturn` - An object containing the current memory usage