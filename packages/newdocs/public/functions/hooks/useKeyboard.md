---
title: useKeyboard
description: Hook that helps to listen for keyboard events
category: sensors
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1775645190000
---

# useKeyboard

Hook that helps to listen for keyboard events

## Demo

```tsx
import { useKeyboard } from '@siberiacancode/reactuse';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const TARGET = 'react';

const Demo = () => {
  const [input, setInput] = useState('');

  useKeyboard((event) => {
    event.preventDefault();

    if (event.key === 'Backspace') {
      setInput((current) => current.slice(0, -1));
      return;
    }

    if (event.key.length !== 1 || !/\p{L}/u.test(event.key)) return;
    if (input.length >= TARGET.length) return;
    setInput((current) => current + event.key.toLowerCase());
  });

  const cells = Array.from({ length: TARGET.length }, (_, index) => {
    const char = input[index];
    const expected = TARGET[index];
    const filled = !!char;
    const correct = filled && char === expected;
    return { char, expected, filled, correct };
  });

  return (
    <section className='flex w-full max-w-md flex-col items-center gap-6 p-8'>
      <div className='flex flex-col items-center gap-1'>
        <span className='text-muted-foreground text-[10px] tracking-[0.2em] uppercase'>
          Type the word
        </span>
        <span className='text-foreground font-mono text-4xl font-bold tracking-[0.4em] uppercase'>
          {TARGET}
        </span>
      </div>

      <div className='flex items-center gap-2'>
        {cells.map((cell, index) => (
          <div
            key={index}
            className={cn(
              'flex size-12 items-center justify-center rounded-lg border-2 font-mono text-xl font-bold uppercase transition-colors',
              !cell.filled && 'border-border bg-card text-muted-foreground',
              cell.filled &&
                cell.correct &&
                'border-green-500 bg-green-500/10 text-green-600 dark:text-green-500',
              cell.filled &&
                !cell.correct &&
                'border-destructive bg-destructive/10 text-destructive'
            )}
          >
            {cell.char ?? ''}
          </div>
        ))}
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
npx useverse@latest add useKeyboard
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use keyboard return type */
export type UseKeyboardReturn<Target extends HTMLElement> = StateRef<Target>;

/** The use keyboard event handler type */
export type KeyboardEventHandler = (event: KeyboardEvent) => void;

/** The use keyboard event options type */
export interface UseKeyboardEventOptions {
  /** The callback function to be invoked on key down */
  onKeyDown?: KeyboardEventHandler;
  /** The callback function to be invoked on key up */
  onKeyUp?: KeyboardEventHandler;
}

export interface UseKeyboard {
  (target: HookTarget, callback: KeyboardEventHandler): void;

  (target: HookTarget, options: UseKeyboardEventOptions): void;

  <Target extends HTMLElement>(callback: KeyboardEventHandler, target?: never): StateRef<Target>;

  <Target extends HTMLElement>(options: UseKeyboardEventOptions, target?: never): StateRef<Target>;
}

/**
 * @name useKeyboard
 * @description - Hook that helps to listen for keyboard events
 * @category Sensors
 * @usage medium
 *
 * @overload
 * @param {HookTarget} target The target to attach the event listeners to
 * @param {KeyboardEventHandler} callback The callback function to be invoked on key down
 * @returns {void}
 *
 * @example
 * useKeyboard(ref, (event) => console.log('key down'));
 *
 * @overload
 * @param {HookTarget} target The target to attach the event listeners to
 * @param {UseKeyboardEventOptions} [options] The keyboard event options
 * @returns {void}
 *
 * @example
 * useKeyboard(ref, { onKeyDown: (event) => console.log('key down'), onKeyUp: (event) => console.log('key up') });
 *
 * @overload
 * @template Target The target element type
 * @param {KeyboardEventHandler} callback The callback function to be invoked on key down
 * @returns {StateRef<Target>} A ref to attach to the target element
 *
 * @example
 * const ref = useKeyboard((event) => console.log('key down'));
 *
 * @overload
 * @template Target The target element type
 * @param {UseKeyboardEventOptions} [options] The keyboard event options
 * @returns {StateRef<Target>} A ref to attach to the target element
 *
 * @example
 * const ref = useKeyboard({ onKeyDown: (event) => console.log('key down'), onKeyUp: (event) => console.log('key up') });
 */
export const useKeyboard = ((...params: any[]) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const options = (
    target
      ? typeof params[1] === 'object'
        ? params[1]
        : { onKeyDown: params[1] }
      : typeof params[0] === 'object'
        ? params[0]
        : { onKeyDown: params[0] }
  ) as UseKeyboardEventOptions;

  const internalRef = useRefState<HTMLElement | Window>();
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  useEffect(() => {
    const element =
      ((target ? isTarget.getElement(target) : internalRef.current) as HTMLElement) ?? window;

    const onKeyDown = (event: Event) =>
      internalOptionsRef.current?.onKeyDown?.(event as KeyboardEvent);
    const onKeyUp = (event: Event) => internalOptionsRef.current?.onKeyUp?.(event as KeyboardEvent);

    element.addEventListener('keydown', onKeyDown);
    element.addEventListener('keyup', onKeyUp);

    return () => {
      element.removeEventListener('keydown', onKeyDown);
      element.removeEventListener('keyup', onKeyUp);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  if (target) return;
  return internalRef;
}) as UseKeyboard;
```

Update the import paths to match your project setup.

## Usage

```tsx
useKeyboard(ref, (event) => console.log('key down'));
// or
useKeyboard(ref, { onKeyDown: (event) => console.log('key down'), onKeyUp: (event) => console.log('key up') });
// or
const ref = useKeyboard((event) => console.log('key down'));
// or
const ref = useKeyboard({ onKeyDown: (event) => console.log('key down'), onKeyUp: (event) => console.log('key up') });
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export type UseKeyboardReturn<Target extends HTMLElement> = StateRef<Target>;

export type KeyboardEventHandler = (event: KeyboardEvent) => void;

export interface UseKeyboardEventOptions {
  /** The callback function to be invoked on key down */
  onKeyDown?: KeyboardEventHandler;
  /** The callback function to be invoked on key up */
  onKeyUp?: KeyboardEventHandler;
}

export interface UseKeyboard {
  (target: HookTarget, callback: KeyboardEventHandler): void;

  (target: HookTarget, options: UseKeyboardEventOptions): void;

  <Target extends HTMLElement>(callback: KeyboardEventHandler, target?: never): StateRef<Target>;

  <Target extends HTMLElement>(options: UseKeyboardEventOptions, target?: never): StateRef<Target>;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target to attach the event listeners to |
| callback | `KeyboardEventHandler` | - | The callback function to be invoked on key down |

#### Returns

`void`

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target to attach the event listeners to |
| options | `UseKeyboardEventOptions` | - | The keyboard event options |

#### Returns

`void`

### Overload 3

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `KeyboardEventHandler` | - | The callback function to be invoked on key down |

#### Returns

`StateRef<Target>` - A ref to attach to the target element

### Overload 4

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options | `UseKeyboardEventOptions` | - | The keyboard event options |

#### Returns

`StateRef<Target>` - A ref to attach to the target element