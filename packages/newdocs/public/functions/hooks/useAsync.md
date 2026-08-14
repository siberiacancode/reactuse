---
title: useAsync
description: Hook that provides the state of an async callback
category: async
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useAsync

Hook that provides the state of an async callback

## Demo

```tsx
import { useAsync, useCounter } from '@siberiacancode/reactuse';
import { ArrowLeftIcon, ArrowRightIcon, Loader2Icon } from 'lucide-react';

interface Pokemon {
  base_experience: number;
  height: number;
  id: number;
  name: string;
  weight: number;
}

const getPokemon = async (id: number) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (id === 3) throw new Error('Pokemon blocked for demo');
  return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
    res.json()
  ) as Promise<Pokemon>;
};

const STATS = [
  { key: 'height', label: 'Height' },
  { key: 'weight', label: 'Weight' },
  { key: 'base_experience', label: 'Exp' }
] as const;

const Demo = () => {
  const counter = useCounter(1);
  const getPokemonQuery = useAsync(() => getPokemon(counter.value), [counter.value]);

  const formattedIndex = String(counter.value).padStart(3, '0');
  const pokemon = getPokemonQuery.data;
  const ready = !getPokemonQuery.isLoading && !getPokemonQuery.error && pokemon;

  return (
    <section className='flex w-full max-w-sm flex-col gap-3'>
      <div className='bg-card text-card-foreground flex w-full gap-4 rounded-xl p-4'>
        {getPokemonQuery.error && !getPokemonQuery.isLoading ? (
          <div className='flex h-32 w-full items-center justify-center'>
            <span className='text-destructive text-sm'>{getPokemonQuery.error.message}</span>
          </div>
        ) : (
          <>
            <div className='bg-muted relative flex size-32 shrink-0 items-center justify-center rounded-lg'>
              {getPokemonQuery.isLoading ? (
                <Loader2Icon className='text-muted-foreground size-5 animate-spin' />
              ) : pokemon ? (
                <img
                  alt={pokemon.name}
                  className='size-28'
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                />
              ) : null}

              <span
                className='absolute right-1.5 bottom-1.5 font-mono tabular-nums'
                data-slot='badge'
                data-variant='secondary'
              >
                #{formattedIndex}
              </span>
            </div>

            <div className='flex min-w-0 flex-1 flex-col justify-center gap-2'>
              {ready ? (
                <>
                  <span className='text-foreground truncate text-lg font-semibold capitalize'>
                    {pokemon.name}
                  </span>
                  <div className='flex flex-col gap-1.5'>
                    {STATS.map(({ key, label }) => (
                      <div key={key} className='flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>{label}</span>
                        <b className='text-foreground tabular-nums'>{pokemon[key]}</b>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className='flex h-7 items-center'>
                    <div className='h-5 w-24' data-slot='skeleton' />
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    {STATS.map(({ key }) => (
                      <div key={key} className='flex h-5 items-center justify-between'>
                        <div className='h-3.5 w-16' data-slot='skeleton' />
                        <div className='h-3.5 w-10' data-slot='skeleton' />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <div className='flex items-center justify-between gap-2'>
        <button
          data-variant='outline'
          disabled={counter.value === 1 || getPokemonQuery.isLoading}
          type='button'
          onClick={() => counter.dec()}
        >
          <ArrowLeftIcon className='size-4' />
          Prev
        </button>
        <button
          data-variant='outline'
          disabled={getPokemonQuery.isLoading}
          type='button'
          onClick={() => counter.inc()}
        >
          Next
          <ArrowRightIcon className='size-4' />
        </button>
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
npx useverse@latest add useAsync
```

### Manual

Copy and paste the following code into your project.

```tsx
import type { DependencyList } from 'react';

import { useEffect, useState } from 'react';

/* The use query return type */
export interface UseAsyncReturn<Data> {
  /* The state of the query */
  data?: Data;
  /* The error of the query */
  error?: Error;
  /* The error state of the query  */
  isError: boolean;
  /* The loading state of the query */
  isLoading: boolean;
}

/**
 * @name useAsync
 * @description - Hook that provides the state of an async callback
 * @category Async
 * @usage medium
 *
 * @param {() => Promise<Data>} callback The async callback
 * @param {DependencyList} [deps=[]] The dependencies of the callback
 * @returns {UseAsyncReturn<Data>} The state of the async callback
 *
 * @example
 * const { data, isLoading, isError, error } = useAsync(() => fetch('url'), [deps]);
 */
export const useAsync = <Data>(
  callback: () => Promise<Data>,
  deps: DependencyList = []
): UseAsyncReturn<Data> => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [error, setError] = useState<Error | undefined>(undefined);
  const [data, setData] = useState<Data | undefined>(undefined);

  useEffect(() => {
    setIsLoading(true);
    callback()
      .then((response) => {
        setData(response);
        setError(undefined);
        setIsError(false);
      })
      .catch((error: Error) => {
        setError(error);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, deps);

  return {
    data,
    isLoading,
    isError,
    error
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { data, isLoading, isError, error } = useAsync(() => fetch('url'), [deps]);
```

## Type Declarations

```tsx
import type { DependencyList } from 'react';

export interface UseAsyncReturn<Data> {
  /* The state of the query */
  data?: Data;
  /* The error of the query */
  error?: Error;
  /* The error state of the query  */
  isError: boolean;
  /* The loading state of the query */
  isLoading: boolean;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `() => Promise<Data>` | - | The async callback |
| deps | `DependencyList` | [] | The dependencies of the callback |

### Returns

`UseAsyncReturn<Data>` - The state of the async callback