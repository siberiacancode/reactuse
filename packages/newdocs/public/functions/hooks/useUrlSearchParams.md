---
title: useUrlSearchParams
description: Hook that provides reactive URLSearchParams
category: state
usage: high
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1786530233000
---

# useUrlSearchParams

Hook that provides reactive URLSearchParams

## Demo

```tsx
import { useUrlSearchParams } from '@siberiacancode/reactuse';
import { ClockIcon, SearchIcon } from 'lucide-react';

const RECIPES = [
  {
    emoji: '🍕',
    name: 'Margherita Pizza',
    cuisine: 'Italian',
    time: 30,
    description: 'Classic Naples-style pizza with a thin, blistered crust and fresh basil.',
    ingredients: ['Dough', 'Tomatoes', 'Mozzarella', 'Basil', 'Olive oil']
  },
  {
    emoji: '🍣',
    name: 'Salmon Sushi',
    cuisine: 'Japanese',
    time: 45,
    description: 'Delicate nigiri topped with buttery fresh salmon over seasoned rice.',
    ingredients: ['Sushi rice', 'Salmon', 'Nori', 'Soy sauce', 'Wasabi']
  },
  {
    emoji: '🌮',
    name: 'Beef Tacos',
    cuisine: 'Mexican',
    time: 25,
    description: 'Crispy tacos loaded with spiced beef, cheddar and a punch of fresh salsa.',
    ingredients: ['Tortillas', 'Ground beef', 'Onion', 'Cheddar', 'Salsa']
  },
  {
    emoji: '🥗',
    name: 'Greek Salad',
    cuisine: 'Greek',
    time: 15,
    description: 'Crisp cucumbers, juicy tomatoes and creamy feta with a drizzle of olive oil.',
    ingredients: ['Cucumber', 'Tomatoes', 'Feta', 'Olives', 'Red onion']
  },
  {
    emoji: '🍝',
    name: 'Pasta Carbonara',
    cuisine: 'Italian',
    time: 20,
    description: 'Silky Roman pasta with eggs, crispy pancetta and plenty of parmesan.',
    ingredients: ['Spaghetti', 'Eggs', 'Pancetta', 'Parmesan', 'Black pepper']
  },
  {
    emoji: '🍜',
    name: 'Veggie Ramen',
    cuisine: 'Japanese',
    time: 35,
    description: 'Warming miso broth with springy noodles, tofu and earthy mushrooms.',
    ingredients: ['Ramen noodles', 'Miso', 'Tofu', 'Mushrooms', 'Scallions']
  },
  {
    emoji: '🌯',
    name: 'Bean Burrito',
    cuisine: 'Mexican',
    time: 20,
    description: 'Hearty wrap stuffed with black beans, rice, avocado and sweet corn.',
    ingredients: ['Tortilla', 'Black beans', 'Rice', 'Avocado', 'Corn']
  },
  {
    emoji: '🥘',
    name: 'Seafood Paella',
    cuisine: 'Spanish',
    time: 50,
    description: 'Saffron-scented rice simmered with shrimp, mussels and sweet peas.',
    ingredients: ['Rice', 'Shrimp', 'Mussels', 'Saffron', 'Peas']
  }
];

const CUISINES = ['All', 'Italian', 'Japanese', 'Mexican', 'Greek', 'Spanish'];

interface Filters {
  cuisine: string;
  search: string;
}

const Demo = () => {
  const filters = useUrlSearchParams<Filters>({
    search: '',
    cuisine: 'All'
  });

  const { cuisine } = filters.value;
  const search = String(filters.value.search ?? '');

  const results = RECIPES.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(search.toLowerCase().trim());
    const matchesCuisine = cuisine === 'All' || recipe.cuisine === cuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <section className='flex w-full max-w-lg flex-col gap-4 p-4'>
      <div className='flex flex-col gap-1'>
        <h3 className='text-foreground text-base font-semibold'>Discover recipes</h3>
        <p className='text-muted-foreground text-sm'>
          Filter the cookbook — your choices are saved in the URL, so you can share the exact view.
        </p>
      </div>

      <div className='flex items-center gap-2'>
        <div className='relative flex-1'>
          <SearchIcon className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <input
            className='w-full rounded-lg! pl-9!'
            placeholder='Search recipes…'
            type='text'
            value={search}
            onChange={(event) => filters.set({ search: event.target.value })}
          />
        </div>

        <select value={cuisine} onChange={(event) => filters.set({ cuisine: event.target.value })}>
          {CUISINES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className='no-scrollbar flex max-h-96 flex-col gap-2 overflow-y-auto'>
        {!results.length && (
          <p className='text-muted-foreground py-8 text-center text-sm'>No recipes match</p>
        )}

        {results.map((recipe) => (
          <div
            key={recipe.name}
            className='bg-card flex min-h-[88px] gap-3 overflow-hidden rounded-xl p-3'
          >
            <span className='bg-muted flex size-12 shrink-0 items-center justify-center rounded-lg text-2xl'>
              {recipe.emoji}
            </span>

            <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
              <div className='flex items-center justify-between gap-2'>
                <span className='text-foreground truncate text-sm font-medium'>{recipe.name}</span>
                <span className='text-muted-foreground flex shrink-0 items-center gap-1 text-xs'>
                  <ClockIcon className='size-3' />
                  {recipe.time} min
                </span>
              </div>
              <p className='text-muted-foreground truncate text-xs'>{recipe.description}</p>
              <p className='text-muted-foreground/70 truncate text-[11px]'>
                {recipe.ingredients.join(' · ')}
              </p>
            </div>
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
npx useverse@latest add useUrlSearchParams
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useState } from 'react';

import {
  createQueryString,
  dispatchUrlSearchParamsEvent,
  getUrlSearchParams,
  URL_SEARCH_PARAMS_EVENT
} from '../useUrlSearchParam/useUrlSearchParam';

/** The url params type */
export type UrlParams = Record<string, any>;

/** The url search params mod */
export type UrlSearchParamsMode = 'hash-params' | 'hash' | 'history';

/** The use url search params set options type */
export interface UseUrlSearchParamsSetOptions {
  /** The mode to use for writing to the URL */
  write?: 'push' | 'replace';
}

/* The use search params initial value type */
export type UseUrlSearchParamsInitialValue<Value> = (() => Value) | Value;

/** The use url search params options type */
export interface UseUrlSearchParamsOptions<Value> {
  /** The mode to use for writing to the URL */
  mode?: UrlSearchParamsMode;
  /** The mode to use for writing to the URL  */
  write?: 'push' | 'replace';
  /* The deserializer function to be invoked */
  deserializer?: (value: string) => Value[keyof Value];
  /* The serializer function to be invoked */
  serializer?: (value: Value[keyof Value]) => string;
}

/** The use url search params return type */
export interface UseUrlSearchParamsReturn<Value> {
  /** The value of the url search params */
  value: Value;
  /** The set function */
  set: (value: Partial<Value>, options?: UseUrlSearchParamsSetOptions) => void;
}

export interface UseUrlSearchParams {
  <Value>(
    options: UseUrlSearchParamsOptions<Value> & {
      initialValue: UseUrlSearchParamsInitialValue<Value>;
    }
  ): UseUrlSearchParamsReturn<Value>;

  <Value>(options?: UseUrlSearchParamsOptions<Value>): UseUrlSearchParamsReturn<Value | undefined>;

  <Value>(initialValue: UseUrlSearchParamsInitialValue<Value>): UseUrlSearchParamsReturn<Value>;
}

/**
 * @name useUrlSearchParams
 * @description - Hook that provides reactive URLSearchParams
 * @category State
 * @usage high
 *
 * @overload
 * @template Value The type of the url param values
 * @param {UseUrlSearchParamsOptions<Value> & { initialValue: UseUrlSearchParamsInitialValue<Value> }} options The options object with required initialValue
 * @param {UseUrlSearchParamsInitialValue<Value>} [options.initialValue] The initial value for the url params
 * @param {UrlSearchParamsMode} [options.mode='history'] The mode to use for the URL ('history' | 'hash-params' | 'hash')
 * @param {'push' | 'replace'} [options.write='replace'] The mode to use for writing to the URL
 * @param {(value: Value[keyof Value]) => string} [options.serializer] Custom serializer function to convert value to string
 * @param {(value: string) => Value[keyof Value]} [options.deserializer] Custom deserializer function to convert string to value
 * @returns {UseUrlSearchParamsReturn<Value>} The object with value and function for change value
 *
 * @example
 * const { value, set } = useUrlSearchParams({ initialValue: { page: 1 } });
 *
 * @overload
 * @template Value The type of the url param values
 * @param {UseUrlSearchParamsInitialValue<Value>} [initialValue] The initial value for the url params
 * @returns {UseUrlSearchParamsReturn<Value>} The object with value and function for change value
 *
 * @example
 * const { value, set } = useUrlSearchParams({ page: 1 });
 */
export const useUrlSearchParams = (<Value extends UrlParams>(
  params: any
): UseUrlSearchParamsReturn<Value> => {
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
  ) as
    | (UseUrlSearchParamsOptions<Value> & {
        initialValue?: UseUrlSearchParamsInitialValue<Value>;
      })
    | undefined;
  const initialValue = (
    options ? options?.initialValue : params
  ) as UseUrlSearchParamsInitialValue<Value>;

  const { mode = 'history', write: writeMode = 'replace' } = options ?? {};

  const serializer = (value: Value[keyof Value]) => {
    if (options?.serializer) return options.serializer(value);
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  };

  const deserializer = (value: string) => {
    if (options?.deserializer) return options.deserializer(value);
    if (value === 'undefined') return undefined as unknown as Value[keyof Value];

    try {
      return JSON.parse(value) as Value;
    } catch {
      return value as Value[keyof Value];
    }
  };

  const setUrlSearchParams = <Value extends UrlParams>(
    mode: UrlSearchParamsMode,
    value: Partial<Value>,
    write: 'push' | 'replace' = 'replace'
  ) => {
    const urlSearchParams = getUrlSearchParams(mode);

    Object.entries(value).forEach(([key, param]) => {
      if (param === undefined) {
        urlSearchParams.delete(key);
      } else {
        const serializedValue = serializer ? serializer(param) : String(param);
        urlSearchParams.set(key, serializedValue);
      }
    });

    const query = createQueryString(urlSearchParams, mode);
    if (write === 'replace') window.history.replaceState({}, '', query);
    if (write === 'push') window.history.pushState({}, '', query);
    dispatchUrlSearchParamsEvent();

    return urlSearchParams;
  };

  const getParsedUrlSearchParams = (searchParams: string | UrlParams | URLSearchParams) => {
    if (typeof searchParams === 'string') {
      return getParsedUrlSearchParams(new URLSearchParams(searchParams));
    }

    if (searchParams instanceof URLSearchParams) {
      return [...searchParams.entries()].reduce(
        (acc, [key, value]) => {
          acc[key] = deserializer(value);
          return acc;
        },
        {} as Record<string, any>
      );
    }

    return searchParams;
  };

  const [value, setValue] = useState<Value>(() => {
    if (typeof window === 'undefined') return (initialValue ?? {}) as Value;

    const urlSearchParams = getUrlSearchParams(mode);
    return {
      ...(initialValue && getParsedUrlSearchParams(initialValue)),
      ...getParsedUrlSearchParams(urlSearchParams)
    } as Value;
  });

  const set = (params: Partial<Value>, options?: UseUrlSearchParamsSetOptions) => {
    const searchParams = setUrlSearchParams(
      mode,
      { ...value, ...params },
      options?.write ?? writeMode
    );
    setValue(getParsedUrlSearchParams(searchParams) as Value);
  };

  useEffect(() => {
    if (!initialValue) return;
    const urlSearchParams = getUrlSearchParams(mode);
    const currentParams = Object.keys(getParsedUrlSearchParams(initialValue)).filter(
      (param) => !urlSearchParams.has(param)
    );
    if (!currentParams.length) return;
    setUrlSearchParams(mode, value, writeMode);
  }, []);

  useEffect(() => {
    const onParamsChange = () => {
      const searchParams = getUrlSearchParams(mode);
      setValue(getParsedUrlSearchParams(searchParams) as Value);
    };

    window.addEventListener(URL_SEARCH_PARAMS_EVENT, onParamsChange);
    window.addEventListener('popstate', onParamsChange);
    if (mode !== 'history') window.addEventListener('hashchange', onParamsChange);

    return () => {
      window.removeEventListener(URL_SEARCH_PARAMS_EVENT, onParamsChange);
      window.removeEventListener('popstate', onParamsChange);
      if (mode !== 'history') window.removeEventListener('hashchange', onParamsChange);
    };
  }, [mode]);

  return {
    value,
    set
  };
}) as UseUrlSearchParams;

export { createQueryString, dispatchUrlSearchParamsEvent, getUrlSearchParams };
```

Update the import paths to match your project setup.

## Usage

```tsx
const { value, set } = useUrlSearchParams({ initialValue: { page: 1 } });
// or
const { value, set } = useUrlSearchParams({ page: 1 });
```

## Type Declarations

```tsx
export type UrlParams = Record<string, any>;

export type UrlSearchParamsMode = 'hash-params' | 'hash' | 'history';

export interface UseUrlSearchParamsSetOptions {
  /** The mode to use for writing to the URL */
  write?: 'push' | 'replace';
}

export type UseUrlSearchParamsInitialValue<Value> = (() => Value) | Value;

export interface UseUrlSearchParamsOptions<Value> {
  /** The mode to use for writing to the URL */
  mode?: UrlSearchParamsMode;
  /** The mode to use for writing to the URL  */
  write?: 'push' | 'replace';
  /* The deserializer function to be invoked */
  deserializer?: (value: string) => Value[keyof Value];
  /* The serializer function to be invoked */
  serializer?: (value: Value[keyof Value]) => string;
}

export interface UseUrlSearchParamsReturn<Value> {
  /** The value of the url search params */
  value: Value;
  /** The set function */
  set: (value: Partial<Value>, options?: UseUrlSearchParamsSetOptions) => void;
}

export interface UseUrlSearchParams {
  <Value>(
    options: UseUrlSearchParamsOptions<Value> & {
      initialValue: UseUrlSearchParamsInitialValue<Value>;
    }
  ): UseUrlSearchParamsReturn<Value>;

  <Value>(options?: UseUrlSearchParamsOptions<Value>): UseUrlSearchParamsReturn<Value | undefined>;

  <Value>(initialValue: UseUrlSearchParamsInitialValue<Value>): UseUrlSearchParamsReturn<Value>;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options | `UseUrlSearchParamsOptions<Value> & { initialValue: UseUrlSearchParamsInitialValue<Value> }` | - | The options object with required initialValue |
| options.initialValue | `UseUrlSearchParamsInitialValue<Value>` | - | The initial value for the url params |
| options.mode | `UrlSearchParamsMode` | 'history' | The mode to use for the URL ('history' \| 'hash-params' \| 'hash') |
| options.write | `'push' \| 'replace'` | 'replace' | The mode to use for writing to the URL |
| options.serializer | `(value: Value[keyof Value]) => string` | - | Custom serializer function to convert value to string |
| options.deserializer | `(value: string) => Value[keyof Value]` | - | Custom deserializer function to convert string to value |

#### Returns

`UseUrlSearchParamsReturn<Value>` - The object with value and function for change value

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| initialValue | `UseUrlSearchParamsInitialValue<Value>` | - | The initial value for the url params |

#### Returns

`UseUrlSearchParamsReturn<Value>` - The object with value and function for change value