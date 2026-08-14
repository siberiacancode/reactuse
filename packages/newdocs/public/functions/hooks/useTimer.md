---
title: useTimer
description: Hook that creates a timer functionality
category: time
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useTimer

Hook that creates a timer functionality

## Demo

```tsx
import type { ClipboardEvent, KeyboardEvent, MouseEvent } from 'react';

import { useMutation, useTimer } from '@siberiacancode/reactuse';
import { Loader2Icon, ShieldCheckIcon } from 'lucide-react';
import { useRef, useState } from 'react';

const LENGTH = 6;

const sendCode = () =>
  new Promise<number>((resolve) => {
    const seconds = Math.floor(Math.random() * 16) + 5;
    setTimeout(resolve, 1200, seconds);
  });

const Demo = () => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const timer = useTimer(10);
  const sendCodeMutation = useMutation(sendCode);

  const focusLastEmpty = (event: MouseEvent<HTMLInputElement>) => {
    event.preventDefault();
    const lastEmpty = code.findIndex((digit) => !digit);
    const target = lastEmpty === -1 ? LENGTH - 1 : lastEmpty;
    inputsRef.current[target]?.focus();
  };

  const onChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);

    setCode((currentCode) => {
      const next = [...currentCode];
      next[index] = digit;
      return next;
    });

    if (digit && index < LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const onKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const digits = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, LENGTH)
      .split('');
    if (!digits.length) return;
    setCode(Array.from({ length: LENGTH }, (_, index) => digits[index] ?? ''));
    const cell = inputsRef.current[Math.min(digits.length, LENGTH - 1)];
    if (!cell) return;
    cell.focus();
  };

  const onResend = async () => {
    const seconds = await sendCodeMutation.mutateAsync();
    timer.restart(seconds);
  };

  const filled = code.every(Boolean);

  return (
    <section className='flex w-full max-w-xs flex-col items-center gap-4 p-6 text-center'>
      <div className='bg-muted flex size-16 items-center justify-center rounded-full'>
        <ShieldCheckIcon className='size-8' />
      </div>

      <div className='flex flex-col gap-1'>
        <h3 className='text-xl!'>Enter OTP</h3>
        <p className='text-muted-foreground text-xs'>
          We've sent a 6-digit code to your phone. Enter it below to verify your number.
        </p>
      </div>

      <div className='flex items-center gap-2'>
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputsRef.current[index] = element;
            }}
            autoComplete='one-time-code'
            className='focus-visible:border-ring focus-visible:ring-ring/50 h-12! w-11 text-center text-lg font-semibold tabular-nums focus-visible:ring-3'
            inputMode='numeric'
            maxLength={1}
            type='text'
            value={digit}
            onChange={(event) => onChange(index, event.target.value)}
            onKeyDown={(event) => onKeyDown(index, event)}
            onMouseDown={focusLastEmpty}
            onPaste={onPaste}
          />
        ))}
      </div>

      <button className='w-full' disabled={!filled} type='button'>
        Verify
      </button>

      <div className='flex items-center gap-1.5 text-xs'>
        {timer.active ? (
          <span className='text-muted-foreground tabular-nums'>Resend in {timer.seconds}s</span>
        ) : (
          <button
            className='text-foreground inline-flex items-center gap-1 font-medium hover:underline disabled:opacity-50'
            data-variant='unstyled'
            disabled={sendCodeMutation.isLoading}
            type='button'
            onClick={onResend}
          >
            {sendCodeMutation.isLoading && <Loader2Icon className='size-3 animate-spin' />}
            {sendCodeMutation.isLoading ? 'Sending…' : 'Resend code'}
          </button>
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
npx useverse@latest add useTimer
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

import { useDidUpdate } from '../useDidUpdate/useDidUpdate';

export type PositiveInteger<Value extends number> = `${Value}` extends `-${any}` | `${any}.${any}`
  ? never
  : Value;

export const getTimeFromSeconds = (timestamp: number) => {
  const roundedTimestamp = Math.ceil(timestamp);
  const days = Math.floor(roundedTimestamp / (60 * 60 * 24));
  const hours = Math.floor((roundedTimestamp % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((roundedTimestamp % (60 * 60)) / 60);
  const seconds = Math.floor(roundedTimestamp % 60);

  return {
    seconds,
    minutes,
    hours,
    days
  };
};

/** The use timer options type */
export interface UseTimerOptions {
  /** Whether the timer should start automatically */
  immediately?: boolean;
  /** The function to be executed when the timer is expired */
  onExpire?: () => void;
  /** The function to be executed when the timer is started */
  onStart?: () => void;
  /** Callback function to be executed on each tick of the timer */
  onTick?: (seconds: number) => void;
}

/** The use timer return type */
export interface UseTimerReturn {
  /** flag to indicate if timer is active or not */
  active: boolean;
  /** The total count of the timer */
  count: number;
  /** The day count of the timer */
  days: number;
  /** The hour count of the timer */
  hours: number;
  /** The minute count of the timer */
  minutes: number;
  /** The second count of the timer */
  seconds: number;
  /** The function to clear the timer */
  clear: () => void;
  /** The function to decrease the timer */
  decrease: (seconds: PositiveInteger<number>) => void;
  /** The function to increase the timer */
  increase: (seconds: PositiveInteger<number>) => void;
  /** The function to pause the timer */
  pause: () => void;
  /** The function to restart the timer */
  restart: (time: PositiveInteger<number>, immediately?: boolean) => void;
  /** The function to resume the timer */
  resume: () => void;
  /** The function to start the timer */
  start: () => void;
  /** The function to toggle the timer */
  toggle: () => void;
}

export interface UseTimer {
  (): UseTimerReturn;

  (seconds: PositiveInteger<number>, callback: () => void): UseTimerReturn;

  (seconds: PositiveInteger<number>, options?: UseTimerOptions): UseTimerReturn;
}

/**
 * @name useTimer
 * @description - Hook that creates a timer functionality
 * @category Time
 * @usage medium
 *
 * @overload
 * @returns {UseTimerReturn} An object containing the timer properties and functions
 *
 * @example
 * const { days, hours, minutes, seconds, toggle, pause, start, restart, resume, active, decrease, increase } = useTimer();
 *
 * @overload
 * @param {number} seconds The seconds value that define for how long the timer will be running
 * @param {() => void} callback The function to be executed once countdown timer is expired
 * @returns {UseTimerReturn} An object containing the timer properties and functions
 *
 * @example
 * const { days, hours, minutes, seconds, toggle, pause, start, restart, resume, active, decrease, increase } = useTimer(1000, () => console.log('ready'));
 *
 * @overload
 * @param {number} seconds The seconds value that define for how long the timer will be running
 * @param {boolean} [options.immediately=true] The flag to decide if timer should start automatically
 * @param {() => void} [options.onExpire] The function to be executed when the timer is expired
 * @param {(timestamp: number) => void} [options.onTick] The function to be executed on each tick of the timer
 * @returns {UseTimerReturn} An object containing the timer properties and functions
 *
 * @example
 * const { days, hours, minutes, seconds, toggle, pause, start, restart, resume, active, decrease, increase } = useTimer(1000);
 */
export const useTimer = ((...params: any[]) => {
  const initialSeconds = Math.max((params[0] ?? 0) as PositiveInteger<number>, 0);
  const options = (typeof params[1] === 'object' ? params[1] : { onExpire: params[1] }) as
    | UseTimerOptions
    | undefined;

  const [active, setActive] = useState(initialSeconds > 0 && (options?.immediately ?? true));
  const [seconds, setSeconds] = useState(initialSeconds);

  const intervalIdRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const optionsRef = useRef<UseTimerOptions>(options);
  optionsRef.current = options ?? {};

  useDidUpdate(() => {
    if (initialSeconds <= 0) {
      setActive(false);
      setSeconds(0);
      return;
    }

    setActive(true);
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!active) return;

    optionsRef.current?.onStart?.();
    const onInterval = () => {
      setSeconds((prevSeconds) => {
        optionsRef.current?.onTick?.(prevSeconds);
        const updatedSeconds = prevSeconds - 1;
        if (updatedSeconds === 0) {
          setActive(false);
          optionsRef.current?.onExpire?.();
        }
        return updatedSeconds;
      });
    };

    intervalIdRef.current = setInterval(onInterval, 1000);
    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [active]);

  const pause = () => setActive(false);
  const resume = () => {
    if (seconds <= 0) return;
    setActive(true);
  };

  const toggle = () => {
    if (seconds <= 0) return;
    setActive(!active);
  };

  const restart = (seconds: PositiveInteger<number>, immediately = true) => {
    setSeconds(seconds);
    if (immediately) setActive(true);
  };

  const start = () => {
    if (initialSeconds <= 0) return;

    setActive(true);
    setSeconds(initialSeconds);
  };

  const clear = () => {
    setActive(false);
    setSeconds(0);
  };

  const increase = (seconds: PositiveInteger<number>) =>
    setSeconds((prevSeconds) => prevSeconds + seconds);
  const decrease = (seconds: PositiveInteger<number>) => {
    setSeconds((prevSeconds) => {
      const updatedSeconds = prevSeconds - seconds;
      if (updatedSeconds <= 0) {
        setActive(false);
        return 0;
      } else {
        return updatedSeconds;
      }
    });
  };

  return {
    ...getTimeFromSeconds(seconds),
    count: seconds,
    pause,
    active,
    resume,
    toggle,
    start,
    restart,
    clear,
    increase,
    decrease
  };
}) as UseTimer;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { days, hours, minutes, seconds, toggle, pause, start, restart, resume, active, decrease, increase } = useTimer();
// or
const { days, hours, minutes, seconds, toggle, pause, start, restart, resume, active, decrease, increase } = useTimer(1000, () => console.log('ready'));
// or
const { days, hours, minutes, seconds, toggle, pause, start, restart, resume, active, decrease, increase } = useTimer(1000);
```

## Type Declarations

```tsx
export type PositiveInteger<Value extends number> = `${Value}` extends `-${any}` | `${any}.${any}`
  ? never
  : Value;

export interface UseTimerOptions {
  /** Whether the timer should start automatically */
  immediately?: boolean;
  /** The function to be executed when the timer is expired */
  onExpire?: () => void;
  /** The function to be executed when the timer is started */
  onStart?: () => void;
  /** Callback function to be executed on each tick of the timer */
  onTick?: (seconds: number) => void;
}

export interface UseTimerReturn {
  /** flag to indicate if timer is active or not */
  active: boolean;
  /** The total count of the timer */
  count: number;
  /** The day count of the timer */
  days: number;
  /** The hour count of the timer */
  hours: number;
  /** The minute count of the timer */
  minutes: number;
  /** The second count of the timer */
  seconds: number;
  /** The function to clear the timer */
  clear: () => void;
  /** The function to decrease the timer */
  decrease: (seconds: PositiveInteger<number>) => void;
  /** The function to increase the timer */
  increase: (seconds: PositiveInteger<number>) => void;
  /** The function to pause the timer */
  pause: () => void;
  /** The function to restart the timer */
  restart: (time: PositiveInteger<number>, immediately?: boolean) => void;
  /** The function to resume the timer */
  resume: () => void;
  /** The function to start the timer */
  start: () => void;
  /** The function to toggle the timer */
  toggle: () => void;
}

export interface UseTimer {
  (): UseTimerReturn;

  (seconds: PositiveInteger<number>, callback: () => void): UseTimerReturn;

  (seconds: PositiveInteger<number>, options?: UseTimerOptions): UseTimerReturn;
}
```

## API

### Overload 1

#### Returns

`UseTimerReturn` - An object containing the timer properties and functions

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| seconds | `number` | - | The seconds value that define for how long the timer will be running |
| callback | `() => void` | - | The function to be executed once countdown timer is expired |

#### Returns

`UseTimerReturn` - An object containing the timer properties and functions

### Overload 3

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| seconds | `number` | - | The seconds value that define for how long the timer will be running |
| options.immediately | `boolean` | true | The flag to decide if timer should start automatically |
| options.onExpire | `() => void` | - | The function to be executed when the timer is expired |
| options.onTick | `(timestamp: number) => void` | - | The function to be executed on each tick of the timer |

#### Returns

`UseTimerReturn` - An object containing the timer properties and functions