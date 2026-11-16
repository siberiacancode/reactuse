---
title: deepEqual
description: Performs a deep comparison between two values to determine if they are equivalent
category: helpers
usage: low
type: helper
isTest: true
isDemo: true
lastModifiedTime: 1794213760000
---

# deepEqual

Performs a deep comparison between two values to determine if they are equivalent

## Demo

```tsx
import { cn, deepEqual } from '@siberiacancode/reactuse';
import { CheckIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

const Demo = () => {
  const [status, setStatus] = useState<'offline' | 'online'>('online');

  const savedUser = {
    name: 'Alex',
    profile: { status: 'online' }
  };
  const currentUser = {
    name: 'Alex',
    profile: { status }
  };
  const isEqual = deepEqual(savedUser, currentUser);

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
npx useverse@latest add deepEqual
```

### Manual

Copy and paste the following code into your project.

```tsx
/**
 * @name deepEqual
 * @description - Performs a deep comparison between two values to determine if they are equivalent
 * @category Helpers
 * @usage low
 *
 * @param {any} a The first value to compare
 * @param {any} b The second value to compare
 * @returns {boolean} `true` if the two values are deeply equal, `false` otherwise
 *
 * @example
 * deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } });
 */
export const deepEqual = (a: any, b: any): boolean => {
  const seen = new WeakMap<object, WeakSet<object>>();

  const mark = (x: object, y: object) => {
    const visited = seen.get(x);

    if (visited) {
      if (visited.has(y)) return true;
      visited.add(y);
      return false;
    }

    seen.set(x, new WeakSet([y]));
    return false;
  };

  const compare = (x: unknown, y: unknown): boolean => {
    if (Object.is(x, y)) return true;
    if (typeof x !== 'object' || x === null || typeof y !== 'object' || y === null) return false;
    if (Object.getPrototypeOf(x) !== Object.getPrototypeOf(y)) return false;

    if (mark(x, y)) return true;

    if (x instanceof Date) return y instanceof Date && Object.is(x.getTime(), y.getTime());
    if (x instanceof RegExp)
      return y instanceof RegExp && x.source === y.source && x.flags === y.flags;
    if (x instanceof Error)
      return y instanceof Error && x.name === y.name && x.message === y.message;

    if (Array.isArray(x)) {
      if (!Array.isArray(y) || x.length !== y.length) return false;

      for (let index = 0; index < x.length; index += 1) {
        if (!compare(x[index], y[index])) return false;
      }

      return true;
    }

    if (x instanceof Set) {
      if (!(y instanceof Set) || x.size !== y.size) return false;

      for (const value of x) {
        if (!y.has(value)) return false;
      }

      return true;
    }

    if (x instanceof Map) {
      if (!(y instanceof Map) || x.size !== y.size) return false;

      for (const [key, value] of x) {
        if (!y.has(key) || !compare(value, y.get(key))) return false;
      }

      return true;
    }

    const xo = x as Record<PropertyKey, unknown>;
    const yo = y as Record<PropertyKey, unknown>;

    const keysX = [...Object.keys(xo), ...Object.getOwnPropertySymbols(xo)];
    const keysY = [...Object.keys(yo), ...Object.getOwnPropertySymbols(yo)];

    if (keysX.length !== keysY.length) return false;
    if (
      !Object.keys(xo).length &&
      Object.getPrototypeOf(x) !== Object.prototype &&
      Object.getPrototypeOf(x) !== null
    )
      return false;

    for (const key of keysX) {
      if (!Object.hasOwn(yo, key)) return false;
      if (!compare(xo[key], yo[key])) return false;
    }

    return true;
  };

  return compare(a, b);
};
```

Update the import paths to match your project setup.

## Usage

```tsx
deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } });
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| a | `any` | - | The first value to compare |
| b | `any` | - | The second value to compare |

### Returns

`boolean` - `true` if the two values are deeply equal, `false` otherwise