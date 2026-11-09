---
title: shallowEqual
description: Performs a shallow comparison between two values to determine if they are equivalent
category: helpers
usage: low
type: helper
isTest: true
isDemo: true
lastModifiedTime: 1794213760000
---

# shallowEqual

Performs a shallow comparison between two values to determine if they are equivalent

## Demo

```tsx
import { cn, shallowEqual } from '@siberiacancode/reactuse';
import { CheckIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

const Demo = () => {
  const [status, setStatus] = useState<'offline' | 'online'>('online');

  const savedUser = { name: 'Alex', status: 'online' };
  const currentUser = { name: 'Alex', status };
  const isEqual = shallowEqual(savedUser, currentUser);

  return (
    <section className='flex w-full max-w-sm flex-col p-4'>
      <div className='bg-card flex flex-col gap-4 rounded-xl p-5 shadow-sm'>
        <div className='flex items-center gap-3'>
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-full',
              isEqual ? 'bg-emerald-500/15 text-emerald-500' : 'bg-destructive/15 text-destructive'
            )}
          >
            {isEqual ? <CheckIcon className='size-5' /> : <XIcon className='size-5' />}
          </div>

          <div className='flex min-w-0 flex-1 flex-col gap-1'>
            <span className='text-foreground text-sm font-semibold'>Alex</span>
            <span className='text-muted-foreground text-xs capitalize'>{status}</span>
          </div>
        </div>

        <div className='border-border flex items-center justify-between gap-3 border-t pt-3'>
          <span className='text-muted-foreground text-xs'>
            {isEqual ? 'Matches saved profile' : 'Different from saved profile'}
          </span>
          <button
            data-size='sm'
            data-variant='outline'
            type='button'
            onClick={() => setStatus((current) => (current === 'online' ? 'offline' : 'online'))}
          >
            Set {status === 'online' ? 'offline' : 'online'}
          </button>
        </div>
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
npx useverse@latest add shallowEqual
```

### Manual

Copy and paste the following code into your project.

```tsx
/**
 * @name shallowEqual
 * @description - Performs a shallow comparison between two values to determine if they are equivalent
 * @category Helpers
 * @usage low
 *
 * @param {any} a The first value to compare
 * @param {any} b The second value to compare
 * @returns {boolean} `true` if the two values are shallowly equal, `false` otherwise
 *
 * @example
 * shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
 */
export const shallowEqual = (a: any, b: any): boolean => {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;

  if (a instanceof Date) return b instanceof Date && Object.is(a.getTime(), b.getTime());
  if (a instanceof RegExp)
    return b instanceof RegExp && a.source === b.source && a.flags === b.flags;
  if (a instanceof Error) return b instanceof Error && a.name === b.name && a.message === b.message;

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;

    for (let index = 0; index < a.length; index += 1) {
      if (!Object.is(a[index], b[index])) return false;
    }

    return true;
  }

  if (a instanceof Set) {
    if (!(b instanceof Set) || a.size !== b.size) return false;

    for (const value of a) {
      if (!b.has(value)) return false;
    }

    return true;
  }

  if (a instanceof Map) {
    if (!(b instanceof Map) || a.size !== b.size) return false;

    for (const [key, value] of a) {
      if (!b.has(key) || !Object.is(value, b.get(key))) return false;
    }

    return true;
  }

  const ao = a as Record<PropertyKey, unknown>;
  const bo = b as Record<PropertyKey, unknown>;

  const keysA = [...Object.keys(ao), ...Object.getOwnPropertySymbols(ao)];
  const keysB = [...Object.keys(bo), ...Object.getOwnPropertySymbols(bo)];

  if (keysA.length !== keysB.length) return false;
  if (
    !Object.keys(ao).length &&
    Object.getPrototypeOf(a) !== Object.prototype &&
    Object.getPrototypeOf(a) !== null
  )
    return false;

  for (const key of keysA) {
    if (!Object.hasOwn(bo, key)) return false;
    if (!Object.is(ao[key], bo[key])) return false;
  }

  return true;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| a | `any` | - | The first value to compare |
| b | `any` | - | The second value to compare |

### Returns

`boolean` - `true` if the two values are shallowly equal, `false` otherwise