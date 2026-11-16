---
title: useStopwatch
description: Hook that creates a stopwatch functionality
category: time
usage: high
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1776172602000
---

# useStopwatch

Hook that creates a stopwatch functionality

## Demo

```tsx
import { useStopwatch } from '@siberiacancode/reactuse';
import { PauseIcon, PlayIcon, RotateCcwIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

const SIZE = 240;
const CENTER = SIZE / 2;
const RADIUS = 100;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TICKS = 60;

const pad = (value: number) => String(value).padStart(2, '0');

const Demo = () => {
  const stopwatch = useStopwatch();
  const running = !stopwatch.paused;

  const secondInMinute = stopwatch.count % 60;
  const progress = secondInMinute / 60;
  const dashoffset = CIRCUMFERENCE * (1 - progress);

  const animate = secondInMinute !== 0;

  const onReset = () => {
    stopwatch.pause();
    stopwatch.reset();
  };

  return (
    <section className='flex w-full max-w-xs flex-col items-center gap-8 p-6'>
      <div className='relative' style={{ width: SIZE, height: SIZE }}>
        <svg className='-rotate-90' height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE}>
          {Array.from({ length: TICKS }).map((_, i) => {
            const angle = (i / TICKS) * 2 * Math.PI;
            const major = i % 5 === 0;
            const outer = RADIUS - 8;
            const inner = outer - (major ? 7 : 4);
            const x1 = CENTER + outer * Math.cos(angle);
            const y1 = CENTER + outer * Math.sin(angle);
            const x2 = CENTER + inner * Math.cos(angle);
            const y2 = CENTER + inner * Math.sin(angle);
            return (
              <line
                key={i}
                className='stroke-muted-foreground/25'
                strokeLinecap='round'
                strokeWidth={major ? 2.5 : 1.5}
                x1={x1}
                x2={x2}
                y1={y1}
                y2={y2}
              />
            );
          })}

          <circle
            className='stroke-muted/60'
            cx={CENTER}
            cy={CENTER}
            fill='none'
            r={RADIUS}
            strokeWidth={9}
          />

          <circle
            className={cn(
              'stroke-primary',
              animate && 'transition-[stroke-dashoffset] duration-1000 ease-linear'
            )}
            cx={CENTER}
            cy={CENTER}
            fill='none'
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashoffset}
            strokeLinecap='round'
            strokeWidth={9}
          />
        </svg>

        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <span className='text-foreground font-mono text-3xl font-light tracking-tight tabular-nums'>
            {pad(stopwatch.hours)}:{pad(stopwatch.minutes)}:{pad(stopwatch.seconds)}
          </span>
          <span className='text-muted-foreground mt-1 text-[10px] tracking-[0.2em] uppercase'>
            {running ? 'Running' : stopwatch.count > 0 ? 'Paused' : 'Stopwatch'}
          </span>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <button
          aria-label='Reset'
          className='rounded-full!'
          data-size='icon-lg'
          data-variant='ghost'
          disabled={stopwatch.count === 0 && stopwatch.paused}
          type='button'
          onClick={onReset}
        >
          <RotateCcwIcon className='size-5' />
        </button>

        <button
          aria-label={running ? 'Pause' : 'Start'}
          className='size-14! rounded-full!'
          data-size='icon-lg'
          data-variant={running ? 'secondary' : 'default'}
          type='button'
          onClick={() => stopwatch.toggle()}
        >
          {running ? (
            <PauseIcon className='size-5' fill='currentColor' />
          ) : (
            <PlayIcon className='size-5 translate-x-0.5' fill='currentColor' />
          )}
        </button>

        <span aria-hidden className='size-9' />
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
npx useverse@latest add useStopwatch
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useState } from 'react';

const getStopwatchTime = (time: number) => {
  if (!time)
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      count: 0
    };

  const days = Math.floor(time / 86400);
  const hours = Math.floor((time % 86400) / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  return { days, hours, minutes, seconds, count: time };
};

/** The use stopwatch return type */
export interface UseStopwatchReturn {
  /** The total count of the stopwatch */
  count: number;
  /** The day count of the stopwatch */
  days: number;
  /** The hour count of the stopwatch */
  hours: number;
  /** The minute count of the stopwatch */
  minutes: number;
  /** The paused state of the stopwatch */
  paused: boolean;
  /** The second count of the stopwatch */
  seconds: number;
  /** The function to pause the stopwatch */
  pause: () => void;
  /** The function to reset the stopwatch */
  reset: () => void;
  /** The function to start the stopwatch */
  start: () => void;
  /** The function to toggle the stopwatch */
  toggle: (active?: boolean) => void;
}

/** The use stopwatch options */
export interface UseStopwatchOptions {
  /** The immediately state of the timer */
  immediately?: boolean;
}

interface UseStopwatch {
  (initialTime?: number, options?: UseStopwatchOptions): UseStopwatchReturn;
  (options?: UseStopwatchOptions & { initialTime?: number }): UseStopwatchReturn;
}
/**
 * @name useStopwatch
 * @description - Hook that creates a stopwatch functionality
 * @category Time
 * @usage high
 *
 * @overload
 * @param {number} [initialTime=0] The initial time of the timer
 * @param {boolean} [options.immediately=false] Start the stopwatch immediately
 * @returns {UseStopwatchReturn} An object containing the current time and functions to interact with the timer
 *
 * @example
 * const { seconds, minutes, start, pause, reset } = useStopwatch(1000, { immediately: false });
 *
 * @overload
 * @param {number} [options.initialTime=0] The initial time of the timer
 * @param {boolean} [options.immediately=false] Start the stopwatch immediately
 * @returns {UseStopwatchReturn} An object containing the current time and functions to interact with the timer
 *
 * @example
 * const { seconds, minutes, start, pause, reset } = useStopwatch({ initialTime: 1000, immediately: false });
 */
export const useStopwatch = ((...params: any[]) => {
  const initialTime =
    (typeof params[0] === 'number'
      ? (params[0] as number | undefined)
      : (params[0] as UseStopwatchOptions & { initialTime?: number })?.initialTime) ?? 0;

  const options =
    typeof params[0] === 'number'
      ? (params[1] as UseStopwatchOptions | undefined)
      : (params[0] as (UseStopwatchOptions & { initialTime?: number }) | undefined);

  const immediately = options?.immediately ?? false;

  const [count, setCount] = useState(initialTime);
  const [paused, setPaused] = useState(!immediately);

  useEffect(() => {
    setCount(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (paused) return;
    const onInterval = () => {
      setCount((currentCount) => currentCount + 1);
    };

    const interval = setInterval(onInterval, 1000);
    return () => clearInterval(interval);
  }, [paused]);

  const time = getStopwatchTime(count);

  const pause = () => setPaused(true);
  const start = () => setPaused(false);
  const reset = () => setCount(initialTime);
  const toggle = (active = !paused) => setPaused(active);

  return {
    ...time,
    paused,
    pause,
    start,
    reset,
    toggle
  };
}) as UseStopwatch;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { seconds, minutes, start, pause, reset } = useStopwatch(1000, { immediately: false });
// or
const { seconds, minutes, start, pause, reset } = useStopwatch({ initialTime: 1000, immediately: false });
```

## Type Declarations

```tsx
export interface UseStopwatchReturn {
  /** The total count of the stopwatch */
  count: number;
  /** The day count of the stopwatch */
  days: number;
  /** The hour count of the stopwatch */
  hours: number;
  /** The minute count of the stopwatch */
  minutes: number;
  /** The paused state of the stopwatch */
  paused: boolean;
  /** The second count of the stopwatch */
  seconds: number;
  /** The function to pause the stopwatch */
  pause: () => void;
  /** The function to reset the stopwatch */
  reset: () => void;
  /** The function to start the stopwatch */
  start: () => void;
  /** The function to toggle the stopwatch */
  toggle: (active?: boolean) => void;
}

export interface UseStopwatchOptions {
  /** The immediately state of the timer */
  immediately?: boolean;
}

interface UseStopwatch {
  (initialTime?: number, options?: UseStopwatchOptions): UseStopwatchReturn;
  (options?: UseStopwatchOptions & { initialTime?: number }): UseStopwatchReturn;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| initialTime | `number` | 0 | The initial time of the timer |
| options.immediately | `boolean` | false | Start the stopwatch immediately |

#### Returns

`UseStopwatchReturn` - An object containing the current time and functions to interact with the timer

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.initialTime | `number` | 0 | The initial time of the timer |
| options.immediately | `boolean` | false | Start the stopwatch immediately |

#### Returns

`UseStopwatchReturn` - An object containing the current time and functions to interact with the timer