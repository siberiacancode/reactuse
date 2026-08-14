---
title: useTime
description: Hook that gives you current time in different values
category: time
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useTime

Hook that gives you current time in different values

## Demo

```tsx
import { usePrevious, useTime } from '@siberiacancode/reactuse';
import { memo } from 'react';

import { cn } from '@/utils/lib';

interface DigitProps {
  value: string;
}

const Digit = memo(({ value }: DigitProps) => {
  const previousValue = usePrevious(value);

  const shouldAnimate = previousValue !== undefined && previousValue !== value;

  return (
    <span className='relative inline-flex h-14 w-9 overflow-hidden'>
      <span
        key={value}
        className={cn(
          'text-foreground absolute inset-0 flex items-center justify-center font-mono text-5xl font-bold tabular-nums',
          shouldAnimate && 'animate-in slide-in-from-bottom-full duration-300'
        )}
      >
        {value}
      </span>
    </span>
  );
});
const Demo = () => {
  const { hours, minutes, seconds, meridiemHours, day, month, year } = useTime();

  const format = (value: number) => String(value).padStart(2, '0');

  const hh = format(hours);
  const mm = format(minutes);
  const ss = format(seconds);

  const date = new Date(year, month - 1, day);
  const fullDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);

  return (
    <section className='flex flex-col items-center gap-4 p-8'>
      <div className='flex items-center'>
        <Digit value={hh[0]} />
        <Digit value={hh[1]} />
        <span className='text-foreground font-mono text-5xl font-bold'>:</span>
        <Digit value={mm[0]} />
        <Digit value={mm[1]} />
        <span className='text-foreground font-mono text-5xl font-bold'>:</span>
        <Digit value={ss[0]} />
        <Digit value={ss[1]} />
        <span className='text-muted-foreground ml-2 self-end pb-2 text-sm font-medium'>
          {meridiemHours.type}
        </span>
      </div>

      <div className='text-muted-foreground text-sm'>{fullDate}</div>
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
npx useverse@latest add useTime
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useState } from 'react';

import { getDate } from '@/utils/helpers';

export interface UseTimeReturn {
  /** The current day of the month (1-31) */
  day: number;
  /** The current hour in 24-hour format (0-23) */
  hours: number;
  /** The current hour in 12-hour format with meridiem type (AM/PM) */
  meridiemHours: { value: number; type: string };
  /** The current minute (0-59) */
  minutes: number;
  /** The current month (1-12) */
  month: number;
  /** The current second (0-59) */
  seconds: number;
  /** The current Unix timestamp in milliseconds */
  timestamp: number;
  /** The current year */
  year: number;
}

/**
 * @name useTime
 * @description - Hook that gives you current time in different values
 * @category Time
 * @usage medium
 *
 * @returns {UseTimeReturn} An object containing the current time
 *
 * @example
 * const { seconds, minutes, hours, meridiemHours, day, month, year, timestamp } = useTime();
 */
export const useTime = (): UseTimeReturn => {
  const [time, setTime] = useState(getDate());

  useEffect(() => {
    const timerId = setInterval(() => setTime(getDate()), 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return time;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { seconds, minutes, hours, meridiemHours, day, month, year, timestamp } = useTime();
```

## Type Declarations

```tsx
export interface UseTimeReturn {
  /** The current day of the month (1-31) */
  day: number;
  /** The current hour in 24-hour format (0-23) */
  hours: number;
  /** The current hour in 12-hour format with meridiem type (AM/PM) */
  meridiemHours: { value: number; type: string };
  /** The current minute (0-59) */
  minutes: number;
  /** The current month (1-12) */
  month: number;
  /** The current second (0-59) */
  seconds: number;
  /** The current Unix timestamp in milliseconds */
  timestamp: number;
  /** The current year */
  year: number;
}
```

## API

### Returns

`UseTimeReturn` - An object containing the current time