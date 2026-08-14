---
title: useLess
description: Hook that can be so useless
category: humor
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useLess

Hook that can be so useless

> Warning: This hook is a joke. Please do not use it in production code!

## Demo

```tsx
import { useLess } from '@siberiacancode/reactuse';

const Demo = () => {
  useLess();

  return (
    <section className='flex w-full max-w-md flex-col items-center gap-3 p-6'>
      <div className='text-5xl'>🎉</div>
      <div className='flex flex-col items-center gap-1 text-center'>
        <h2 className='text-foreground text-sm font-semibold'>Surprise! It's a joke.</h2>
        <p className='text-muted-foreground text-xs'>
          Don't forget that development is fun — keep building, keep shipping ✨ Maybe you need
          check{' '}
          <a
            className='text-primary underline'
            href='/functions/hooks/useFul'
            rel='noreferrer'
            target='_blank'
          >
            useFul
          </a>{' '}
          hook.
        </p>
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
npx useverse@latest add useLess
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect } from 'react';

/**
 * @name useLess
 * @description - Hook that can be so useless
 * @category Humor
 * @usage low
 *
 * @warning - This hook is a joke. Please do not use it in production code!
 *
 * @template Value The type of the value
 * @param {Value} [value] The value to be returned
 * @returns {Value} The value passed to the hook
 *
 * @example
 * const value = useLess(state);
 */
export const useLess = <Value>(value?: Value) => {
  useEffect(() => {
    console.warn("Warning: You forgot to delete the 'useLess' hook.");
  }, []);

  return value;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const value = useLess(state);
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| value | `Value` | - | The value to be returned |

### Returns

`Value` - The value passed to the hook