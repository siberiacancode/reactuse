---
title: useVibrate
description: Hook that provides vibrate api
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1755262808000
---

# useVibrate

Hook that provides vibrate api

## Demo

```tsx
import { useVibrate } from '@siberiacancode/reactuse';
import { PlayIcon } from 'lucide-react';

const MORSE: Record<string, string> = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..'
};

const DOT = 120;
const DASH = 360;
const GAP = 120;
const LETTER_GAP = 360;
const WORD_GAP = 840;

const PHRASE = 'HELLO WORLD';

const toPattern = (text: string): number[] => {
  const pattern: number[] = [];

  text
    .toUpperCase()
    .split(' ')
    .forEach((word, wordIndex, words) => {
      word.split('').forEach((char, charIndex, chars) => {
        const code = MORSE[char];
        if (!code) return;

        code.split('').forEach((symbol, symbolIndex) => {
          pattern.push(symbol === '.' ? DOT : DASH);
          if (symbolIndex < code.length - 1) pattern.push(GAP);
        });

        if (charIndex < chars.length - 1) pattern.push(LETTER_GAP);
      });

      if (wordIndex < words.length - 1) pattern.push(WORD_GAP);
    });

  return pattern;
};

const Demo = () => {
  const vibrate = useVibrate(toPattern(PHRASE));

  if (!vibrate.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  return (
    <section className='flex w-full max-w-sm flex-col items-center gap-5 p-6 text-center'>
      <div className='flex flex-col gap-1.5'>
        <h3 className='text-foreground text-lg font-semibold'>Feel it in Morse</h3>
        <p className='text-muted-foreground text-sm leading-relaxed'>
          Morse code turns letters into short and long signals — dots and dashes. Tap play to feel
          the phrase buzz out on your device.
        </p>
      </div>

      <button
        className='flex h-10! w-full items-center justify-center gap-2 rounded-2xl! text-base font-semibold'
        type='button'
        onClick={() => vibrate.trigger()}
      >
        <PlayIcon className='size-5 fill-current' />
        Play “Hello world”
      </button>
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
npx useverse@latest add useVibrate
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

/** The use vibrate pattern type */
export type UseVibratePattern = number | number[];

/** The use vibrate return type */
export interface UseVibrateReturn {
  /** The support indicator */
  supported: boolean;
  /** The vibrating indicator */
  vibrating: boolean;
  /** The pause function */
  pause: () => void;
  /** The resume function */
  resume: () => void;
  /** The start function */
  start: (interval: number) => void;
  /** The vibrate function */
  trigger: (pattern?: UseVibratePattern) => void;
}

/**
 * @name useVibrate
 * @description - Hook that provides vibrate api
 * @category Browser
 * @usage low
 *
 * @browserapi navigator.vibrate https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate
 *
 * @overload
 * @param {UseVibratePattern} options.pattern The pattern for vibration
 * @param {number} [options.interval=0] Time in milliseconds between vibrations
 * @returns {UseVibrateReturn} An object containing support indicator, start vibration and stop vibration functions
 *
 * @example
 * const { supported, active, vibrate, stop, pause, resume } = useVibrate(1000);
 */
export const useVibrate = (pattern: UseVibratePattern, interval: number = 0) => {
  const supported =
    typeof navigator !== 'undefined' && 'vibrate' in navigator && !!navigator.vibrate;

  const intervalIdRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const [active, setActive] = useState(!!interval);

  const trigger = (internalPattern: UseVibratePattern = pattern) => {
    if (!supported) return;
    navigator.vibrate(internalPattern);
  };

  const stop = () => {
    if (!supported) return;
    navigator.vibrate(0);
    setActive(false);
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
  };

  const pause = () => {
    if (!supported) return;
    setActive(false);
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
  };

  const resume = (intervalInterval: number = interval) => {
    if (!supported) return;
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    setActive(true);
    intervalIdRef.current = setInterval(trigger, intervalInterval);
  };

  useEffect(() => {
    if (!supported || interval <= 0) return;
    resume(interval);
    return () => {
      stop();
    };
  }, [interval, pattern]);

  return { supported, trigger, stop, active, pause, resume };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { supported, active, vibrate, stop, pause, resume } = useVibrate(1000);
```

## Type Declarations

```tsx
export type UseVibratePattern = number | number[];

export interface UseVibrateReturn {
  /** The support indicator */
  supported: boolean;
  /** The vibrating indicator */
  vibrating: boolean;
  /** The pause function */
  pause: () => void;
  /** The resume function */
  resume: () => void;
  /** The start function */
  start: (interval: number) => void;
  /** The vibrate function */
  trigger: (pattern?: UseVibratePattern) => void;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.pattern | `UseVibratePattern` | - | The pattern for vibration |
| options.interval | `number` | 0 | Time in milliseconds between vibrations |

### Returns

`UseVibrateReturn` - An object containing support indicator, start vibration and stop vibration functions