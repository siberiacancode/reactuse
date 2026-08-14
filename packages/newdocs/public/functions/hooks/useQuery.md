---
title: useQuery
description: Hook that defines the logic when query data
category: async
usage: high
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1783581480000
---

# useQuery

Hook that defines the logic when query data

## Demo

```tsx
import { useQuery } from '@siberiacancode/reactuse';
import { useState } from 'react';

import { cn } from '@/utils/lib';

interface Pokemon {
  id: number;
  name: string;
}

interface Generation {
  pokemon_species: { name: string; url: string }[];
}

const GENERATIONS = [
  { id: 1, label: 'Gen I' },
  { id: 2, label: 'Gen II' },
  { id: 3, label: 'Gen III' },
  { id: 4, label: 'Gen IV' }
];

const getIdFromUrl = (url: string) => {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
};

const getImageUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const fetchGeneration = async (generation: number): Promise<Pokemon[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const data = (await fetch(`https://pokeapi.co/api/v2/generation/${generation}`).then((res) =>
    res.json()
  )) as Generation;

  return data.pokemon_species
    .map((species) => ({ name: species.name, id: getIdFromUrl(species.url) }))
    .sort((a, b) => a.id - b.id);
};

const Demo = () => {
  const [generation, setGeneration] = useState(1);

  const pokemonQuery = useQuery(() => fetchGeneration(generation), {
    keys: [generation]
  });

  const loading = pokemonQuery.isLoading || pokemonQuery.isRefetching;
  const pokemon = pokemonQuery.data ?? [];

  return (
    <section className='flex w-full max-w-md flex-col gap-3 p-4'>
      <div className='bg-muted flex items-center gap-0.5 self-start rounded-lg p-0.5'>
        {GENERATIONS.map((item) => (
          <button
            key={item.id}
            className={cn(
              'rounded-md! px-3 py-1 text-xs font-medium transition-colors',
              generation === item.id ? 'bg-background shadow-sm' : 'text-muted-foreground'
            )}
            data-variant='unstyled'
            type='button'
            onClick={() => setGeneration(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className='no-scrollbar h-[340px] overflow-y-auto'>
        <div className='grid auto-rows-[112px] grid-cols-2 gap-2 sm:auto-rows-[96px] sm:grid-cols-4'>
          {loading &&
            Array.from({ length: 12 }, (_, index) => (
              <div
                key={index}
                className='border-border bg-card h-full animate-pulse rounded-xl border p-2'
              />
            ))}

          {!loading &&
            pokemon.map((item) => (
              <div
                key={item.id}
                className='border-border bg-card hover:bg-muted/40 flex h-full flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border p-2 transition-colors'
              >
                <img
                  alt={item.name}
                  className='size-16 object-contain'
                  loading='lazy'
                  src={getImageUrl(item.id)}
                />
                <span className='text-muted-foreground font-mono text-[10px] tabular-nums'>
                  #{String(item.id).padStart(3, '0')}
                </span>
                <span className='text-foreground w-full truncate text-center text-xs font-medium capitalize'>
                  {item.name}
                </span>
              </div>
            ))}
        </div>
      </div>

      <p className='text-muted-foreground text-center text-xs'>
        {loading ? 'Loading Pokémon…' : `${pokemon.length} Pokémon in this generation`}
      </p>
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
npx useverse@latest add useQuery
```

### Manual

Copy and paste the following code into your project.

```tsx
import type { DependencyList } from 'react';

import { useEffect, useRef, useState } from 'react';

import { getRetry } from '@/utils/helpers';

import { useDidUpdate } from '../useDidUpdate/useDidUpdate';
import { useMount } from '../useMount/useMount';

/* The use query return type */
export interface UseQueryOptions<QueryData, Data> {
  /* The enabled state of the query */
  enabled?: boolean;
  /* The depends for the hook */
  keys?: DependencyList;
  /* The placeholder data for the hook */
  placeholderData?: (() => Data) | Data;
  /* The refetch interval, or a function returning the interval (false to stop) */
  refetchInterval?: (() => number | false) | number | false;
  /* The retry count of requests, or a function to decide whether to retry */
  retry?: ((failureCount: number, error: Error) => boolean) | boolean | number;
  /* The delay in milliseconds before retrying the request */
  retryDelay?: number;
  /* The callback function to be invoked on error */
  onError?: (error: Error) => void;
  /* The callback function to be invoked on success */
  onSuccess?: (data: Data) => void;
  /* The select function to be invoked */
  select?: (data: QueryData) => Data;
}

interface UseQueryCallbackParams {
  /* The depends for the hook */
  keys: DependencyList;
  /* The abort signal */
  signal: AbortSignal;
}

/* The use query return type */
export interface UseQueryReturn<Data> {
  /* The abort function */
  abort: AbortController['abort'];
  /* The state of the query */
  data?: Data;
  /* The success state of the query */
  error?: Error;
  /* The error state of the query */
  isError: boolean;
  /* The fetching state of the query */
  isFetching: boolean;
  /* The loading state of the query */
  isLoading: boolean;
  /* The refetching state of the query */
  isRefetching: boolean;
  /* The success state of the query */
  isSuccess: boolean;
  /* The fetch promise function */
  fetch: () => Promise<void>;
  /* The refetch function */
  refetch: () => void;
}

/**
 * @name useQuery
 * @description - Hook that defines the logic when query data
 * @category Async
 * @usage high
 *
 * @template Data The type of the data
 * @param {() => Promise<Data>} callback The callback function to be invoked
 * @param {DependencyList} [options.keys] The dependencies for the hook
 * @param {(data: Data) => void} [options.onSuccess] The callback function to be invoked on success
 * @param {(error: Error) => void} [options.onError] The callback function to be invoked on error
 * @param {UseQueryOptionsSelect<Data>} [options.select] The select function to be invoked
 * @param {Data | (() => Data)} [options.placeholderData] The placeholder data for the hook
 * @param {number} [options.refetchInterval] The refetch interval
 * @param {boolean | number | ((failureCount: number, error: Error) => boolean)} [options.retry] The retry count of requests, or a function to decide whether to retry
 * @param {number} [options.retryDelay=0] The delay in milliseconds before retrying the request
 * @returns {UseQueryReturn<Data>} An object with the state of the query
 *
 * @example
 * const { data, isFetching, isLoading, isError, isSuccess, error, refetch, isRefetching, abort } = useQuery(() => fetch('url'));
 */
export const useQuery = <QueryData, Data = QueryData>(
  callback: (params: UseQueryCallbackParams) => Promise<QueryData>,
  options?: UseQueryOptions<QueryData, Data>
): UseQueryReturn<Data> => {
  const enabled = options?.enabled ?? true;
  const canRequestOnMount = enabled && typeof window !== 'undefined';
  const failureCountRef = useRef(0);
  const alreadyRequestedRef = useRef(false);

  const [isFetching, setIsFetching] = useState(canRequestOnMount);
  const [isLoading, setIsLoading] = useState(canRequestOnMount);
  const [isError, setIsError] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(!!options?.placeholderData);

  const [error, setError] = useState<Error | undefined>(undefined);
  const [data, setData] = useState<Data | undefined>(options?.placeholderData);

  const abortControllerRef = useRef<AbortController>(new AbortController());
  const intervalIdRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const retryTimeoutIdRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const keys = options?.keys ?? [];

  const abort = () => {
    clearTimeout(retryTimeoutIdRef.current);
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
  };

  const request = (action: 'init' | 'refetch'): Promise<void> => {
    abort();

    setIsFetching(true);
    if (action === 'init') {
      alreadyRequestedRef.current = true;
      setIsLoading(true);
    }
    if (action === 'refetch') setIsRefetching(true);
    return callback({ signal: abortControllerRef.current.signal, keys })
      .then((response) => {
        const data = options?.select ? options?.select(response) : response;
        options?.onSuccess?.(data as Data);
        failureCountRef.current = 0;
        setData(data as Data);
        setIsSuccess(true);
        setError(undefined);
        setIsError(false);
        setIsFetching(false);
        if (action === 'init') setIsLoading(false);
        if (action === 'refetch') setIsRefetching(false);
      })
      .catch((error: Error) => {
        if (
          typeof options?.retry === 'function'
            ? options.retry(failureCountRef.current, error)
            : failureCountRef.current < getRetry(options?.retry ?? 0)
        ) {
          failureCountRef.current += 1;
          const delay = options?.retryDelay ?? 0;
          if (!delay) {
            request(action);
            return;
          }
          retryTimeoutIdRef.current = setTimeout(request, delay, action);
          return;
        }
        options?.onError?.(error);
        failureCountRef.current = 0;
        setData(undefined);
        setIsSuccess(false);
        setError(error);
        setIsError(true);
        setIsFetching(false);
        if (action === 'init') setIsLoading(false);
        if (action === 'refetch') setIsRefetching(false);
      })
      .finally(() => {
        const refetchInterval =
          typeof options?.refetchInterval === 'function'
            ? options.refetchInterval()
            : options?.refetchInterval;

        if (refetchInterval) {
          const interval = setInterval(() => {
            clearInterval(interval);
            request('refetch');
          }, refetchInterval);
          intervalIdRef.current = interval;
        }
      });
  };

  useMount(() => {
    if (!enabled) return;
    void request('init');
  });

  useDidUpdate(() => {
    if (!enabled) return;
    void request(alreadyRequestedRef.current ? 'refetch' : 'init');
  }, [enabled, ...keys]);

  useEffect(
    () => () => {
      clearInterval(intervalIdRef.current);
      clearTimeout(retryTimeoutIdRef.current);
    },
    [enabled, options?.retry, ...keys]
  );

  const refetch = () => {
    request('refetch');
  };

  const fetch = () => request('refetch');

  return {
    abort,
    data,
    error,
    refetch,
    isFetching,
    isLoading,
    isError,
    isSuccess,
    isRefetching,
    fetch
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { data, isFetching, isLoading, isError, isSuccess, error, refetch, isRefetching, abort } = useQuery(() => fetch('url'));
```

## Type Declarations

```tsx
import type { DependencyList } from 'react';

export interface UseQueryOptions<QueryData, Data> {
  /* The enabled state of the query */
  enabled?: boolean;
  /* The depends for the hook */
  keys?: DependencyList;
  /* The placeholder data for the hook */
  placeholderData?: (() => Data) | Data;
  /* The refetch interval, or a function returning the interval (false to stop) */
  refetchInterval?: (() => number | false) | number | false;
  /* The retry count of requests, or a function to decide whether to retry */
  retry?: ((failureCount: number, error: Error) => boolean) | boolean | number;
  /* The delay in milliseconds before retrying the request */
  retryDelay?: number;
  /* The callback function to be invoked on error */
  onError?: (error: Error) => void;
  /* The callback function to be invoked on success */
  onSuccess?: (data: Data) => void;
  /* The select function to be invoked */
  select?: (data: QueryData) => Data;
}

interface UseQueryCallbackParams {
  /* The depends for the hook */
  keys: DependencyList;
  /* The abort signal */
  signal: AbortSignal;
}

export interface UseQueryReturn<Data> {
  /* The abort function */
  abort: AbortController['abort'];
  /* The state of the query */
  data?: Data;
  /* The success state of the query */
  error?: Error;
  /* The error state of the query */
  isError: boolean;
  /* The fetching state of the query */
  isFetching: boolean;
  /* The loading state of the query */
  isLoading: boolean;
  /* The refetching state of the query */
  isRefetching: boolean;
  /* The success state of the query */
  isSuccess: boolean;
  /* The fetch promise function */
  fetch: () => Promise<void>;
  /* The refetch function */
  refetch: () => void;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `() => Promise<Data>` | - | The callback function to be invoked |
| options.keys | `DependencyList` | - | The dependencies for the hook |
| options.onSuccess | `(data: Data) => void` | - | The callback function to be invoked on success |
| options.onError | `(error: Error) => void` | - | The callback function to be invoked on error |
| options.select | `UseQueryOptionsSelect<Data>` | - | The select function to be invoked |
| options.placeholderData | `Data \| (() => Data)` | - | The placeholder data for the hook |
| options.refetchInterval | `number` | - | The refetch interval |
| options.retry | `boolean \| number \| ((failureCount: number, error: Error) => boolean)` | - | The retry count of requests, or a function to decide whether to retry |
| options.retryDelay | `number` | 0 | The delay in milliseconds before retrying the request |

### Returns

`UseQueryReturn<Data>` - An object with the state of the query