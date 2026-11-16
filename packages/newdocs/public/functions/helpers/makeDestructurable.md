---
title: makeDestructurable
description: Makes an object also iterable for array-style destructuring
category: helpers
usage: low
type: helper
isTest: true
isDemo: true
lastModifiedTime: 1774777329000
---

# makeDestructurable

Makes an object also iterable for array-style destructuring

## Demo

```tsx
import { makeDestructurable } from '@siberiacancode/reactuse';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

const useCounter = (initialValue = 0) => {
  const [value, setValue] = useState(initialValue);

  const inc = (step = 1) => setValue((current) => current + step);
  const dec = (step = 1) => setValue((current) => current - step);

  return makeDestructurable({ value, inc, dec }, [value, { inc, dec }] as const);
};

const Demo = () => {
  const [value, handlers] = useCounter(2);

  return (
    <div className='flex flex-col items-center'>
      <div className='flex items-center gap-6'>
        <button data-size='icon' data-variant='ghost' type='button' onClick={() => handlers.dec()}>
          <MinusIcon strokeWidth={1.5} />
        </button>
        <span className='w-26 text-center text-7xl font-light tabular-nums'>{value}</span>
        <button data-size='icon' data-variant='ghost' type='button' onClick={() => handlers.inc()}>
          <PlusIcon strokeWidth={1.5} />
        </button>
      </div>
    </div>
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
npx useverse@latest add makeDestructurable
```

### Manual

Copy and paste the following code into your project.

```tsx
/**
 * @name makeDestructurable
 * @description - Makes an object also iterable for array-style destructuring
 * @category Helpers
 * @usage low
 *
 * @template Object - The object shape
 * @template Array - The tuple/array shape for destructuring
 * @param {object} obj - Object part of the returned value
 * @param {Array} arr - Iterable tuple/array part of the returned value
 * @returns {object & Array} Combined object that supports both object and array destructuring
 *
 * @example
 * const result = makeDestructurable({ x: 10, y: 20 }, [10, 20] as const);
 */
export const makeDestructurable = <
  Obj extends Record<string, unknown>,
  Arr extends readonly unknown[]
>(
  obj: Obj,
  arr: Arr
): Obj & Arr => {
  if (typeof Symbol !== 'undefined') {
    const clone = { ...obj };

    Object.defineProperty(clone, Symbol.iterator, {
      enumerable: false,
      value() {
        let index = 0;
        return {
          next: () => ({
            value: arr[index++],
            done: index > arr.length
          })
        };
      }
    });

    return clone as unknown as Obj & Arr;
  }

  return Object.assign([...arr], obj) as unknown as Obj & Arr;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const result = makeDestructurable({ x: 10, y: 20 }, [10, 20] as const);
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| obj | `object` | - | Object part of the returned value |
| arr | `Array` | - | Iterable tuple/array part of the returned value |

### Returns

`object & Array` - Combined object that supports both object and array destructuring