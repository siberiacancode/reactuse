---
title: useHover
description: Hook that defines the logic when hovering an element
category: elements
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1770651919000
---

# useHover

Hook that defines the logic when hovering an element

## Demo

```tsx
import { useAsync, useHover } from '@siberiacancode/reactuse';

import { cn } from '@/utils/lib';

interface Pokemon {
  id: number;
  name: string;
}

const fetchPokemon = async (name: string) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(
    (response) => response.json() as Promise<Pokemon>
  );
};

interface PokemonLinkProps {
  name: string;
}

const PokemonLink = ({ name }: PokemonLinkProps) => {
  const hover = useHover<HTMLSpanElement>();

  const pokemonAsync = useAsync(async () => {
    if (!hover.value) return;
    return await fetchPokemon(name);
  }, [hover.value]);

  return (
    <span className='relative'>
      <span
        ref={hover.ref}
        className={cn(
          'text-foreground decoration-foreground/40 hover:decoration-foreground font-medium capitalize underline underline-offset-2 transition-colors',
          pokemonAsync.isLoading ? 'cursor-wait' : 'cursor-help'
        )}
      >
        {name}
      </span>

      {hover.value && !pokemonAsync.isLoading && pokemonAsync.data && (
        <span className='animate-in fade-in slide-in-from-top-1 border-border bg-card absolute top-full left-1/2 z-10 mt-2 flex -translate-x-1/2 flex-col items-center gap-2 rounded-xl border p-3 shadow-lg duration-200'>
          <span className='bg-muted/40 flex size-20 items-center justify-center rounded-lg'>
            <img
              alt={pokemonAsync.data.name}
              className='size-[56px] object-contain'
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonAsync.data.id}.png`}
            />
          </span>

          <span className='flex flex-col items-start justify-start gap-0.5 leading-tight'>
            <span className='text-muted-foreground font-mono text-[10px] tabular-nums'>
              #{String(pokemonAsync.data.id).padStart(3, '0')}
            </span>
            <span className='text-foreground text-sm font-semibold capitalize'>
              {pokemonAsync.data.name}
            </span>
          </span>
        </span>
      )}
    </span>
  );
};

const Demo = () => (
  <section className='relative flex w-full max-w-md flex-col p-4'>
    <p className='text-muted-foreground text-base leading-relaxed'>
      Every trainer in Kanto begins their adventure by choosing one of three iconic starter Pokémon
      from Professor Oak's lab: <PokemonLink name='bulbasaur' /> for those who value defense and
      strategy, <PokemonLink name='charmander' /> for trainers who prefer raw offensive power, or{' '}
      <PokemonLink name='squirtle' /> for a balanced and reliable companion. Later, deep in the
      forests of Route 25, you might encounter a wild <PokemonLink name='pikachu' /> — the
      franchise's most beloved mascot and a fierce electric-type fighter in its own right.
    </p>
  </section>
);

export default Demo;
```

## Installation

### Library

```bash
npm install @siberiacancode/reactuse
```

### CLI

```bash
npx useverse@latest add useHover
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use hover options type */
export interface UseHoverOptions {
  /** The enabled state of the hook */
  enabled?: boolean;
  /** The on entry callback */
  onEntry?: (event: Event) => void;
  /** The on leave callback */
  onLeave?: (event: Event) => void;
}

/** The use hover return type */
export interface UseHoverReturn {
  /** The value of the hover */
  value: boolean;
}

export interface UseHover {
  (target: HookTarget, callback?: (event: Event) => void): UseHoverReturn;

  (target: HookTarget, options?: UseHoverOptions): UseHoverReturn;

  <Target extends Element>(
    callback?: (event: Event) => void,
    target?: never
  ): UseHoverReturn & { ref: StateRef<Target> };

  <Target extends Element>(
    options?: UseHoverOptions,
    target?: never
  ): UseHoverReturn & { ref: StateRef<Target> };
}

/**
 * @name useHover
 * @description - Hook that defines the logic when hovering an element
 * @category Elements
 * @usage medium
 *
 * @overload
 * @param {HookTarget} target The target element to be hovered
 * @param {(event: Event) => void} [callback] The callback function to be invoked on mouse enter
 * @returns {boolean} The value of the hover
 *
 * @example
 * const hovering = useHover(ref, () => console.log('callback'));
 *
 * @overload
 * @param {HookTarget} target The target element to be hovered
 * @param {(event: Event) => void} [options.onEntry] The callback function to be invoked on mouse enter
 * @param {(event: Event) => void} [options.onLeave] The callback function to be invoked on mouse leave
 * @returns {boolean} The value of the hover
 *
 * @example
 * const hovering = useHover(ref, options);
 *
 * @overload
 * @template Target The target element
 * @param {(event: Event) => void} [callback] The callback function to be invoked on mouse enter
 * @returns {{ ref: StateRef<Target> } & UseHoverReturn} The object with the ref and the value of the hover
 *
 * @example
 * const { ref, value } = useHover(() => console.log('callback'));
 *
 * @overload
 * @template Target The target element
 * @param {(event: Event) => void} [options.onEntry] The callback function to be invoked on mouse enter
 * @param {(event: Event) => void} [options.onLeave] The callback function to be invoked on mouse leave
 * @returns {{ ref: StateRef<Target> } & UseHoverReturn} The object with the ref and the value of the hover
 *
 * @example
 * const { ref, value } = useHover(options);
 */
export const useHover = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;

  const options = (
    target
      ? typeof params[1] === 'object'
        ? params[1]
        : { onEntry: params[1] }
      : typeof params[0] === 'object'
        ? params[0]
        : { onEntry: params[0] }
  ) as UseHoverOptions | undefined;

  const enabled = options?.enabled ?? true;

  const [hovering, setHovering] = useState(false);
  const internalRef = useRefState<Element>();
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;

    const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;

    if (!element) return;

    const onMouseEnter = (event: Event) => {
      internalOptionsRef.current?.onEntry?.(event);
      setHovering(true);
    };

    const onMouseLeave = (event: Event) => {
      internalOptionsRef.current?.onLeave?.(event);
      setHovering(false);
    };

    element.addEventListener('mouseenter', onMouseEnter);
    element.addEventListener('mouseleave', onMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', onMouseEnter);
      element.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [enabled, target && isTarget.getRawElement(target), internalRef.state]);

  if (target) return { value: hovering };
  return {
    ref: internalRef,
    value: hovering
  } as const;
}) as UseHover;
```

Update the import paths to match your project setup.

## Usage

```tsx
const hovering = useHover(ref, () => console.log('callback'));
// or
const hovering = useHover(ref, options);
// or
const { ref, value } = useHover(() => console.log('callback'));
// or
const { ref, value } = useHover(options);
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export interface UseHoverOptions {
  /** The enabled state of the hook */
  enabled?: boolean;
  /** The on entry callback */
  onEntry?: (event: Event) => void;
  /** The on leave callback */
  onLeave?: (event: Event) => void;
}

export interface UseHoverReturn {
  /** The value of the hover */
  value: boolean;
}

export interface UseHover {
  (target: HookTarget, callback?: (event: Event) => void): UseHoverReturn;

  (target: HookTarget, options?: UseHoverOptions): UseHoverReturn;

  <Target extends Element>(
    callback?: (event: Event) => void,
    target?: never
  ): UseHoverReturn & { ref: StateRef<Target> };

  <Target extends Element>(
    options?: UseHoverOptions,
    target?: never
  ): UseHoverReturn & { ref: StateRef<Target> };
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target element to be hovered |
| callback | `(event: Event) => void` | - | The callback function to be invoked on mouse enter |

#### Returns

`boolean` - The value of the hover

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target element to be hovered |
| options.onEntry | `(event: Event) => void` | - | The callback function to be invoked on mouse enter |
| options.onLeave | `(event: Event) => void` | - | The callback function to be invoked on mouse leave |

#### Returns

`boolean` - The value of the hover

### Overload 3

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(event: Event) => void` | - | The callback function to be invoked on mouse enter |

#### Returns

`{ ref: StateRef<Target> } & UseHoverReturn` - The object with the ref and the value of the hover

### Overload 4

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.onEntry | `(event: Event) => void` | - | The callback function to be invoked on mouse enter |
| options.onLeave | `(event: Event) => void` | - | The callback function to be invoked on mouse leave |

#### Returns

`{ ref: StateRef<Target> } & UseHoverReturn` - The object with the ref and the value of the hover