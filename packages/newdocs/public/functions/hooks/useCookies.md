---
title: useCookies
description: Hook that manages cookie values
category: state
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useCookies

Hook that manages cookie values

## Demo

```tsx
import { useCookies } from '@siberiacancode/reactuse';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

interface ProfileCookies {
  marketing: boolean;
  notifications: boolean;
  terms: boolean;
  theme: 'dark' | 'light' | 'system';
}

const DEFAULT_SETTINGS: ProfileCookies = {
  notifications: true,
  marketing: false,
  theme: 'system',
  terms: false
};

const THEME_OPTIONS = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' }
] as const;

const TOGGLES = [
  {
    key: 'notifications' as const,
    label: 'Push notifications',
    description: 'Receive alerts about activity'
  },
  {
    key: 'marketing' as const,
    label: 'Marketing emails',
    description: 'News, tips and product updates'
  }
];

const Demo = () => {
  const cookies = useCookies<ProfileCookies>();

  const get = (key: keyof ProfileCookies) => cookies.value[key] ?? DEFAULT_SETTINGS[key];

  const terms = get('terms') as boolean;

  return (
    <section className='flex w-full max-w-sm flex-col gap-6'>
      <div className='flex items-center gap-4'>
        <div data-size='lg' data-slot='avatar'>
          <span data-slot='avatar-fallback'>SC</span>
        </div>
        <div className='min-w-0'>
          <p className='font-semibold'>siberiacancode</p>
          <p className='text-muted-foreground text-xs'>Account settings</p>
        </div>
      </div>

      <div className='flex flex-col gap-1'>
        {TOGGLES.map(({ key, label, description }) => (
          <div key={key} className='flex items-center justify-between py-2.5'>
            <div>
              <p className='text-sm font-medium'>{label}</p>
              <p className='text-muted-foreground text-xs'>{description}</p>
            </div>
            <input
              checked={get(key) as boolean}
              role='switch'
              type='checkbox'
              onChange={(event) => cookies.set(key, event.target.checked)}
            />
          </div>
        ))}
      </div>

      <div className='border-border border-t' />

      <div className='flex items-center justify-between gap-4'>
        <div>
          <p className='text-sm font-medium'>Appearance</p>
          <p className='text-muted-foreground text-xs'>Choose your preferred theme</p>
        </div>
        <div className='relative'>
          <select
            value={get('theme') as string}
            onChange={(event) =>
              cookies.set('theme', event.target.value as ProfileCookies['theme'])
            }
          >
            {THEME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className='text-muted-foreground pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2' />
        </div>
      </div>

      <div
        className='flex cursor-pointer items-start gap-3'
        onClick={() => cookies.set('terms', !terms)}
      >
        <div
          className={cn(
            'relative mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors',
            terms ? 'bg-primary border-primary text-primary-foreground' : 'border-input'
          )}
          aria-checked={terms}
          role='checkbox'
        >
          {terms && <CheckIcon className='size-3' strokeWidth={3} />}
        </div>
        <p className='text-muted-foreground text-xs'>
          I agree to the <span className='text-foreground underline'>terms of service</span> and{' '}
          <span className='text-foreground underline'>privacy policy</span>
        </p>
      </div>

      <div className='flex justify-end'>
        <button type='button'>Save changes</button>
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
npx useverse@latest add useCookies
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useState } from 'react';

import type { RemoveCookieParams, SetCookieParams } from '../useCookie/useCookie';

import {
  COOKIE_EVENT,
  dispatchCookieEvent,
  removeCookie,
  removeCookieItem,
  setCookieItem
} from '../useCookie/useCookie';

/** The cookies params type */
export type CookieParams = Record<string, any>;

/* The use cookies options type */
export interface UseCookiesOptions<Value> {
  /* The deserializer function to be invoked */
  deserializer?: (value: string) => Value[keyof Value];
  /* The serializer function to be invoked */
  serializer?: (value: Value[keyof Value]) => string;
}

export const clearCookies = () => {
  document.cookie.split('; ').forEach((cookie) => {
    const [name] = cookie.split('=');
    removeCookie(name);
  });
};

const clearCookieItems = () => {
  clearCookies();
  dispatchCookieEvent();
};

/**
 * @name useCookies
 * @description - Hook that manages cookie values
 * @category State
 * @usage medium

 * @overload
 * @template {object} Value The type of the cookie values
 * @returns {UseCookieReturn<Value>} The value and the set function
 *
 * @example
 * const { value, set, remove, getAll, clear } = useCookies();
 */
export const useCookies = <Value extends CookieParams>(options?: UseCookiesOptions<Value>) => {
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

  const getParsedCookies = () => {
    if (!document.cookie) return {};

    return Object.fromEntries(
      document.cookie
        .split('; ')
        .map((cookie) => {
          const [key, ...value] = cookie.split('=');
          if (!key || !value.length) return [];
          const decodedValue = decodeURIComponent(value.join('='));
          return [key, deserializer(decodedValue)];
        })
        .filter((entry) => entry.length)
    );
  };

  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return {} as Value;
    return getParsedCookies() as Value;
  });

  useEffect(() => {
    const onChange = () => setValue(getParsedCookies() as Value);

    window.addEventListener(COOKIE_EVENT, onChange);
    return () => {
      window.removeEventListener(COOKIE_EVENT, onChange);
    };
  }, []);

  const set = <Key extends keyof Value>(key: Key, value: Value[Key], options?: SetCookieParams) =>
    setCookieItem(key as string, serializer(value), options);

  const remove = <Key extends keyof Value>(key: Key, options?: RemoveCookieParams) =>
    removeCookieItem(key as string, options);
  const getAll = () => getParsedCookies();
  const clear = () => clearCookieItems();

  return { value, set, remove, getAll, clear };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { value, set, remove, getAll, clear } = useCookies();
```

## Type Declarations

```tsx
import type { RemoveCookieParams, SetCookieParams } from '../useCookie/useCookie';

export type CookieParams = Record<string, any>;

export interface UseCookiesOptions<Value> {
  /* The deserializer function to be invoked */
  deserializer?: (value: string) => Value[keyof Value];
  /* The serializer function to be invoked */
  serializer?: (value: Value[keyof Value]) => string;
}
```

## API

### Returns

`UseCookieReturn<Value>` - The value and the set function