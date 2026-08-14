---
title: useUrlSearchParam
description: Hook that provides reactive URLSearchParams for a single key
category: state
usage: high
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1786530233000
---

# useUrlSearchParam

Hook that provides reactive URLSearchParams for a single key

## Demo

```tsx
import {
  useDebounceCallback,
  useDisclosure,
  useField,
  useMutation,
  useUrlSearchParam
} from '@siberiacancode/reactuse';
import { Loader2Icon, SearchIcon, TrendingUpIcon } from 'lucide-react';
import { useState } from 'react';

interface Result {
  description: string;
  title: string;
  url: string;
}

const RESULTS: Result[] = [
  {
    title: 'React',
    description: 'The library for web and native user interfaces.',
    url: 'react.dev'
  },
  {
    title: 'TypeScript',
    description: 'JavaScript with syntax for types. Catches errors early in your editor.',
    url: 'typescriptlang.org'
  },
  {
    title: 'Vite',
    description: 'Next generation frontend tooling. Instant server start and lightning-fast HMR.',
    url: 'vite.dev'
  },
  {
    title: 'Tailwind CSS',
    description: 'A utility-first CSS framework for rapidly building custom user interfaces.',
    url: 'tailwindcss.com'
  },
  {
    title: 'Next.js',
    description: "The React framework for the web. Used by some of the world's largest companies.",
    url: 'nextjs.org'
  },
  {
    title: 'Vitest',
    description: 'A blazing fast unit test framework powered by Vite.',
    url: 'vitest.dev'
  },
  {
    title: 'ESLint',
    description: 'Find and fix problems in your JavaScript code.',
    url: 'eslint.org'
  },
  {
    title: 'Prettier',
    description: 'An opinionated code formatter that supports many languages.',
    url: 'prettier.io'
  },
  {
    title: 'Playwright',
    description: 'Reliable end-to-end testing for modern web apps.',
    url: 'playwright.dev'
  },
  {
    title: 'Storybook',
    description: 'Frontend workshop for building UI components and pages in isolation.',
    url: 'storybook.js.org'
  }
];

const searchData = (query: string) =>
  new Promise<Result[]>((resolve) => {
    const count = (query.length % 4) + 2;
    const start = query.length % RESULTS.length;
    const results = Array.from(
      { length: count },
      (_, index) => RESULTS[(start + index) % RESULTS.length]
    );
    setTimeout(resolve, 600, results);
  });

const Demo = () => {
  const searchParam = useUrlSearchParam('q', '');
  const searchField = useField(searchParam.value ?? '');
  const dropdown = useDisclosure();
  const [results, setResults] = useState<Result[]>([]);

  const searchDataMutation = useMutation(searchData);

  const debouncedSearch = useDebounceCallback(async (value: string) => {
    const searchDataResponse = await searchDataMutation.mutateAsync(value);
    setResults(searchDataResponse);
  }, 400);

  const onChange = (value: string) => {
    searchParam.set(value);
    dropdown.open();
    if (value.trim()) {
      debouncedSearch(value);
      return;
    }
    setResults([]);
  };

  const search = searchField.watch();

  return (
    <section className='flex w-full max-w-md flex-col items-center gap-4 p-6 text-center'>
      <div className='bg-muted flex size-14 items-center justify-center rounded-full'>
        <SearchIcon className='size-7' />
      </div>

      <div className='flex flex-col gap-1'>
        <h3 className='text-foreground text-lg font-semibold'>Find top tools for your app</h3>
        <p className='text-muted-foreground text-sm'>
          Search across the modern frontend stack and discover the right tool for the job.
        </p>
      </div>

      <div className='relative w-full'>
        <SearchIcon className='text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2' />
        <input
          className='h-12! w-full rounded-xl! pr-4! pl-11! text-base'
          placeholder='Search tools…'
          type='text'
          {...searchField.register({
            onChange: (event) => onChange(event.target.value)
          })}
        />

        {dropdown.opened &&
          !!search.trim() &&
          (!!results.length || searchDataMutation.isLoading) && (
            <div
              className='absolute top-full right-0 left-0 z-50 mt-2 text-left'
              data-slot='dropdown-menu-content'
            >
              {searchDataMutation.isLoading && (
                <div className='text-muted-foreground flex items-center justify-center gap-2 px-3 py-6 text-sm'>
                  <Loader2Icon className='size-4 animate-spin' />
                  Searching…
                </div>
              )}

              {!searchDataMutation.isLoading &&
                results.map((result) => (
                  <div key={result.title} data-slot='dropdown-menu-item'>
                    <TrendingUpIcon className='text-muted-foreground mt-0.5 size-4 shrink-0 self-start' />
                    <div className='flex min-w-0 flex-1 flex-col'>
                      <div className='flex items-baseline gap-2'>
                        <span className='text-foreground text-sm font-medium'>{result.title}</span>
                        <span className='text-muted-foreground truncate text-xs'>{result.url}</span>
                      </div>
                      <span className='text-muted-foreground truncate text-xs'>
                        {result.description}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
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
npx useverse@latest add useUrlSearchParam
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useState } from 'react';

/** The url search params mode type */
export type UrlSearchParamMode = 'hash-params' | 'hash' | 'history';

/** The use url search param options type */
export interface UseUrlSearchParamOptions<Value> {
  /** The initial value of the search param */
  initialValue?: Value;
  /** The mode to use for writing to the URL */
  mode?: UrlSearchParamMode;
  /** The mode to use for writing to the URL */
  write?: 'push' | 'replace';
  /** The deserializer function to be invoked */
  deserializer?: (value: string) => Value;
  /** The serializer function to be invoked */
  serializer?: (value: Value) => string;
}

/** The use url search params set options type */
export interface UseUrlSearchParamsActionOptions {
  /** The mode to use for writing to the URL */
  write?: 'push' | 'replace';
}

/** The use url search param return type */
export interface UseUrlSearchParamReturn<Value> {
  /** Current search param value */
  value: Value | undefined;
  /** Function to remove the search param */
  remove: (options?: UseUrlSearchParamsActionOptions) => void;
  /** Function to update search param */
  set: (value: Value, options?: UseUrlSearchParamsActionOptions) => void;
}

export const URL_SEARCH_PARAMS_EVENT = 'reactuse-url-search-params-event';

export const getUrlSearchParams = (mode: UrlSearchParamMode = 'history') => {
  const { search, hash } = window.location;

  let path = '';

  if (mode === 'history') path = search;
  if (mode === 'hash-params') path = hash.replace(/^#/, '');
  if (mode === 'hash') {
    const index = hash.indexOf('?');
    path = ~index ? hash.slice(index) : '';
  }

  return new URLSearchParams(path);
};

export const createQueryString = (searchParams: URLSearchParams, mode: UrlSearchParamMode) => {
  const searchParamsString = searchParams.toString();
  const { search, hash } = window.location;

  if (mode === 'history') return `${searchParamsString ? `?${searchParamsString}` : ''}${hash}`;
  if (mode === 'hash-params')
    return `${search}${searchParamsString ? `#${searchParamsString}` : ''}`;
  if (mode === 'hash') {
    const index = hash.indexOf('?');
    const base = index > -1 ? hash.slice(0, index) : hash;
    return `${search}${base}${searchParamsString ? `?${searchParamsString}` : ''}`;
  }

  throw new Error('Invalid mode');
};

export const dispatchUrlSearchParamsEvent = () =>
  window.dispatchEvent(new Event(URL_SEARCH_PARAMS_EVENT));

export interface UseUrlSearchParam {
  <Value>(
    key: string,
    options: UseUrlSearchParamOptions<Value> & { initialValue: Value }
  ): UseUrlSearchParamReturn<Value>;

  <Value>(
    key: string,
    options?: UseUrlSearchParamOptions<Value>
  ): UseUrlSearchParamReturn<Value | undefined>;

  <Value>(key: string, initialValue: Value): UseUrlSearchParamReturn<Value>;

  <Value>(key: string): UseUrlSearchParamReturn<Value | undefined>;
}

/**
 * @name useUrlSearchParam
 * @description - Hook that provides reactive URLSearchParams for a single key
 * @category State
 * @usage high
 *
 * @overload
 * @template Value The type of the url param values
 * @param {string} key The key of the url param
 * @param {UseUrlSearchParamOptions<Value> & { initialValue: Value }} options The options object with required initialValue
 * @param {Value} options.initialValue The initial value for the url param
 * @param {UrlSearchParamsMode} [options.mode='history'] The mode to use for the URL ('history' | 'hash-params' | 'hash')
 * @param {'push' | 'replace'} [options.write='replace'] The mode to use for writing to the URL
 * @param {(value: Value) => string} [options.serializer] Custom serializer function to convert value to string
 * @param {(value: string) => Value} [options.deserializer] Custom deserializer function to convert string to value
 * @returns {UseUrlSearchParamReturn<Value>} The object with value and function for change value
 *
 * @example
 * const { value, set } = useUrlSearchParam('page', { initialValue: 1 });
 *
 * @overload
 * @template Value The type of the url param values
 * @param {string} key The key of the url param
 * @param {Value} [initialValue] The initial value for the url param
 * @returns {UseUrlSearchParamReturn<Value>} The object with value and function for change value
 *
 * @example
 * const { value, set } = useUrlSearchParam('page', 1);
 */
export const useUrlSearchParam = (<Value>(key: string, params?: any) => {
  const options = (
    typeof params === 'object' &&
    params &&
    ('serializer' in params ||
      'deserializer' in params ||
      'initialValue' in params ||
      'mode' in params ||
      'write' in params)
      ? params
      : undefined
  ) as UseUrlSearchParamOptions<Value>;

  const initialValue = (options ? options?.initialValue : params) as Value;
  const { mode = 'history', write: writeMode = 'replace' } = options ?? {};

  if (typeof window === 'undefined') {
    return {
      value: initialValue,
      remove: () => {},
      set: () => {}
    } as UseUrlSearchParamReturn<Value>;
  }

  const serializer = (value: Value) => {
    if (options?.serializer) return options.serializer(value);
    if (typeof value === 'string') return value;

    return JSON.stringify(value);
  };

  const deserializer = (value: string) => {
    if (options?.deserializer) return options.deserializer(value);
    if (value === 'undefined' || value === 'null') return undefined as unknown as Value;

    try {
      return JSON.parse(value) as Value;
    } catch {
      return value as Value;
    }
  };

  const setUrlSearchParam = (
    key: string,
    value: Value | undefined,
    mode: UrlSearchParamMode,
    write: 'push' | 'replace' = 'replace'
  ) => {
    const urlSearchParams = getUrlSearchParams(mode);

    if (value === undefined) {
      urlSearchParams.delete(key);
    } else {
      const serializedValue = serializer ? serializer(value) : String(value);
      urlSearchParams.set(key, serializedValue);
    }

    const query = createQueryString(urlSearchParams, mode);
    if (write === 'replace') window.history.replaceState({}, '', query);
    if (write === 'push') window.history.pushState({}, '', query);

    dispatchUrlSearchParamsEvent();
  };

  const [value, setValue] = useState<Value | undefined>(() => {
    const urlSearchParams = getUrlSearchParams(mode);
    const currentValue = urlSearchParams.get(key);

    return currentValue !== null ? deserializer(currentValue) : initialValue;
  });

  const set = (value: Value, options?: UseUrlSearchParamsActionOptions) => {
    setUrlSearchParam(key, value, mode, options?.write ?? writeMode);
    setValue(value);
  };

  useEffect(() => {
    if (initialValue === undefined) return;

    const urlSearchParams = getUrlSearchParams(mode);
    if (urlSearchParams.get(key) !== null) return;

    setUrlSearchParam(key, initialValue, mode, writeMode);
  }, []);

  const remove = (options?: UseUrlSearchParamsActionOptions) => {
    setUrlSearchParam(key, undefined, mode, options?.write ?? writeMode);
    setValue(undefined);
  };

  useEffect(() => {
    if (initialValue === undefined) return;
    const urlSearchParams = getUrlSearchParams(mode);
    if (urlSearchParams.get(key) !== null) return;
    setUrlSearchParam(key, initialValue, mode, writeMode);
  }, []);

  useEffect(() => {
    const onParamsChange = () => {
      const urlSearchParams = getUrlSearchParams(mode);
      const newValue = urlSearchParams.get(key);

      setValue(newValue ? deserializer(newValue) : undefined);
    };

    window.addEventListener(URL_SEARCH_PARAMS_EVENT, onParamsChange);
    window.addEventListener('popstate', onParamsChange);
    if (mode !== 'history') {
      window.addEventListener('hashchange', onParamsChange);
    }

    return () => {
      window.removeEventListener(URL_SEARCH_PARAMS_EVENT, onParamsChange);
      window.removeEventListener('popstate', onParamsChange);
      if (mode !== 'history') {
        window.removeEventListener('hashchange', onParamsChange);
      }
    };
  }, [key, mode]);

  return {
    value,
    remove,
    set
  };
}) as UseUrlSearchParam;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { value, set } = useUrlSearchParam('page', { initialValue: 1 });
// or
const { value, set } = useUrlSearchParam('page', 1);
```

## Type Declarations

```tsx
export type UrlSearchParamMode = 'hash-params' | 'hash' | 'history';

export interface UseUrlSearchParamOptions<Value> {
  /** The initial value of the search param */
  initialValue?: Value;
  /** The mode to use for writing to the URL */
  mode?: UrlSearchParamMode;
  /** The mode to use for writing to the URL */
  write?: 'push' | 'replace';
  /** The deserializer function to be invoked */
  deserializer?: (value: string) => Value;
  /** The serializer function to be invoked */
  serializer?: (value: Value) => string;
}

export interface UseUrlSearchParamsActionOptions {
  /** The mode to use for writing to the URL */
  write?: 'push' | 'replace';
}

export interface UseUrlSearchParamReturn<Value> {
  /** Current search param value */
  value: Value | undefined;
  /** Function to remove the search param */
  remove: (options?: UseUrlSearchParamsActionOptions) => void;
  /** Function to update search param */
  set: (value: Value, options?: UseUrlSearchParamsActionOptions) => void;
}

export interface UseUrlSearchParam {
  <Value>(
    key: string,
    options: UseUrlSearchParamOptions<Value> & { initialValue: Value }
  ): UseUrlSearchParamReturn<Value>;

  <Value>(
    key: string,
    options?: UseUrlSearchParamOptions<Value>
  ): UseUrlSearchParamReturn<Value | undefined>;

  <Value>(key: string, initialValue: Value): UseUrlSearchParamReturn<Value>;

  <Value>(key: string): UseUrlSearchParamReturn<Value | undefined>;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| key | `string` | - | The key of the url param |
| options | `UseUrlSearchParamOptions<Value> & { initialValue: Value }` | - | The options object with required initialValue |
| options.initialValue | `Value` | - | The initial value for the url param |
| options.mode | `UrlSearchParamsMode` | 'history' | The mode to use for the URL ('history' \| 'hash-params' \| 'hash') |
| options.write | `'push' \| 'replace'` | 'replace' | The mode to use for writing to the URL |
| options.serializer | `(value: Value) => string` | - | Custom serializer function to convert value to string |
| options.deserializer | `(value: string) => Value` | - | Custom deserializer function to convert string to value |

#### Returns

`UseUrlSearchParamReturn<Value>` - The object with value and function for change value

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| key | `string` | - | The key of the url param |
| initialValue | `Value` | - | The initial value for the url param |

#### Returns

`UseUrlSearchParamReturn<Value>` - The object with value and function for change value