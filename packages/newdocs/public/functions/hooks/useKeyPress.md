---
title: useKeyPress
description: Hook that listens for key press events
category: sensors
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1780314562000
---

# useKeyPress

Hook that listens for key press events

## Demo

```tsx
import { useAsync, useKeyPress } from '@siberiacancode/reactuse';
import { ChevronLeftIcon, ChevronRightIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';

interface Pokemon {
  height: number;
  id: number;
  name: string;
  types: { type: { name: string } }[];
  weight: number;
}

const MIN_ID = 1;
const MAX_ID = 500;

const randomId = () => Math.floor(Math.random() * (MAX_ID - MIN_ID + 1)) + MIN_ID;

const getImageUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const fetchPokemon = async (id: number) => {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(
    (response) => response.json() as Promise<Pokemon>
  );
};

const Demo = () => {
  const [id, setId] = useState(randomId);

  const pokemonAsync = useAsync(() => fetchPokemon(id), [id]);

  const onNext = () => setId(randomId());

  useKeyPress('ArrowLeft', (pressed) => {
    if (pressed) onNext();
  });

  useKeyPress('ArrowRight', (pressed) => {
    if (pressed) onNext();
  });

  const loading = !pokemonAsync.data;

  return (
    <section className='flex w-full max-w-[280px] flex-col items-center gap-3 p-4'>
      <div className='border-border bg-card relative aspect-[3/4] w-full overflow-hidden rounded-2xl border shadow-lg'>
        <div className='absolute inset-0 flex items-center justify-center'>
          {loading && <Loader2Icon className='text-muted-foreground size-8 animate-spin' />}
          {!loading && pokemonAsync.data && (
            <img
              key={id}
              alt={pokemonAsync.data.name}
              className='animate-in fade-in size-2/3 object-contain duration-300'
              src={getImageUrl(id)}
            />
          )}
        </div>

        {!loading && pokemonAsync.data && (
          <>
            <div className='absolute top-3 left-3 z-10'>
              <span className='border-border bg-card/80 text-foreground inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold tabular-nums backdrop-blur-md'>
                #{String(id).padStart(3, '0')}
              </span>
            </div>

            <button
              aria-label='Previous'
              className='absolute top-1/2 left-3 z-10 -translate-y-1/2 rounded-full! border-white/20 bg-black/30 text-white backdrop-blur-md hover:bg-black/50!'
              data-size='icon'
              data-variant='outline'
              type='button'
              onClick={onNext}
            >
              <ChevronLeftIcon className='size-4' />
            </button>

            <button
              aria-label='Next'
              className='absolute top-1/2 right-3 z-10 -translate-y-1/2 rounded-full! border-white/20 bg-black/30 text-white backdrop-blur-md hover:bg-black/50!'
              data-size='icon'
              data-variant='outline'
              type='button'
              onClick={onNext}
            >
              <ChevronRightIcon className='size-4' />
            </button>

            <div className='pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 via-black/50 to-transparent' />

            <div className='animate-in fade-in absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 duration-300'>
              <div className='flex items-baseline gap-2'>
                <span className='text-xl font-bold text-white capitalize'>
                  {pokemonAsync.data.name}
                </span>
                <span className='font-mono text-[10px] text-white/60 tabular-nums'>
                  {(pokemonAsync.data.height / 10).toFixed(1)} m ·{' '}
                  {(pokemonAsync.data.weight / 10).toFixed(1)} kg
                </span>
              </div>
              <div className='flex flex-wrap gap-1'>
                {pokemonAsync.data.types.map((type) => (
                  <span
                    key={type.type.name}
                    className='rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-medium tracking-wider text-white uppercase backdrop-blur-md'
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <span className='text-muted-foreground text-[10px]'>Use ← → keys to swipe</span>
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
npx useverse@latest add useKeyPress
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The key or keys to listen for */
export type UseKeyPressKey = string | string[];

/** The callback function to be invoked when key is pressed */
export type UseKeyPressCallback = (pressed: boolean, event: KeyboardEvent) => void;

/** The use key press return type */
export interface UseKeyPressReturn {
  /** The pressed state of the key */
  pressed: boolean;
  /** The ref to attach to the element */
  ref: StateRef<Element>;
}

export interface UseKeyPress {
  (
    target: HookTarget | Window,
    key: UseKeyPressKey,
    callback?: UseKeyPressCallback
  ): UseKeyPressReturn;

  <Target extends Element>(
    key: UseKeyPressKey,
    callback?: UseKeyPressCallback,
    target?: never
  ): UseKeyPressReturn & { ref: StateRef<Target> };
}

/**
 * @name useKeyPress
 * @description - Hook that listens for key press events
 * @category Sensors
 * @usage medium
 *
 * @overload
 * @param {HookTarget} [target=window] The target to attach the event listeners to
 * @param {UseKeyPressKey} key The key or keys to listen for
 * @param {(pressed: boolean, event: KeyboardEvent) => void} [callback] Callback function invoked when key is pressed
 * @returns {UseKeyPressReturn} An object containing the pressed state and ref
 *
 * @example
 * const isKeyPressed = useKeyPress(ref, 'a');
 *
 * @overload
 * @template Target The target element type
 * @param {UseKeyPressKey} key The key or keys to listen for
 * @param {(pressed: boolean, event: KeyboardEvent) => void} [callback] Callback function invoked when key is pressed
 * @returns {{ pressed: boolean; ref: StateRef<Target> }} An object containing the pressed state and ref
 *
 * @example
 * const { pressed, ref } = useKeyPress('a');
 */
export const useKeyPress = ((...params: any[]) => {
  const target = isTarget(params[0]) ? params[0] : undefined;
  const key = (target ? params[1] : params[0]) as UseKeyPressKey;
  const callback = (target ? params[2] : params[1]) as UseKeyPressCallback | undefined;

  const [pressed, setPressed] = useState(false);
  const internalRef = useRefState<Element | Window>();

  const keyRef = useRef(key);
  keyRef.current = key;
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    const element =
      ((target ? isTarget.getElement(target) : internalRef.current) as Element) ?? window;
    if (!element) return;

    const onKeyDown = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (
        Array.isArray(keyRef.current)
          ? keyRef.current.includes(keyboardEvent.key)
          : keyboardEvent.key === keyRef.current
      ) {
        setPressed(true);
        internalCallbackRef.current?.(true, keyboardEvent);
      }
    };

    const onKeyUp = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (
        Array.isArray(keyRef.current)
          ? keyRef.current.includes(keyboardEvent.key)
          : keyboardEvent.key === keyRef.current
      ) {
        setPressed(false);
        internalCallbackRef.current?.(false, keyboardEvent);
      }
    };

    element.addEventListener('keydown', onKeyDown);
    element.addEventListener('keyup', onKeyUp);

    return () => {
      element.removeEventListener('keydown', onKeyDown);
      element.removeEventListener('keyup', onKeyUp);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  if (target) return { pressed };
  return { pressed, ref: internalRef };
}) as UseKeyPress;
```

Update the import paths to match your project setup.

## Usage

```tsx
const isKeyPressed = useKeyPress(ref, 'a');
// or
const { pressed, ref } = useKeyPress('a');
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export type UseKeyPressKey = string | string[];

export type UseKeyPressCallback = (pressed: boolean, event: KeyboardEvent) => void;

export interface UseKeyPressReturn {
  /** The pressed state of the key */
  pressed: boolean;
  /** The ref to attach to the element */
  ref: StateRef<Element>;
}

export interface UseKeyPress {
  (
    target: HookTarget | Window,
    key: UseKeyPressKey,
    callback?: UseKeyPressCallback
  ): UseKeyPressReturn;

  <Target extends Element>(
    key: UseKeyPressKey,
    callback?: UseKeyPressCallback,
    target?: never
  ): UseKeyPressReturn & { ref: StateRef<Target> };
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | window | The target to attach the event listeners to |
| key | `UseKeyPressKey` | - | The key or keys to listen for |
| callback | `(pressed: boolean, event: KeyboardEvent) => void` | - | Callback function invoked when key is pressed |

#### Returns

`UseKeyPressReturn` - An object containing the pressed state and ref

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| key | `UseKeyPressKey` | - | The key or keys to listen for |
| callback | `(pressed: boolean, event: KeyboardEvent) => void` | - | Callback function invoked when key is pressed |

#### Returns

`{ pressed: boolean; ref: StateRef<Target> }` - An object containing the pressed state and ref