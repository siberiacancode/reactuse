---
title: useKeysPressed
description: Hook that tracks all currently pressed keyboard keys and their codes
category: sensors
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1780559434000
---

# useKeysPressed

Hook that tracks all currently pressed keyboard keys and their codes

## Demo

```tsx
import { useKeysPressed } from '@siberiacancode/reactuse';

import { cn } from '@/utils/lib';

const KEYBOARD = [
  [
    { code: 'KeyQ', label: 'Q' },
    { code: 'KeyW', label: 'W' },
    { code: 'KeyE', label: 'E' },
    { code: 'KeyR', label: 'R' },
    { code: 'KeyT', label: 'T' },
    { code: 'KeyY', label: 'Y' },
    { code: 'KeyU', label: 'U' },
    { code: 'KeyI', label: 'I' },
    { code: 'KeyO', label: 'O' },
    { code: 'KeyP', label: 'P' }
  ],
  [
    { code: 'KeyA', label: 'A' },
    { code: 'KeyS', label: 'S' },
    { code: 'KeyD', label: 'D' },
    { code: 'KeyF', label: 'F' },
    { code: 'KeyG', label: 'G' },
    { code: 'KeyH', label: 'H' },
    { code: 'KeyJ', label: 'J' },
    { code: 'KeyK', label: 'K' },
    { code: 'KeyL', label: 'L' }
  ],
  [
    { code: 'ShiftLeft', label: 'Shift', wide: true },
    { code: 'KeyZ', label: 'Z' },
    { code: 'KeyX', label: 'X' },
    { code: 'KeyC', label: 'C' },
    { code: 'KeyV', label: 'V' },
    { code: 'KeyB', label: 'B' },
    { code: 'KeyN', label: 'N' },
    { code: 'KeyM', label: 'M' }
  ],
  [
    { code: 'ControlLeft', label: 'Ctrl' },
    { code: 'AltLeft', label: 'Alt' },
    { code: 'Space', label: 'Space', wide: true },
    { code: 'AltRight', label: 'Alt' },
    { code: 'ControlRight', label: 'Ctrl' }
  ]
];

const Demo = () => {
  const keysPressed = useKeysPressed();
  const pressedCodes = new Set(keysPressed.value.map(({ code }) => code));

  return (
    <section className='flex w-full max-w-md flex-col items-center gap-4 p-4'>
      <div className='flex flex-col items-center gap-1.5'>
        {KEYBOARD.map((row, i) => (
          <div key={i} className='flex gap-1.5'>
            {row.map((key) => {
              const active = pressedCodes.has(key.code);
              return (
                <div
                  key={key.code}
                  className={cn(
                    'border-border bg-card text-muted-foreground flex h-8 items-center justify-center rounded-md border font-mono text-[10px] font-medium transition-colors',
                    key.wide ? 'w-16' : 'w-8',
                    active && 'border-foreground bg-foreground text-background'
                  )}
                >
                  {key.label}
                </div>
              );
            })}
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
npx useverse@latest add useKeysPressed
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use keys pressed options type */
export interface UseKeysPressedOptions {
  /** Enable or disable the event listeners */
  enabled?: boolean;
}

export interface UseKeysPressedReturn {
  /** The array of currently pressed keys */
  value: Array<{ key: string; code: string }>;
}

export interface UseKeysPressed {
  (target: HookTarget | Window, options?: UseKeysPressedOptions): UseKeysPressedReturn;

  <Target extends Element>(
    options?: UseKeysPressedOptions
  ): UseKeysPressedReturn & { ref: StateRef<Target> };
}

/**
 * @name useKeysPressed
 * @description - Hook that tracks all currently pressed keyboard keys and their codes
 * @category Sensors
 * @usage low
 *
 * @overload
 * @param {HookTarget | Window} [target=window] DOM element or ref to attach keyboard listeners to
 * @param {UseKeysPressedOptions} [options.enabled=true] Enable or disable the event listeners
 * @returns {UseKeysPressedReturn} Object containing the array of currently pressed keys
 *
 * @example
 * const { value } = useKeysPressed(ref);
 *
 * @overload
 * @template Target - Type of the target DOM element
 * @param {UseKeysPressedOptions} [options] - Optional configuration options
 * @returns {UseKeysPressedReturn & { ref: StateRef<Target> }} Object containing the array of currently pressed keys and ref to attach to the element
 *
 * @example
 * const { value, ref } = useKeysPressed();
 */
export const useKeysPressed = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseKeysPressedOptions | undefined;

  const enabled = options?.enabled ?? true;
  const [value, setValue] = useState<{ key: string; code: string }[]>([]);
  const internalRef = useRefState<Element | Window>();

  useEffect(() => {
    if (!enabled) return;
    setValue([]);

    const element =
      ((target ? isTarget.getElement(target) : internalRef.current) as Element) ?? window;
    if (!element) return;

    const onKeyDown = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      setValue((prevValue) => {
        if (prevValue.some(({ code }) => code === keyboardEvent.code)) return prevValue;
        return [...prevValue, { key: keyboardEvent.key, code: keyboardEvent.code }];
      });
    };

    const onKeyUp = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      setValue((prevValue) => prevValue.filter(({ code }) => code !== keyboardEvent.code));
    };

    element.addEventListener('keydown', onKeyDown);
    element.addEventListener('keyup', onKeyUp);

    return () => {
      element.removeEventListener('keydown', onKeyDown);
      element.removeEventListener('keyup', onKeyUp);
    };
  }, [enabled, internalRef.state, target && isTarget.getRawElement(target)]);

  if (target) return { value };
  return { value, ref: internalRef };
}) as UseKeysPressed;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { value } = useKeysPressed(ref);
// or
const { value, ref } = useKeysPressed();
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export interface UseKeysPressedOptions {
  /** Enable or disable the event listeners */
  enabled?: boolean;
}

export interface UseKeysPressedReturn {
  /** The array of currently pressed keys */
  value: Array<{ key: string; code: string }>;
}

export interface UseKeysPressed {
  (target: HookTarget | Window, options?: UseKeysPressedOptions): UseKeysPressedReturn;

  <Target extends Element>(
    options?: UseKeysPressedOptions
  ): UseKeysPressedReturn & { ref: StateRef<Target> };
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget \| Window` | window | DOM element or ref to attach keyboard listeners to |
| options.enabled | `UseKeysPressedOptions` | true | Enable or disable the event listeners |

#### Returns

`UseKeysPressedReturn` - Object containing the array of currently pressed keys

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options | `UseKeysPressedOptions` | - | Optional configuration options |

#### Returns

`UseKeysPressedReturn & { ref: StateRef<Target> }` - Object containing the array of currently pressed keys and ref to attach to the element